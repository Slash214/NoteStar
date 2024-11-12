<template>
	<view class="main">
		<AppletHeader :title="type === 1 ? '销售单' : '进货单'" right-icon=" "></AppletHeader>
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
			<u-picker
				:show="salesonShow"
				@cancel="toggleShow"
				@confirm="getSelectSales"
				:columns="saleColumns"
				keyName="name"
			></u-picker>
			<view class="white box mt20">
				<view class="box-item" v-for="item in serviceList" :key="item.id">
					<view class="box-item-start">{{ item.title }}</view>
					<view class="box-item-mid" @click="serviceClick(item)">{{ item.value }}</view>
					<view class="box-item-end" @click="serviceClick(item)">
						<u-icon :name="item.icon" color="#c0c4cc" size="13"></u-icon>
					</view>
				</view>
			</view>
			<view class="white box store mt20">
				<view class="flex flex-items-center" @click="selectProduct">
					<image
						mode="widthFix"
						style="width: 50rpx"
						:src="staticImageUrl + '/purchase/icon-select.png'"
					></image>
					<text class="ml10">选择商品</text>
				</view>
				<view class="flex flex-items-center" @click="scanToAdd">
					<image
						mode="widthFix"
						style="width: 50rpx"
						:src="staticImageUrl + '/purchase/icon-scan.png'"
					></image>
					<text class="ml10">扫码添加</text>
				</view>
			</view>

			<view class="white box mt20 product">
				<view class="product-title">
					<u-line hairline="false" direction="col"></u-line>
					<text>{{ type === 1 ? '销售商品' : '进货商品' }}</text>
				</view>

				<view class="product-content">
					<u-swipe-action>
						<u-swipe-action-item
							:options="options"
							v-for="(item, index) of cacheSelectList"
							:key="item.id"
							:index="index"
							:name="item.name"
							@click="handleClickAction"
						>
							<view class="swipe-action flex u-border-bottom">
								<u--image
									radius="10"
									:showLoading="true"
									:src="item.imgName"
									width="60px"
									height="60px"
								></u--image>
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
						<u--input
							placeholder=""
							v-model="item.value"
							@change="onPriceChange(item)"
							border="none"
						></u--input>
						<!-- <u--text :text="item.value" mode="price"></u--text> -->
					</view>
					<view class="box-item-end">
						{{ item.end }}
					</view>
				</view>

				<view class="amount">
					<text>应收：￥{{ form.changeAmount }}</text>
					<text class="btns">抹零</text>
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
						<u--text mode="price" :text="form.changeAmount" color="#ccc"></u--text>
					</view>
				</view>

				<view :class="type === 1 ? 'red-button istype1' : 'red-button istype2'" @click="saveData">保存</view>
			</view>
		</fixed-bottom>

		<u-datetime-picker
			ref="datetimePicker"
			:show="timeShow"
			v-model="curTimeTemp"
			mode="date"
			@confirm="confirmTime"
			@cancel="timeShow = false"
			:formatter="formatter"
		></u-datetime-picker>
	</view>
</template>

<script>
import FixedBottom from '@/components/FixedBottom/FixedBottom.vue'
import {
	getDepotByUserId,
	getUserByDepotId,
	getAccountByDepotId,
	addDepotHeadAndDetail,
	genbuildNumber,
	updateDepotHeadAndDetail
} from '@/apis'
import { staticImageUrl } from '@/common/contanst'
import { debounce } from 'lodash'
import Big from 'big.js'
import { timestampToDate, formatTimestamp } from '@/utils'

