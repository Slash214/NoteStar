<template>
	<view>
		<AppletHeader :title="genTitle()" :right-icon="isDelete || isH ? ' ' : 'more-dot-fill'"
			@rightClick="rightClick">
		</AppletHeader>
		<view class="container" v-if="productList.length">
			<view class="white box">
				<view class="flex flex-between flex-items-center">
					<view class="flex flex-items-center">
						<view class="name">{{ name }}</view>
						<view class="fix" v-if="isDelete || deleteFlag == 1">已作废</view>
						<view class="status" v-if="statusType === 2">
							{{changeText || statusObj[type].status[curStatus]}}
						</view>
					</view>
					<view>{{ time }}</view>
				</view>
				<u-divider :dot="true"></u-divider>
				<view class="flex flex-items-center" v-for="item in list" :key="item.id">
					<text class="mr15">{{ item.text }}：</text>
					<view>{{ item.desc }}</view>
				</view>
			</view>

			<view class="white product mt10">
				<view class="title mb20">
					<text class="line"></text>
					<text>{{ type === 1 ? '销售商品' : '进货商品' }}</text>
				</view>

				<view class="flex mb20" v-for="item in displayedProductList" :key="item.id">
					<view class="imagebox">
						<image lazy-load v-if="item.cover" mode="widthFix" :src="item.cover"></image>
					</view>
					<view class="content">
						<u--text bold :text="item.name"></u--text>
						<u--text :text="item.barCode"></u--text>
						<view class="flex mt10">
							<view class="flex">
								<u--text mode="price" :text="item.unitPrice"></u--text>
								<text class="ml5 mr5">x</text>
								<text>{{ item.operNumber }}</text>
							</view>
							<u--text align="right" mode="price" :text="item.allPrice"></u--text>
						</view>
					</view>
				</view>
				<u-divider dot :hairline="true"></u-divider>
				<view class="money-main">
					<text>合计 已选{{ totalOperNumber }}，</text>
					<text class="money">￥{{ formatMoney(total) }}</text>
				</view>
			</view>

			<view class="white box mt10">
				<view class="flex flex-items-center" v-for="item in bootomList" :key="item.id">
					<text class="mr15 mb5">{{ item.text }}：</text>
					<view class="" v-if="item.id !== 1">￥{{ formatMoney(item.desc) }}</view>
					<view v-else>{{ item.desc }}%</view>
				</view>
			</view>

			<view class="white remark mt10">
				<u--text margin="10px 0" size="14" text="备注:"></u--text>
				<u--text size="14" :text="remark"></u--text>
				
				<view class="imglist">
					<image v-for="(item, key) of imgList" :key="key" :src="item" mode="widthFix"></image>
				</view>
			</view>

			<block v-if="!isH && curStatus < 2">
				<view class="fixed-bottom" v-if="!isDelete || deleteFlag != 1">
					<view class="fixed-bottom-button" @click="fixItems(true)">
						<u-icon size="24" name="edit-pen"></u-icon>
						<text>修改</text>
					</view>

					<view :class="type === 1 ? 'btns xs' : 'btns jh'" v-if="statusType ===  2" @click="fixItems(false)">
						{{ type === 1 ? '转销售' : '转进货'}}
					</view>
				</view>
			</block>

			<u-modal showCancelButton :show="modalShow" @confirm="onDelete" @cancel="modalShow = false" title="温馨提示"
				content="确定作废当前单据吗？作废后不可恢复"></u-modal>
			<u-action-sheet :actions="actionsList" cancelText="取消" @close="show = false" @select="onSelect"
				:show="show"></u-action-sheet>
		</view>
	</view>
</template>

