<template>
	<view>
		<AppletHeader :title="type === 1 ? '销售单详情' : '进货单详情'" :right-icon="isDelete ? ' ' : 'more-dot-fill'" @rightClick="rightClick">
		</AppletHeader>
		<view class="container">
			<view class="white box">
				<view class="flex flex-between flex-items-center">
					<view class="flex flex-items-center">
						<text class="fix" v-if="isDelete">已作废</text>
						<text class="name">{{ name }}</text>
					</view>
					<text>{{ time }}</text>
				</view>
				<u-divider :dot="true"></u-divider>
				<view class="flex flex-items-center" v-for="item in list" :key="item.id">
					<text class="mr15">{{ item.text }}：</text>
					<text>{{ item.desc }}</text>
				</view>
			</view>

			<view class="white product mt10">
				<view class="title mb20">
					<text class="line"></text>
					<text>{{ type === 1 ? '销售商品' : '进货商品' }}</text>
				</view>

				<view class="flex mb20" v-for="item in productList" :key="item.id">
					<view class="imagebox">
						<image v-if="item.cover" mode="widthFix" :src="item.cover"></image>
					</view>
					<view class="content">
						<u--text :text="item.name"></u--text>
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
				<view class="money-main ">
					<text>合计 已选{{totalOperNumber}}，</text>
					<text class="money">￥{{formatMoney(total)}}</text>
				</view>
			</view>

			<view class="white box mt10">
				<view class="flex flex-items-center" v-for="item in bootomList" :key="item.id">
					<text class="mr15 mb5">{{ item.text }}：</text>
					<u--text :mode="item.id !== 1 ? 'price' : 'text'" :text="item.desc"></u--text>
				</view>
			</view>

			<view class="white remark mt10">
				<u--text text="备注"></u--text>
				<u--text :text="remark"></u--text>
			</view>

			<view class="fixed-bottom" v-if="!isDelete">
				<view class="fixed-bottom-button" @click="fixItems">
					<u-icon size="24" name="edit-pen"></u-icon>
					<text>修改</text>
				</view>
			</view>

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
		formatMoney
	} from '@/utils'
	import {
		getDetailByNumbe,
		deleteDepotHead
	} from '@/apis'
	import Big from 'big.js'
	export default {
		data() {
			return {
				formatMoney,
				number: '',
				list: [],
				bootomList: [],
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
			}
		},
		onShow() {
			uni.removeStorageSync('goodsUpdate')
			uni.removeStorageSync('goodsInfo')
			uni.removeStorageSync('selectList')
		},
		onLoad(options) {
			// number 订单号  和 type 类型 1 销售  2 进货
			console.log('是多少', options)
			this.number = options?.number || ''
			this.type = +options?.type || 1
			this.getData()
		},
		methods: {
			onSelect(e) {
				console.log(e)
				if (e.id === 2) {
					// 作废
					this.modalShow = true
				} else {
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
			fixItems() {
				// 去修改前需要记录数据
				console.log('修改', this.productList)

				// let purchaseDecimal = 0 , commodityDecimal = 0
				// if (this.type === 1) {
				// }

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
				// return
				uni.navigateTo({
					url: `/pages/packageB/set-form/set-form?type=${this.type}&isUpdate=1`
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
			},
			rightClick() {
				this.show = !this.show
			},
			async getData() {
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
					fileName,
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
					id
				} = data || {}
				this.total = totalPrice
				this.updateData = {
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
					id
				}

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
						desc: formatDateToChinese(operTime)
					}
				]

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
						desc: changeAmount
					}
				]
				this.productList = formatImageArray(depotHeadMaterialVoList)
				console.log('数据', data)
				this.totalOperNumber = this.productList.reduce((sum, item) => sum + item.operNumber, 0);
				console.log('productList', this.productList)
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		padding-bottom: 100px;

		.fixed-bottom {
			box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);

			&-button {
				width: 240rpx;
				height: 90rpx;
				background: #fff;
				border-radius: 20rpx;
				border: 1px solid #ccc;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #000;
				margin: auto;
			}
		}

		.money-main {
			text-align: right;
			color: #9D9EA0;

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
			}

			.fix {
				color: #5B6066;
				font-weight: normal;
				height: 32rpx;
				line-height: 32rpx;
				padding: 0 10rpx;
				font-size: 26rpx;
				background: #EFF4F8;
				margin-right: 10rpx;
				border-radius: 8rpx;
			}
			
			.name {
				font-weight: 600;
				color: #141414;
				font-size: 32rpx;
			}
		}

		.remark {
			height: 300rpx;
		}
	}
</style>