<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top :refresher-enabled="false">
		<view slot="top">
			<AppletHeader title="按商品" right-icon=" "></AppletHeader>
			<NavSearchBar @search="getSearchValue" @rightClick="handleClick" desc="名称/条形码/简拼"></NavSearchBar>
			<view class="select flex">
				<view class="flex" @click="visible = !visible">
					<text>{{ curStore.name }}</text>
					<u-icon name="arrow-down-fill" size="12"></u-icon>
				</view>
				<view class="flex" @click="selectSort">
					<text>{{ curSortItem.label }}</text>
					<u-icon name="arrow-down-fill" size="12"></u-icon>
				</view>
			</view>
		</view>

		<view class="" slot="loading">
			<u-loading :show="true"></u-loading>
		</view>

		<view class="grid" v-if="dataList.length">
			<view class="grid-item" v-for="item of cardList" :key="item.id">
				<u--text size="14" color="#B7E9FF" :text="item.title"></u--text>
				<u--text
					bold
					size="24"
					color="#fff"
					:text="item.id === 5 ? `${Math.round(item.price * 100)}.00%` : formatMoney(item.price)"
				></u--text>
			</view>
			<view class="abs" @click="modalVisible = true">
				<u-icon name="question-circle" size="18" color="#fff"></u-icon>
			</view>
		</view>

		<view class="content">
			<block v-for="obj of dataList" :key="obj.id">
				<view class="list" @click="() => handleClickCard(obj)">
					<view class="header">
						<view class="img-box">
							<u--image
								:showLoading="true"
								:src="obj.imgName"
								width="60px"
								height="60px"
								mode="aspectFit"
							></u--image>
						</view>
						<u--text size="16" :text="obj.materialName" bold color="#000"></u--text>
					</view>
					<u-line margin="20rpx"></u-line>
					<view class="main">
						<view class="main-item">
							<text>商品销售额：</text>
							<text>{{ obj.salesPrice }}</text>
						</view>
						<view class="main-item">
							<text>销售成本：</text>
							<text>{{ obj.salespurchasePrice }}</text>
						</view>
						<view class="main-item">
							<text>销售毛利：</text>
							<text>{{ obj.salesGrossProfit }}</text>
						</view>
						<view class="main-item">
							<text>毛利率：</text>
							<text>{{ obj.salesGrossProfitMargin }}%</text>
						</view>
						<view class="main-item">
							<text>销售：</text>
							<text>{{ obj.salesCount }}</text>
						</view>
					</view>
				</view>
			</block>
		</view>

		<u-popup :show="modalVisible" @close="modalVisible = false">
			<view class="modal">
				<u--text size="18" color="#000" text="说明" bold align="center"></u--text>
				<view class="modal-box">
					<view class="mb20" v-for="item in textList" :key="item.id">
						<text class="title">{{ item.text }}</text>
						<text>{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</u-popup>

		<template slot="empty">
			<view class="">
				<image
					style="height: 250rpx"
					mode="heightFix"
					src="https://haoxianhui.com/hxh/2024/11/22/2444213c153642079648618257207a9b.png"
				></image>
				<view style="text-align: center">暂无销售销售利润</view>
			</view>
		</template>

		<select-shop :show="visible" @cancel="visible = false" @confirm="storeConfirm"></select-shop>
		<u-picker
			:show="sortShow"
			@cancel="sortShow = false"
			@confirm="sortConfirm"
			keyName="label"
			:columns="[sortList]"
		></u-picker>
	</z-paging>
</template>

<script>
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import SelectShop from '@/components/SelectShop/SelectShop.vue'
import { formatMoney } from '@/utils'
import { getSalesStatistics } from '@/apis'
export default {
	components: {
		NavSearchBar,
		SelectShop
	},
	data() {
		return {
			sortList: [
				{
					label: '按商品销售额升序',
					value: 1
				},
				{
					label: '按销量升序',
					value: 2
				},
				{
					label: '按销售毛利升序',
					value: 3
				}
			],
			sortShow: false,
			curSortItem: {},
			curStore: {
				id: 0,
				name: '全部门店'
			},
			visible: false,

			modalVisible: false,
			cardList: [
				{
					id: 1,
					title: '商品销售额(￥)：',
					price: 0
				},
				{
					id: 2,
					title: '销售：',
					price: 0
				},
				{
					id: 3,
					title: '销售成本(￥)：',
					price: 0
				},
				{
					id: 4,
					title: '毛利(￥)：',
					price: 0
				},
				{
					id: 5,
					title: '销售毛利率(￥)：',
					price: 0
				}
			],
			textList: [
				{
					id: 1,
					text: '毛利',
					desc: '= 商品销售额 - 销售成本'
				},
				{
					id: 2,
					text: '销售毛利率',
					desc: '= 毛利 / 商品销售额'
				},
				{
					id: 3,
					text: '商品销售额',
					desc: '指销售商品的金额，不包含运费和抹零'
				},
				{
					id: 4,
					text: '销售成本',
					desc: '销售商品的成本根据商品每次进货价加权平均计算得出'
				}
			],
			show: true,
			formatMoney,
			keywords: '',
			dataList: [],
			beginTime: '',
			endTime: '',
			depotId: '',
			reqData: {
				salesMan: '',
				sortType2: 1,
				sortType1: 1,
			}
		}
	},
	onLoad() {
		this.curSortItem = this.sortList[0]
	},
	onShow() {
		// 判断有没有缓存
		const screenData = uni.getStorageSync('productScreenData') || null
		if (screenData) {
			console.log('缓存', screenData)
			this.beginTime = screenData.startTime
			this.endTime = screenData.endTime

			let obj = {
				sortType2: screenData.arr[0].obj?.id,
				salesMan: screenData.arr[1].obj?.id ? screenData.arr[1].obj?.id : ''
			}

			this.reqData = obj
			this.$refs.paging.reload()
		} else {
			// 开始时间和结束时间默认为本月的
			let endTime = new Date()
			// 获取当前月份的1号时间
			let startTime = new Date(endTime.getFullYear(), endTime.getMonth(), 1)
			this.beginTime = this.formatDate(startTime)
			this.endTime = this.formatDate(endTime)
		}
	},
	methods: {
		selectSort() {
		    this.sortShow = true
		},
		sortConfirm(e) {
			let obj = e.value[0]
			this.sortShow = false
			this.reqData.sortType1 = obj.value
			this.curSortItem = obj
			this.$refs.paging.reload()
		},
		storeConfirm(e) {
			console.log('选择的', e)
			this.curStore = e
			this.depotId = e.id || ''
			this.visible = !this.visible
			this.$refs.paging.reload()
		},
		handleClickCard(item) {
			console.log('去详情', item)
			uni.navigateTo({
				url: `/pages/packageE/product-details/product-details?obj=${JSON.stringify(item)}`
			})
		},
		formatToTwoDecimalPlaces(value) {
			return parseFloat(value.toFixed(2))
		},
		getSearchValue(v) {
			this.keywords = v
			this.$refs.paging.reload()
		},
		handleClick() {
			uni.navigateTo({
				url: '/pages/packageE/product-screening/product-screening'
			})
		},
		formatToTwoDecimalPlaces(value) {
			return value.toFixed(2)
		},
		formatDate(date) {
			let year = date.getFullYear()
			let month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份从0开始，需要加1
			let day = date.getDate().toString().padStart(2, '0')
			return `${year}-${month}-${day}`
		},
		async queryList(page, pageNo) {
			// sortType2 1 是升序  2是降序
			try {
				const { data } = await getSalesStatistics({
					currentPage: page,
					pageSize: pageNo,
					materialParam: this.keywords,
					beginTime: this.beginTime,
					endTime: this.endTime,
					depotId: this.depotId,
					...this.reqData,
				})
				console.log(data)
				let { rows, totalSales } = data
				this.cardList[0].price = this.formatToTwoDecimalPlaces(totalSales.totalSalesPrice)
				this.cardList[1].price = this.formatToTwoDecimalPlaces(totalSales.totalSalesCount)
				this.cardList[2].price = this.formatToTwoDecimalPlaces(totalSales.totalSalespurchasePrice)
				this.cardList[3].price = this.formatToTwoDecimalPlaces(totalSales.totalSalesGrossProfit)
				this.cardList[4].price = this.formatToTwoDecimalPlaces(totalSales.totalSalesGrossProfitMargin)
				// console.log('this.cardList[4].price', this.cardList[4].price)
				// console.error('rows', rows)
				rows = rows.map((item) => ({
					...item,
					salesGrossProfit: this.formatToTwoDecimalPlaces(item.salesGrossProfit),
					salesGrossProfitMargin: this.formatToTwoDecimalPlaces(item.salesGrossProfitMargin * 100),
					salesPrice: this.formatToTwoDecimalPlaces(item.salesPrice),
					salespurchasePrice: this.formatToTwoDecimalPlaces(item.salespurchasePrice)
				}))
				this.$refs.paging.complete(rows)
				// this.loading = false
			} catch (e) {
				console.log('请求失败', e)
				this.$refs.paging.complete(false)
			}
		}
	}
}
</script>

<style scoped lang="scss">
.select {
	height: 82rpx;
	view {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #737373;
	}
}

.grid {
	width: 100%;
	height: 600rpx;
	background-color: #1d73ff;
	clip-path: ellipse(100% 68% at 50% 30%);
	padding: 50rpx 50rpx 100rpx 50rpx;
	color: #fff;
	position: relative;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-column-gap: 30rpx;
	grid-row-gap: 0;

	&-item {
	}

	.abs {
		position: absolute;
		right: 50rpx;
		top: 50rpx;
	}
}

.modal {
	padding: 40rpx;

	&-box {
		margin-top: 50rpx;
		border-radius: 20rpx;
		background: #f1f5f8;
		height: 450rpx;
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.title {
			color: #3775fe;
		}
	}
}

.content {
	margin: -160rpx auto auto auto;
	padding: 20px 20px 40px 20px;
	position: relative;
	z-index: 2;

	.list {
		background-color: #ffffff;
		margin-bottom: 20rpx;
		padding: 30rpx;
		border-radius: 20rpx;

		.header {
			display: flex;
			align-items: center;

			.img-box {
				background-color: #cdd7dc;
				width: 120rpx;
				height: 120rpx;
				border-radius: 10rpx;
				margin-right: 10px;
			}
		}

		.main {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: 20rpx;
			grid-row-gap: 10rpx;

			&-item {
				text {
					&:first-child {
						width: 164rpx;
						color: #737373;
					}
				}
			}
		}
	}
}
</style>
