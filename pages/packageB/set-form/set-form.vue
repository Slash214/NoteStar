<template>
	<view class="main">
		<AppletHeader :title="type === 1 ? '销售单' : '进货单'"></AppletHeader>
		<view class="container">
			<view class="white box">
				<view class="box-item">
					<view class="box-item-start">*门店</view>
					<view class="box-item-mid">{{ curSelectStore.name }}</view>
					<view class="box-item-end" @click="selectStore">
						<u-icon name="arrow-down-fill" color="#c0c4cc" size="13"></u-icon>
					</view>
				</view>
			</view>
			<!-- 门店列表 -->
			<u-picker :show="storeShow" @confirm="getSelectStore" :columns="columns" keyName="name"></u-picker>
			<!-- 业务员列表 -->
			<u-picker :show="salesonShow" @cancel="toggleShow" @confirm="getSelectSales" :columns="saleColumns" keyName="name"></u-picker>
			<view class="white box mt20">
				<view class="box-item" v-for="item in serviceList" :key="item.id">
					<view class="box-item-start">{{ item.title }}</view>
					<view class="box-item-mid">{{ item.value }}</view>
					<view class="box-item-end" @click="serviceClick(item)">
						<u-icon :name="item.icon" color="#c0c4cc" size="13"></u-icon>
					</view>
				</view>
			</view>
			<view class="white box store mt20">
				<view class="flex flex-items-center" @click="selectProduct">
					<image mode="widthFix" style="width: 50rpx" src="@/static/purchase/icon-select.png"></image>
					<text class="ml10">选择商品</text>
				</view>
				<view class="flex flex-items-center" @click="scanToAdd">
					<image mode="widthFix" style="width: 50rpx" src="@/static/purchase/icon-scan.png"></image>
					<text class="ml10">扫码添加</text>
				</view>
			</view>

			<view class="white box mt20 product">
				<view class="product-title">
					<u-line hairline="false" direction="col"></u-line>
					<text>{{ type === 1 ? '销售商品' : '进货商品'}}</text>
				</view>

				<view class="product-content">
					<u-swipe-action>
						<u-swipe-action-item :options="options" v-for="(item, index) of cacheSelectList" :key="item.id" :index="index" :name="item.name" @click="handleClickAction">
							<view class="swipe-action flex u-border-bottom">
								<u--image radius="10" :showLoading="true" :src="item.imgName" width="60px" height="60px"></u--image>
								<view class="ml10 swipe-action-content">
									<u--text :text="item.name"></u--text>
									<u--text :text="item.mbarCode"></u--text>
									<view class="">
										<u--text mode="price" :text="item.purchaseDecimal"></u--text>
										x
										<text>{{ item.nums }}</text>
									</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>

				<view class="mt20 product-end">
					<view class="flex flex-items-center">
						<text>合计 已选{{ length }}，</text>
						<u--text bold mode="price" :text="totalPrice"></u--text>
					</view>
					<view class="flex mt10 flex-items-center">毛利润：￥{{ form.grossProfit }}</view>
				</view>
			</view>

			<view class="white box mt20">
				<view class="box-item" v-for="item in priceList" :key="item.id">
					<view class="box-item-start">{{ item.title }}</view>
					<view class="box-item-mid">
						<u--text :text="item.value" mode="price"></u--text>
					</view>
					<view class="box-item-end">
						{{ item.end }}
					</view>
				</view>
			</view>

			<view class="white box mt20 remark">
				<view class="mb10">备注</view>
				<u--textarea border="none" v-model="remark" placeholder="在这里输入备注"></u--textarea>
			</view>
		</view>

		<fixed-bottom height="100px">
			<view class="bottom-content flex flex-items-center flex-between">
				<view class="">
					<view class="flex flex-items-center">
						<text>应付：</text>
						<u--text mode="price" :text="totalPrice" color="#FA6400"></u--text>
					</view>
					<view class="flex flex-items-center mt5">
						<text>本次实付：</text>
						<u--text mode="price" :text="totalPrice" color="#ccc"></u--text>
					</view>
				</view>

				<view class="red-button">保存</view>
			</view>
		</fixed-bottom>
	</view>
</template>

<script>
import FixedBottom from '@/components/FixedBottom/FixedBottom.vue'
import { getDepotByUserId, getUserByDepotId, getAccountByDepotId } from '@/apis'
import Big from 'big.js'