export default {
	components: {
		FixedBottom
	},
	data() {
		return {
			staticImageUrl,
			timeShow: false,
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
				{
					id: 1,
					title: '*客户',
					value: '零售客户',
					icon: ''
				},
				{
					id: 2,
					title: '时间',
					value: '',
					icon: 'arrow-down-fill'
				},
				{
					id: 3,
					title: '*业务员',
					value: '',
					icon: 'arrow-down-fill'
				}
			],
			priceList: [
				{
					id: 1,
					title: '整单折扣',
					value: 100,
					end: '%'
				},
				{
					id: 2,
					title: '优惠金额',
					value: 0,
					end: ''
				},
				{
					id: 3,
					title: '折后金额',
					value: 0,
					end: ''
				},
				{
					id: 4,
					title: '运费',
					value: 0,
					end: ''
				}
			],
			length: 0,
			totalPrice: 0,
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
				grossProfit: 0, // 毛利润
				moneyAroundDown: '', // 摸0金额
				changeAmount: '' // 实付
			},
			curTimeTemp: '',
			cacheSelectList: [],
			fileList: '',
			objItem: {
				1: {
					text: '销售',
					mode: 'add',
					params: {}
				},
				2: {
					text: '进货',
					mode: 'add',
					params: {}
				}
			}
		}
	},
	onShow() {
		// 进货的accountId = 1
		// 销售的accountId =

		// 重置 loadIndex 和 cacheSelectList
		this.loadIndex = 0
		this.cacheSelectList = []

		const list = uni.getStorageSync('selectList')

		if (list) {
			console.log('选择了商品', list)
			const info = uni.getStorageSync('goodsInfo')
			this.totalPrice = info.totalPrice
			this.form.changeAmount = info.totalPrice
			this.priceList[2].value = info.totalPrice
			this.length = info.productKindCount

			// 开始分批次加载数据
			this.loadBatchData(list)
			// 计算毛利润
			this.genGrossPrice(list)

			// 重新计算总金额
			this.calculateTotalAmount()
		}
	},
	onLoad(options) {
		this.type = +options?.type || 1
		console.log('参数', options)
		this.getData()
		this.curTimeTemp = Date.now()
		this.serviceList[1].value = timestampToDate(this.curTimeTemp)
	},
	onReady() {
		// 微信小程序需要用此写法
		this.$refs.datetimePicker.setFormatter(this.formatter)
	},
	methods: {
		onPriceChange: debounce(function (item) {
			console.log(item)

			// 整单折扣
			if (item.id === 1) {
				const discountRate = item.value / 100
				this.priceList.find((i) => i.id === 2).value = this.formatMoney(this.totalPrice * (1 - discountRate)) // 更新优惠金额
				this.priceList.find((i) => i.id === 3).value = this.formatMoney(this.totalPrice * discountRate) // 更新折后金额
			}
			// 优惠金额
			if (item.id === 2) {
				const discountMoney = item.value
				if (this.totalPrice !== 0) {
					const newDiscountLastMoney = this.totalPrice - discountMoney
					this.priceList.find((i) => i.id === 3).value = this.formatMoney(newDiscountLastMoney) // 更新折后金额
					this.priceList.find((i) => i.id === 1).value = (
						(newDiscountLastMoney / this.totalPrice) *
						100
					).toFixed(2) // 更新整单折扣
				}
			}
			if (item.id === 3) {
				const discountLastMoney = item.value
				if (this.totalPrice !== 0) {
					this.priceList.find((i) => i.id === 1).value = (
						(discountLastMoney / this.totalPrice) *
						100
					).toFixed(2) // 更新整单折扣
					this.priceList.find((i) => i.id === 2).value = this.formatMoney(this.totalPrice - discountLastMoney) // 更新优惠金额
				}
			}
			this.calculateTotalAmount()
		}, 300),
		calculateTotalAmount() {
			const discountLastMoney = Number(this.priceList.find((i) => i.id === 3).value)
			this.form.discountLastMoney = discountLastMoney
			const otherMoney = Number(this.priceList.find((i) => i.id === 4).value)
			this.form.otherMoney = otherMoney
			this.form.changeAmount = discountLastMoney + otherMoney
			console.log('应收金额:', this.form.changeAmount)
		},
		formatMoney(value) {
			return parseFloat(value).toFixed(2)
		},
		async saveData() {
			if (!this.curTimeTemp) {
				uni.showToast({
					title: '请选择时间',
					icon: 'none'
				})
				return
			}

			if (!this.cacheSelectList.length) {
				uni.showToast({
					title: '商品不能为空',
					icon: 'none'
				})
				return
			}

			console.log('保存')
			let orderNumber = null

			// 创建模式才生成订单号，修改不需要
			if (this.objItem[this.type].mode === 'add') {
				const result = await genbuildNumber({
					type: 1
				})
				orderNumber = result?.data?.defaultNumber || null
			}

			console.log('this', this.cacheSelectList)
			// type: '出库',
			// subType: '零售',
			// return
			let info = {
				type: this.type === 1 ? '出库' : '入库',
				subType: this.type === 1 ? '零售' : '采购',
				depotId: this.curSelectStore.id,
				organId: 60, // 客户id，写死
				operTime: formatTimestamp(this.curTimeTemp),
				salesMan: this.curSelectSales.id,
				number: orderNumber,
				defaultNumber: orderNumber,
				remark: this.remark,
				fileName: this.fileList,
				...this.form,
				totalPrice: this.form.changeAmount,
				accountId: 1,
				originalTotalPrice: this.totalPrice // 原始总价
			}

			let rows = this.cacheSelectList.map((item) => ({
				depotId: this.curSelectStore.id,
				id: item.id,
				name: item.name,
				standard: null,
				stock: item.stock,
				unit: item.unit,
				barCode: item.mbarCode,
				operNumber: item.nums,
				unitPrice: item.commodityDecimal,
				allPrice: item?.allPrice || 0,
				remark: item?.remark
			}))

			console.log('rows', rows)
			console.log('info', info)
			// return

			this.objItem[this.type].params = {
				info: JSON.stringify(info),
				rows: JSON.stringify(rows)
			}
			const { data } = await addDepotHeadAndDetail(this.objItem[this.type].params)
			console.log('data', data)
			// 图片的url
		},
		formatter(type, value) {
			if (type === 'year') {
				return `${value}年`
			}
			if (type === 'month') {
				return `${value}月`
			}
			if (type === 'day') {
				return `${value}日`
			}
			return value
		},
		// 选择时间
		confirmTime(e) {
			console.log('e', e)
			this.serviceList[1].value = timestampToDate(e.value)
			this.timeShow = false
		},
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
		// 删除商品
		handleClickAction(e) {
			console.log('删除', e)
			console.error('当前商品列表', this.cacheSelectList)
			// 从 cacheSelectList 中移除被删除的商品
			this.cacheSelectList = this.cacheSelectList.filter((item) => item.name !== e.name)
			// 更新缓存
			uni.setStorageSync('selectList', this.cacheSelectList)

			// 更新商品数量
			this.length = this.cacheSelectList.length

			// 重新计算总价格
			let totalPrice = this.cacheSelectList.reduce((accumulator, currentItem) => {
				const unitPrice = new Big(currentItem.commodityDecimal)
				const quantity = new Big(currentItem.nums)
				const itemTotalPrice = unitPrice.times(quantity)
				return accumulator.plus(itemTotalPrice)
			}, new Big(0))
			this.totalPrice = totalPrice.toFixed(2)

			// 重新计算毛利润
			this.genGrossPrice(this.cacheSelectList)

			// 重新计算折扣和应付金额
			this.recalculateDiscounts()
		},
		recalculateDiscounts() {
			// 获取整单折扣
			const discountRate = Number(this.priceList.find((i) => i.id === 1).value) / 100
			// 计算优惠金额
			const discountMoney = (this.totalPrice * (1 - discountRate)).toFixed(2)
			// 计算折后金额
			const discountLastMoney = (this.totalPrice * discountRate).toFixed(2)
			// 更新 priceList 中的值
			this.priceList.find((i) => i.id === 2).value = discountMoney
			this.priceList.find((i) => i.id === 3).value = discountLastMoney

			// 更新表单数据
			this.form.discountLastMoney = Number(discountLastMoney)
			const otherMoney = Number(this.priceList.find((i) => i.id === 4).value)
			this.form.otherMoney = otherMoney
			this.form.changeAmount = Number(discountLastMoney) + otherMoney
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

			if (item.id === 2) {
				this.timeShow = true
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
			const [r1, r2, r3] = await Promise.all([
				getDepotByUserId({
					userId: user.id
				}),
				getUserByDepotId({
					depotId: 1
				}),
				getAccountByDepotId({
					depotId: 1
				})
			])
			console.log('请求的数据', r1, r2, r3)

			this.shopList = r1.data
			this.columns = [
				this.shopList.map((item) => ({
					id: item.id,
					name: item.name,
					location: item.location
				}))
			]
			this.curSelectStore = this.shopList[0]

			this.salesRepList = r2.data.map((item) => ({
				...item,
				name: item.userName
			}))
			this.curSelectSales = this.salesRepList[0]
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
				success: async (res) => {
					console.log(res)
				},
				fail: (err) => {
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

.amount {
	display: flex;
	align-items: flex-end;
	align-items: center;
	justify-content: flex-end;
	padding-bottom: 20px;

	.btns {
		width: 120rpx;
		margin-left: 20rpx;
		border: 1px solid #5fcadd;
		color: #5fcadd;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
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

	.istype1 {
		background: linear-gradient(to right, #5fcadd, #6adae8);
	}

	.istype2 {
		background: linear-gradient(to right, #fa6400, #f79151);
	}

	.red-button {
		width: 180rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
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