<script>
	import {
		formatDateToChinese,
		formatImageArray,
		formatMoney,
		formatDateTime
	} from '@/utils'
	import {
		getDetailByNumbe,
		deleteDepotHead,
		closeTransfer,
		openTransfer
	} from '@/apis'
	import Big from 'big.js'
	export default {
		data() {
			return {
				deleteFlag: '0',
				formatMoney,
				number: '',
				list: [],
				bootomList: [],
				statusType: 1,
				name: '',
				time: '',
				remark: '',
				productList: [],
				type: 1,
				show: false,
				modalShow: false,
				actionsList: [{
						id: 1,
						name: '历史记录'
					},
					{
						id: 2,
						name: '作废'
					}
				],
				id: 0,
				isDelete: false,
				updateData: {},
				total: 0,
				totalOperNumber: 0,
				// 是否是历史记录查看状态
				isH: false,

				currentPage: 1,
				pageSize: 20,
				totalPages: 1, // 总页数，根据数据量计算
				transferOrderId: 0,
				isFix: false,
				
				changeText: "",
				
				// 0 1 2已完成 3已关闭
				curStatus: 0,
				localCacheStatus: 0,
				
				imgList: [],
				
				
				statusObj: {
					1: {
						name: '销售',
						status: {
							0: '未转销售',
							1: '部分转销售',
							2: '已完成',
							3: '已关闭',
						}
					},
					2: {
						name: '进货',
						status: {
							0: '未转进货',
							1: '部分转进货',
							2: '已完成',
							3: '已关闭',
						}
					}
				}
			}
		},
		onShow() {
			;
			['goodsUpdate', 'goodsInfo', 'selectList'].forEach((item) => uni.removeStorageSync(item))
		},
		computed: {
			displayedProductList() {
				return this.productList.slice(0, this.currentPage * this.pageSize)
			}
		},
		watch: {
			productList(newVal) {
				// 当 productList 更新时，计算总页数
				this.totalPages = Math.ceil(newVal.length / this.pageSize)
			}
		},
		mounted() {
			// 页面加载完成后，延迟加载更多数据
			this.$nextTick(() => {
				this.autoLoadMore()
			})
		},
		onLoad(options) {
			// number 订单号  和 type 类型 1 销售  2 进货
			console.log('参数', options)

			uni.showLoading({
				title: '加载中...'
			})

			this.number = options?.number || ''
			this.type = +options?.type || 1
			this.statusType = +options?.status || 1			
			this.transferOrderId = +options?.id

			this.isH = options?.h == 1 ? true : false
			this.getData()
		},
		methods: {
			genTitle() {
				// 1. 根据 type 决定是「销售」还是「进货」
				const prefix = this.type === 1 ? '销售' : '进货';
				// 2. 如果是退单，直接返回
				if (this.statusType === 3) {
					return `${prefix}退单`;
				}
				// 3. 判断是普通单还是预订单
				const orderText = this.statusType === 2 ? '预订单' : '单';
				// 4. 判断是否需要显示「历史记录详情」
				const suffix = this.isH ? '历史记录详情' : '详情';
				// console.error(this.statusType)
				// 5. 拼接结果
				return `${prefix}${orderText}${suffix}`;
			},
			
			// genStatus() {
			// 	let status = this.type === 1 ? this.updateData.saleStatus : this.updateData.purchaseStatus 
			// 	console.error('status', status)
				
			// 	return status
			// },
			autoLoadMore() {
				if (this.currentPage < this.totalPages) {
					// 延迟加载下一页数据
					setTimeout(() => {
						this.currentPage += 1
						this.updateTotalOperNumber()
						// 递归调用，直到加载完所有数据
						this.autoLoadMore()
					}, 100) // 可以根据需要调整延迟时间
				}
			},
			loadMore() {
				if (this.displayedProductList.length < this.productList.length) {
					this.currentPage += 1
					// Update totalOperNumber to reflect newly loaded items
					this.updateTotalOperNumber()
				}
			},
			updateTotalOperNumber() {
				this.totalOperNumber = this.displayedProductList.reduce((sum, item) => sum + item.operNumber, 0)
			},
			async onSelect(e) {
				console.log(e)
				if (e.id === 2) {
					// 作废
					this.modalShow = true
				} else {
					
					if (this.statusType === 2) {
						// 关闭和确用预订单
						console.log('关闭', this.curStatus)
						const FN = this.curStatus === 3 ? openTransfer : closeTransfer  
						const { data } = await FN({ headerId: this.updateData.id })
						
						
						let prefix = this.curStatus === 3 ? '开启' : '关闭'
						uni.showToast({
							title:  prefix + '成功',
							icon: 'none'
						})
						
						// 关闭成功就为历史状态
						if (this.curStatus === 3) {
							this.isH = false
							this.changeText = '已开启'
							this.curStatus = this.localCacheStatus
							// this.getData()
						} else {
							this.isH = true
							this.changeText = '已关闭'
							this.curStatus = 3
							// this.getData()
						}
							
						this.actionsList[0] = { id: 1, name: prefix === '开启' ? '关闭' : '开启'}
						// console.error(this.actionsList)
						return
					}
					
					
					uni.navigateTo({
						url: `/pages/packageD/history/history?type=${this.type}&number=${this.number}`
					})
				}
			},
			async onDelete() {
				console.log('确认删除')
				this.modalShow = false
				await deleteDepotHead({
					id: this.id
				})
				this.isDelete = true
			},

			fixItems(bol) {
				// 去修改前需要记录数据
				
				this.isFix = bol
				console.log('是否是修改', this.isFix)
				
				console.log('修改', this.productList)
				let selectList = this.productList.map((item) => ({
					id: item.materialId,
					cover: item.cover,
					imgList: item.imgList,
					mbarCode: item.barCode,
					name: item.name,
					stock: item.stock,
					purchaseDecimal: new Big(item.purchaseDecimal),
					commodityDecimal: new Big(item.commodityDecimal),
					nums: new Big(item.operNumber),
					costPrice: item.costPrice,
					meId: item.meId,
					total: item.allPrice
				}))
				console.log(selectList)

				let total = selectList.reduce((sum, item) => sum.plus(item.nums), new Big(0))
				let totalPrice = selectList.reduce(
					(sum, item) =>
					sum.plus(item.nums.times(this.type === 1 ? item.commodityDecimal : item.purchaseDecimal)),
					new Big(0)
				)
				console.log('其他参数', this.updateData)
				let goodsInfo = {
					productKindCount: selectList.length,
					total: total.toFixed(),
					totalPrice: totalPrice.toFixed()
				}
				console.log('其他参数', goodsInfo)
				uni.setStorageSync('goodsInfo', goodsInfo)
				uni.setStorageSync('goodsUpdate', this.updateData)
				this.saveSelectList(selectList)
				
				// 
				let url = `/pages/packageB/set-form/set-form?type=${this.type}&isUpdate=1&status=${this.statusType}`
				
				if (!this.isFix) {
					url = `${url}&id=${this.transferOrderId}`
				}
				
				
				
			
				// return
				uni.navigateTo({
					url
				})
			},

			saveSelectList(selectList) {
				// 深拷贝 selectList，以免修改原始数据
				const listToStore = selectList.map((item) => {
					return {
						...item,
						purchaseDecimal: item.purchaseDecimal.toString(),
						commodityDecimal: item.commodityDecimal.toString(),
						nums: item.nums.toString() // 将 Big 对象转换为字符串
					}
				})
				uni.setStorageSync('selectList', listToStore)
				if (this.transferOrderId) {
					uni.setStorageSync('transferOrderList', listToStore)
				}
			},
			rightClick() {
				this.show = !this.show
			},

			async getData() {
				try {
					const {
						data
					} = await getDetailByNumbe({
						number: this.number
					})
					this.id = data.id
					let {
						number,
						depotName,
						creatorName,
						salesName,
						operTime,
						discount,
						discountLastMoney,
						otherMoney,
						changeAmount,
						totalPrice,
						createTime,
						organName,
						remark,
						depotHeadMaterialVoList,
						depotId,
						salesMan,
						subType,
						type,
						creator,
						moneyAroundDown,
						discountMoney,
						grossProfit,
						status,
						id,
						deleteFlag,
						purchaseStatus,
						saleStatus,
						// 预订
						depositDeducted,
						depositPaid,
						depositRemaining,
						fileName,
					} = data || {}
					this.total = totalPrice
					this.updateData = {
						depositDeducted,
						fileName,
						depositPaid,
						depositRemaining,
						depotId,
						number,
						salesMan,
						subType,
						type,
						changeAmount,
						creator,
						operTime,
						organName,
						moneyAroundDown,
						discount,
						discountLastMoney,
						discountMoney,
						otherMoney,
						remark,
						grossProfit,
						status,
						purchaseStatus,
						saleStatus,
						id
					}
					this.deleteFlag = deleteFlag
					this.list = [{
							id: 1,
							text: '单据编号',
							desc: number
						},
						{
							id: 2,
							text: '门店',
							desc: depotName
						},
						{
							id: 3,
							text: '业务员',
							desc: salesName
						},
						{
							id: 4,
							text: '制单人',
							desc: creatorName
						},
						{
							id: 5,
							text: '制单时间',
							desc: formatDateTime(operTime)
						}
					]


                    if (fileName) {
						this.imgList = fileName.split(',')
						console.log('图片数组', this.imgList)
					}
					this.name = organName
					this.time = formatDateToChinese(createTime)
					this.remark = remark
					this.bootomList = [{
							id: 1,
							text: '整单折扣',
							desc: discount
						},
						{
							id: 2,
							text: '折后金额',
							desc: discountLastMoney
						},
						{
							id: 3,
							text: '运费',
							desc: otherMoney
						},
						{
							id: 4,
							text: '本单应收',
							desc: totalPrice
						},
						{
							id: 5,
							text: '本单已收',
							desc: depositPaid || 0
						}
					]
					this.productList = formatImageArray(depotHeadMaterialVoList)

					this.updateTotalOperNumber()
					// console.log('数据', data)
					// this.totalOperNumber = this.productList.reduce((sum, item) => sum + item.operNumber, 0)
					// console.log('productList', this.productList)
					// 页面加载完成后，开始自动加载更多数据
					this.$nextTick(() => {
						this.autoLoadMore()
					})
					
					
					if (this.statusType === 2) {
						this.curStatus = this.type === 1 ? +saleStatus || 0 : +purchaseStatus || 0
						this.localCacheStatus = this.curStatus
						this.actionsList[0] = { id: 1, name: this.curStatus === 3 ? '开启' : '关闭'}
					}

					uni.hideLoading()
				} catch (error) {
					console.error('数据加载失败:', error)
					uni.showToast({
						title: '数据加载失败，请重试',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		padding-bottom: 100px;

		.fixed-bottom {
			box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
			display: flex;
			align-items: center;
			justify-content: space-around;

			&-button {
				width: 240rpx;
				height: 90rpx;
				background: #fff;
				border-radius: 10rpx;
				border: 1px solid #ccc;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #000;
			}

			.btns {
				width: 240rpx;
				height: 90rpx;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
			}

			.xs {
				background-color: #5fcadd;
			}

			.jh {
				background-color: #fa6400;
			}
		}

		.money-main {
			text-align: right;
			color: #9d9ea0;

			.money {
				font-weight: 700;
				color: #000;
			}
		}

		.white {
			background-color: #fff;
			padding: 25rpx;
			border-radius: 20rpx;
		}

		.product {
			.title {
				font-weight: 700;
				height: 60rpx;

				.line {
					width: 6rpx;
					height: 30rpx;
					background-color: #5fcadd;
					margin-right: 15rpx;
				}
			}

			.imagebox {
				width: 60px;
				height: 60px;
				border-radius: 20rpx;
				margin-right: 10px;
				background-color: #cdd7dc;
				overflow: hidden;

				image {
					width: 100%;
				}
			}

			.content {
				flex: 1;
			}
		}

		.box {
			text-align: justify;

			text {
				line-height: 2;
				color: #575757;
				font-size: 28rpx;
				width: 160rpx;
			}

			.fix {
				font-size: 28rpx;
				height: 50rpx;
				width: 140rpx;
				line-height: 50rpx;
				text-align: center;
				border-radius: 8rpx;
				color: #5b6066;
				font-weight: normal;
				background: #eff4f8;
				margin-left: 20rpx;
				display: block;
			}
			
			.status {
				font-size: 28rpx;
				height: 50rpx;
			    width: 140rpx;
				line-height: 50rpx;
				text-align: center;
				border-radius: 8rpx;
				color: #5b6066;
				font-weight: normal;
				background: #eff4f8;
				margin-left: 20rpx;
				display: block;
			}

			.name {
				font-weight: 600;
				color: #141414;
				font-size: 32rpx;
			}
		}
		
		

		.remark {
			height: 300rpx;
			
			.imglist {
				margin-top: 30rpx;
				display: flex;
				flex-wrap: wrap;
				image {
					display: block;
					width: 120rpx;
					margin: 0 16rpx 16rpx 0;
				}
			}
		}
	}
</style>