export default {
	components: {
		FixedBottom
	},
	data() {
		return {
			type: 1,
			storeShow: false,
			salesonShow: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#f56c6c'
					}
				}
			],
			remark: '',
			serviceList: [
				{ id: 1, title: '*客户', value: '零售客户', icon: '' },
				{ id: 2, title: '时间', value: '', icon: 'arrow-down-fill' },
				{ id: 3, title: '*业务员', value: '', icon: 'arrow-down-fill' }
			],
			priceList: [
				{ id: 1, title: '整单折扣', value: 100, end: '%' },
				{ id: 2, title: '优惠金额', value: 0, end: '' },
				{ id: 3, title: '折后金额', value: 0, end: '' },
				{ id: 4, title: '运费', value: 0, end: '' }
			],
			length: 0,
			totalPrice: '',
			nowPrice: '',
			curSelectStore: {},
			curSelectSales: {},
			shopList: [],
			columns: [],
			saleColumns: [],
			salesRepList: [],

			loadIndex: 0,
			batchSize: 20,

			form: {
				discount: 100, // 整单折扣
				discountMoney: 0, // 优惠金额
				discountLastMoney: 0, // 折后金额
				otherMoney: 0, // 运费,
				grossProfit: 0 // 毛利润
			},

			cacheSelectList: []
		}
	},
	onShow() {
		const list = uni.getStorageSync('selectList')
		if (list) {
			console.log('选择了商品', list)
			const info = uni.getStorageSync('goodsInfo')
			this.totalPrice = info.totalPrice
			this.length = info.productKindCount
			// this.cacheSelectList = list

			// 开始分批次加载数据
			this.loadBatchData(list)
			// 计算毛利润
			this.genGrossPrice(list)
		}
	},
	onLoad(options) {
		this.type = +options?.type || 1
		console.log('参数', options)
		this.getData()
	},
	methods: {
		loadBatchData(list) {
			const start = this.loadIndex * this.batchSize
			const end = start + this.batchSize
			const batchData = list.slice(start, end)
			// 合并数据
			this.cacheSelectList = this.cacheSelectList.concat(batchData)
			this.length = this.cacheSelectList.length
			// 判断是否还有更多数据需要加载
			if (end < list.length) {
				this.loadIndex++
				// 每隔一秒加载下一批数据
				setTimeout(() => {
					this.loadBatchData(list)
				}, 1000)
			}
		},
		genGrossPrice(list) {
			let totalProfit = list.reduce((accumulator, currentItem) => {
				const commodityDecimal = new Big(currentItem.commodityDecimal)
				const costPrice = new Big(currentItem.costPrice)
				const operNumber = new Big(currentItem.nums)
				const itemProfit = commodityDecimal.minus(costPrice).times(operNumber)
				return accumulator.plus(itemProfit)
			}, new Big(0))
			this.form.grossProfit = totalProfit.toFixed(2)

			console.log('mao', this.form.grossProfit)
		},
		handleClickAction(e) {
			console.log('删除', e)
		},
		selectStore() {
			this.storeShow = !this.storeShow
		},
		getSelectStore(e) {
			this.curSelectStore = e.value[0]
			console.log('搜索', this.curSelectStore)
			this.selectStore()
		},
		serviceClick(item) {
			console.log('点击事情', item)
			if (item.id === 3) {
				this.toggleShow()
			}
		},
		getSelectSales(v) {
			console.log('选择的', v)
			this.toggleShow()
			this.curSelectSales = v.value[0]
			this.serviceList[2].value = this.curSelectSales.name
		},
		toggleShow() {
			this.salesonShow = !this.salesonShow
		},
		async getData() {
			const user = uni.getStorageSync('userInfo')
			const [r1, r2, r3] = await Promise.all([getDepotByUserId({ userId: user.id }), getUserByDepotId({ depotId: 1 }), getAccountByDepotId({ depotId: 1 })])
			console.log('请求的数据', r1, r2, r3)

			this.shopList = r1.data
			this.columns = [this.shopList.map((item) => ({ id: item.id, name: item.name, location: item.location }))]
			this.curSelectStore = this.shopList[0]

			this.salesRepList = r2.data.map((item) => ({ ...item, name: item.userName }))
			this.serviceList[2].value = this.salesRepList[0]?.name
			this.saleColumns = [this.salesRepList]

			// 时间
		},
		selectProduct() {
			console.log('选择商品')
			uni.navigateTo({
				url: '/pages/packageC/add-stock/add-stock'
			})
		},
		scanToAdd() {
			console.log('扫码添加')
			uni.showToast({
				title: '开发中',
				icon: 'none'
			})
			
			uni.scanCode({
				scanType: ['barCode'],
				enableFlash: true,
				success: async res => {
					console.log(res)
				},
				fail: err => {
					console.error('err', err)
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
.main {
	padding-bottom: 120px;
}

.white {
	background-color: #fff;
	border-radius: 20rpx;
}

.product {
	padding: 40rpx !important;
	&-title {
	}
	&-content {
		.swipe-action {
			padding: 40rpx 0;
			&-content {
				flex: 1;
			}
		}
	}
	&-end {
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		align-items: flex-end;
	}
}

.box {
	padding: 0 40rpx;
	width: 100%;
	font-size: 28rpx;
	&-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #303133;
		&-start {
			width: 100px;
		}
		&-mid {
			flex: 1;
		}
		&-end {
		}
	}
}

.bottom-content {
	padding: 32rpx;

	.red-button {
		width: 180rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background: linear-gradient(to right, #fa6400, #f79151);
		border-radius: 20rpx;
		color: #fff;
		font-weight: 700;
	}
}

.remark {
	padding: 40rpx;
}

.store {
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	position: relative;
	font-weight: 600;
	&::after {
		position: absolute;
		content: ' ';
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 1rpx;
		height: 30rpx;
		background-color: #ccc;
	}
}
</style>
