<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>
		<view slot="top">
			<AppletHeader title="按商品"></AppletHeader>
			<NavSearchBar @srarch="getSearchValue" @rightClick="handleClick" desc="名称/条形码/简拼"></NavSearchBar>
		</view>

		<view class="" slot="loading">
			<u-loading :show="true"></u-loading>
		</view>
		<view class="grid">
			<view class="grid-item" v-for="item of cardList" :key="item.id">
				<u--text size="14" color="#B7E9FF" :text="item.title"></u--text>
				<u--text bold size="24" color="#fff" :text="item.id === 5 ? `${item.price * 100}.00%` : formatMoney(item.price)"></u--text>
			</view>
			<view class="abs" @click="modalVisible = true">
				<u-icon name="question-circle" size="18" color="#fff"></u-icon>
			</view>
		</view>

		<view class="content">
			<view class="list" v-for="item in dataList" :key="item.id">
				<view class="header">
					<view class="img-box">
						<u--image :showLoading="true" :src="item.imgName" width="60px" height="60px" mode="aspectFit"></u--image>
					</view>
					<u--text size="16" :text="item.materialName" bold color="#000"></u--text>
				</view>
				<u-line margin="20rpx"></u-line>
				<view class="main">
					<view class="main-item">
						<text>商品销售额：</text>
						<text>{{ item.salesPrice }}</text>
					</view>
					<view class="main-item">
						<text>销售成本：</text>
						<text>{{ item.salespurchasePrice }}</text>
					</view>
					<view class="main-item">
						<text>销售毛利：</text>
						<text>{{ item.salesGrossProfit }}</text>
					</view>
					<view class="main-item">
						<text>毛利率：</text>
						<text>{{ item.salesGrossProfitMargin * 100 }}.00%</text>
					</view>
					<view class="main-item">
						<text>销售：</text>
						<text>{{ item.salesCount }}</text>
					</view>
				</view>
			</view>
		</view>

		<u-popup :show="modalVisible" @close="modalVisible = false">
			<view class="modal">
				<u--text size="18" color="#000" text="说明" bold align="center"></u--text>
				<view class="modal-box">
					<view class="mb20" v-for="item in textList" :key="item.id">
						<text class="title">{{item.text}}</text>
						<text>{{item.desc}}</text>
					</view>
				</view>
			</view>
		</u-popup>
	</z-paging>
</template>

<script>
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import { formatMoney } from '@/utils'
import { getSalesStatistics } from '@/apis'
export default {
	components: {
		NavSearchBar
	},
	data() {
		return {
			modalVisible: false,
			cardList: [
				{ id: 1, title: '商品销售额(￥)：', price: 0 },
				{ id: 2, title: '销售：', price: 0 },
				{ id: 3, title: '销售成本(￥)：', price: 0 },
				{ id: 4, title: '毛利(￥)：', price: 0 },
				{ id: 5, title: '销售毛利率(￥)：', price: 0 }
			],
			textList: [
				{ id: 1, text: '毛利', desc: '= 商品销售额 - 销售成本' },
				{ id: 2, text: '销售毛利率', desc: '= 毛利 / 商品销售额' },
				{ id: 3, text: '商品销售额', desc: '指销售商品的金额，不包含运费和抹零' },
				{ id: 4, text: '销售成本', desc: '销售商品的成本根据商品每次进货价加权平均计算得出' },
			],
			show: true,
			formatMoney,
			keywords: '',
			dataList: [],
			beginTime: '',
			endTime: '',
			salesMan: ''
		}
	},
	onLoad() {},
	onShow() {
		// 判断有没有缓存
		const screenData = uni.getStorageSync('screenData') || null
		if (screenData) {
			console.log('缓存', screenData)
			this.beginTime = screenData.startTime
			this.endTime = screenData.endTime
			this.salesMan = screenData.arr[1].obj?.id ? screenData.arr[1].obj?.id : ''
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
		getSearchValue(v) {
			console.log(v)
			this.keywords = v
			this.$refs.paging.reload()
		},
		handleClick() {
			console.log('筛选')
			uni.navigateTo({
				url: '/pages/packageB/screening-page/screening-page'
			})
		},
		formatDate(date) {
			let year = date.getFullYear()
			let month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份从0开始，需要加1
			let day = date.getDate().toString().padStart(2, '0')
			return `${year}-${month}-${day}`
		},
		// showModal() {
		// 	console.log('弹窗提示的')
		// },
		async queryList(page, pageNo) {
			try {
				const { data } = await getSalesStatistics({
					apiName: 'material',
					currentPage: page,
					pageSize: pageNo,
					materialParam: this.keywords,
					beginTime: this.beginTime,
					endTime: this.endTime,
					salesMan: this.salesMan,
					sortType2: 1,
					sortType1: 1
				})
				console.log(data)
				let { rows, totalSales } = data

				this.cardList[0].price = totalSales.totalSalesPrice
				this.cardList[1].price = totalSales.totalSalesCount
				this.cardList[2].price = totalSales.totalSalespurchasePrice
				this.cardList[3].price = totalSales.totalSalesGrossProfit
				this.cardList[4].price = totalSales.totalSalesGrossProfitMargin

				let array = rows
				this.$refs.paging.complete(array)
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
.grid {
	width: 100%;
	height: 600rpx;
	background-color: #1d73ff;
	clip-path: ellipse(100% 68% at 50% 30%);
	padding: 50rpx;
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
			color: #3775FE;
		}
	}
}

.content {
	margin: -130rpx auto auto auto;
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
			grid-column-gap: 30rpx;
			grid-row-gap: 10rpx;
			&-item {
				text {
					&:first-child {
						width: 184rpx;
						color: #737373;
					}
				}
			}
		}
	}
}
</style>
