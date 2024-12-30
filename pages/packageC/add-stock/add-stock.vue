<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="20" :auto="!isCache"
		auto-show-back-to-top safe-area-inset-bottom :refresher-enabled="false">
		<view slot="top">
			<AppletHeader :title="type === 1 ? '销售' : '进货'" left-icon="arrow-left" right-icon="plus"
				@rightClick="rightClick"></AppletHeader>
			<nav-search-bar right="50rpx" @search="getSearchValue" desc="单号/客户/商品/备注"
				:showRight="false"></nav-search-bar>
		</view>

		<view class="main">
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="list" v-for="(item, index) in dataList" :key="item.id" @click="handleClickItem(item)">
				<view class="list-item">
					<view class="flex flex-between">
						<view class="image-box">
							<u--image radius="10" :showLoading="true" :src="item.cover" width="120rpx"
								height="120rpx"></u--image>
						</view>
						<view class="content">
							<u--text size="18" color="#000" :text="item.name"></u--text>
							<u--text color="#9D9EA0" margin="5px 0" :text="item.mbarCode"></u--text>
							<u--text margin="0 0 5px 0" :text="'库存：' + item.stock"></u--text>
							<u--text mode="price"
								:text="type === 1 ? item.commodityDecimal : item.purchaseDecimal"></u--text>
						</view>
					</view>
					<view class="list-item-number">
						<u-number-box :longPress="false" :min="0" integer bgColor="#ffe0cc" inputWidth="90"
							@change="handleClick(item, $event)" v-model="item.nums"></u-number-box>
					</view>
				</view>
			</view>
		</view>


		<!-- 商品详情弹窗 -->
		<u-popup bgColor="#F1F5F8" :show="shopShow" @close="shopShow = false" :round="10" closeable>
			<view class="modals">
				<view class="flex flex-items-center flex-between modal-header">
					<view class="">
						<u--image :showLoading="true" :src="curShopData.cover" width="60px" height="60px"></u--image>
					</view>
					<view class="modal-content-box">
						<u--text margin="0 0 15px 0" :text="curShopData.name" bold></u--text>
						<u--text color="#9D9EA0" :text="curShopData.mbarCode"></u--text>
					</view>

					<view class="stock">库存：{{ curShopData.stock }}</view>
				</view>

				<view class="modal-card">
					<view class="flex flex-items-center">
						<text class="w16">单价</text>
						<u--input border="none" v-model="curShopData.price" @change="onAlonePrice($event, 1)"
							placeholder="请输入内容"></u--input>
					</view>
					<view class="flex flex-items-center">
						<text class="w16">数量</text>
						<u-number-box :min="0" v-model="curShopData.nums" @change="shopDataChange"></u-number-box>
					</view>
					<view class="flex flex-items-center">
						<text class="w16">总价</text>
						<u--input border="none" v-model="curShopData.total" @change="onAlonePrice($event, 2)"
							placeholder="请输入内容"></u--input>
					</view>
				</view>

				<view class="modal-card">
					<u--text text="备注" size="14"></u--text>
					<u--textarea border="none" v-model="curShopData.remarks" placeholder="请输入内容"></u--textarea>
				</view>

				<view class="abs-button">
					<view class="">
						<view class="money">￥{{ formatMoney(curShopData.total) }}</view>
						<view>种类： 1，数量{{ curShopData.nums }}</view>
					</view>
					<view class="btn flex flex-items-center flex-center" @click="fixOneShopData">确定</view>
				</view>
			</view>
		</u-popup>


		<template slot="bottom">
			<view class="fixed-content flex flex-between flex-items-center">
				<view class="flex flex-items-center">
					<view class="cart-box mr15">
						<u-icon name="shopping-cart" size="30" color="#FA6400"></u-icon>
						<u-badge absolute :offset="[0, -5]" max="99" :value="productCount.toFixed()"></u-badge>
					</view>
					<view class="">
						<u--text color="#FA6400" :text="totalPrice.toFixed(2)" mode="price"></u--text>
						<view class="mt5">种类{{ productKindCount }}，数量{{ productCount.toFixed() }}</view>
					</view>
				</view>

				<view :class="type === 1 ? 'fixed-button istype1' : 'fixed-button istype2'"
					@click="handleSelectionSuccess">
					选好了
				</view>
			</view>
		</template>
	</z-paging>
</template>

<script>
	import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
	import {
		getMaterialList
	} from '@/apis/index.js'
	import Big from 'big.js'
	import {
		cloneDeep,
		formatMoney
	} from '@/utils'
	import {
		DEFAULT_IMAGE
	} from '@/common/contanst'

	export default {
		components: {
			NavSearchBar,
		},
		data() {
			return {
				formatMoney,
				dataList: [],
				keyword: '',
				depotId: 1,
				loading: true,
				selectList: [],
				isCache: false,
				cachePage: 1,
				shopShow: false,
				curShopData: {},
				typeArray: {
					1: {
						text: '销售',
						desc: '名称/条形码/简拼'
					},
					2: {
						text: '进货',
						desc: '单号/客户/商品/备注'
					}
				},
				type: 1
			}
		},
		async onLoad(options) {
			console.log(options)
			this.type = +options?.type || 1
			this.depotId = +options?.storeId || ""
			const storedList = uni.getStorageSync('selectList')
			if (storedList) {
				this.isCache = true
				const page = uni.getStorageSync('currPage') || 1
				this.currPage = +page
				this.selectList = storedList.map((item) => {
					return {
						...item,
						purchaseDecimal: new Big(item.purchaseDecimal),
						commodityDecimal: new Big(item.commodityDecimal),
						nums: new Big(item.nums) // 将字符串转换回 Big 对象
					}
				})
				const selectMap = new Map()
				this.selectList.forEach((el) => {
					selectMap.set(el.id, el)
				})
				const result = await this.$refs.paging.refreshToPage(this.currPage)
				this.dataList = result.totalList.map((item) => {
					if (selectMap.has(item.id)) {
						// 获取选中的 item
						const selectedItem = selectMap.get(item.id)
						// 更新需要同步的属性
						return {
							...item,
							nums: selectedItem.nums
							// 如果有其他属性需要同步，可以在这里添加
						}
					}
					return item
				})
			} else {
				this.selectList = []
			}
		},
		computed: {
			productCount() {
				return this.selectList.reduce((sum, item) => sum.plus(item.nums), new Big(0))
			},
			// sum.plus(item.nums.times(this.type === 1 ? item.commodityDecimal : item.purchaseDecimal)),
			totalPrice() {
				return this.selectList.reduce(
					(sum, item) => sum.plus(item.nums.times(item.price)), new Big(0)
				)
			},
			productKindCount() {
				return this.selectList.length
			}
		},
		methods: {
			onAlonePrice(e, type) {
				console.log(e, type)
				if (type === 1) {
					this.curShopData.price = new Big(e || '0')
					// 重新计算总价
					const total = this.curShopData.price.times(this.curShopData.nums)
					this.curShopData.total = total.toFixed(2)
				}

				if (type === 2) {
					const bTotal = new Big(e || '0')
					// 计算新的单价
					if (!this.curShopData.nums.eq(0)) {
						this.curShopData.bPrice = bTotal.div(this.curShopData.nums)
						this.curShopData.price = this.curShopData.bPrice.toFixed(2)
					} else {
						this.curShopData.price = '0.00'
					}
				}
			},
			fixOneShopData() {
				console.log('确认修改')
				
				// console.log('this.cur商品', this.curShopData)
				// console.error(this.selectList)
				// const index = this.selectList.findIndex(item => item.id === this.curShopData.id)
				// console.error(index)
				// if (this.curShopData.nums) {
				// 	if (index === -1) {
				// 		this.selectList.push(this.curShopData)
				// 	} else {
				// 		this.selectList.splice(index, 1, this.curShopData)
				// 	}
				// } else if (index !== -1) {
				// 	this.selectList.splice(index, 1)
				// }
				this.shopShow = false
			},

			// 修改单个商品的数量
			shopDataChange(e) {
				const value = e.value
				this.curShopData.nums = value.toString()
				try {
					this.curShopData.nums = new Big(value || '0')
					// 重新计算总价
					const total = this.curShopData.price.times(this.curShopData.nums)
					this.curShopData.total = total.toFixed(2)
				} catch (error) {
					console.error('数量输入错误:', error)
					this.curShopData.total = '0.00'
				}
			},
			handleClickItem(item) {
				this.curShopData = item
				// this.shopShow = true
				console.log(item)
			},
			rightClick() {
				// 1是销售的  2 是进货的
				let type = 1
				uni.navigateTo({
					url: '/pages/packageD/set-product/set-product'
				})
			},
			getSearchValue(v) {
				this.loading = true
				console.log('value', v)
				this.keyword = v
				this.$refs.paging.reload()
			},
			formatData(data) {
				return data.map(item => {
					const imgList = item?.imgName?.split(',') || []
					const cover = imgList[0] || DEFAULT_IMAGE

					const price = this.type === 1 ? item.commodityDecimal : item.purchaseDecimal
					return {
						nums: new Big(0),
						id: item.id,
						name: item.name,
						imgList,
						cover,
						purchaseDecimal: new Big(item.purchaseDecimal),
						stock: item.stock,
						mbarCode: item.mbarCode,
						meId: item.meId,
						commodityDecimal: new Big(item.commodityDecimal),
						costPrice: item.costPrice,
						total: 0,
						price: new Big(price),
					}
				})
			},
			handleSelectionSuccess() {
				console.log(this.selectList)
				// let goodsInfo = {
				// 	productKindCount: this.productKindCount,
				// 	total: this.productCount.toFixed(),
				// 	totalPrice: this.totalPrice.toFixed()
				// }
				// uni.setStorageSync('goodsInfo', goodsInfo)
				// 缓存选择列表 处理big类型
				this.saveSelectList()
				uni.setStorageSync('currPage', this.cachePage)
				uni.navigateBack()
			},
			saveSelectList() {
				// 深拷贝 selectList，以免修改原始数据
				const listToStore = this.selectList.map((item) => {
					return {
						...item,
						purchaseDecimal: item.purchaseDecimal.toString(),
						commodityDecimal: item.commodityDecimal.toString(),
						nums: item.nums.toString() // 将 Big 对象转换为字符串
					}
				})
				uni.setStorageSync('selectList', listToStore)
			},
			async queryList(pageNo, pageSize) {
				this.cachePage = pageNo
				try {
					// this.cachePage ? pageNo + this.cachePage - 1 : pageNo
                    // 新增门店逻辑 进货、进货预订、销售退货看到所有商品。
					// if (this.type === 2 && )

					let orderType = this.type === 1 ? '销售' : '进货'

					let search = {
						materialParam: this.keyword,
						depotId: this.depotId,
						orderType
					}

					console.error('请求参数', search)
					const {
						data
					} = await getMaterialList({
						currentPage: pageNo,
						pageSize,
						search
					})
					let {
						rows,
						totalStockCount,
						total
					} = data || {}
					let array = this.formatData(rows)
					this.$refs.paging.complete(array)
					this.loading = false
				} catch (e) {
					console.log('请求失败', e)
					this.$refs.paging.complete(false)
				}
			},
			handleClick(item, e) {
				// 获取新值并转换为 Big 类型
				let newValue = e.value
				let bigValue = new Big(newValue)

				item.nums = bigValue
				let index = this.selectList.findIndex((i) => i.id === item.id)

				if (bigValue.gt(0)) {
					if (index === -1) {
						let clonedItem = cloneDeep(item)
						this.selectList.push({
							...clonedItem
						})
					} else {
						this.selectList[index].nums = bigValue
					}
				} else {
					if (index !== -1) {
						this.selectList.splice(index, 1)
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.list {
		&-item {
			padding: 20rpx;
			background-color: #fff;
			border-bottom: 1rpx solid #e4e7ed;

			&-number {
				display: flex;
				justify-content: flex-end;
			}

			.content {
				margin-left: 20px;
				flex: 1;
			}
		}
	}

	.minus {
		width: 22px;
		height: 22px;
		border-width: 1px;
		border-color: #e6e6e6;
		border-style: solid;
		border-top-left-radius: 100px;
		border-top-right-radius: 100px;
		border-bottom-left-radius: 100px;
		border-bottom-right-radius: 100px;
		@include flex;
		justify-content: center;
		align-items: center;
	}

	.input {
		padding: 0 10px;
	}

	.plus {
		width: 22px;
		height: 22px;
		background-color: #ff0000;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	.main {}

	.modals {
		padding: 30rpx 30rpx 0 30rpx;
		height: 70vh;
		width: 100%;
		position: relative;

		.abs-button {
			position: absolute;
			z-index: 1000;
			background-color: #fff;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 200rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 25rpx;
			box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);

			.money {
				color: #fa6400;
				font-weight: 700;
				font-size: 36rpx;
				margin-bottom: 15px;
			}

			.btn {
				width: 180rpx;
				height: 90rpx;
				background: linear-gradient(to right, #fa6400, #f79151);
				border-radius: 20rpx;
				color: #fff;
				font-weight: 700;
			}
		}

		.modal-card {
			border-radius: 20rpx;
			background: #fff;
			padding: 40rpx 40rpx 20rpx 40rpx;
			margin-bottom: 17rpx;

			view {
				margin-bottom: 20px;
			}

			.w16 {
				width: 140rpx;
			}
		}

		.modal-header {
			width: 100%;
			margin-bottom: 17rpx;
		}

		.modal-content-box {
			flex: 1;
			margin: 0 10px;
		}

		.stock {
			color: #9d9ea0;
			display: flex;
			align-items: flex-end;
			height: 55px;
		}
	}


	.fixed-content {
		padding: 32rpx;
		background-color: #fff;

		.fixed-button {
			width: 180rpx;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
			border-radius: 20rpx;
			color: #fff;
			font-weight: 700;
		}

		.istype1 {
			background: linear-gradient(to right, #5fcadd, #6adae8);
		}

		.istype2 {
			background: linear-gradient(to right, #fa6400, #f79151);
		}

		.cart-box {
			position: relative;
			font-size: 28rpx;
		}
	}
</style>