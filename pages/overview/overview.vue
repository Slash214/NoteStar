<template>
	<view>
		<AppletHeader title="经营情况" left-icon="account" right-icon=" "></AppletHeader>
		<view class="">
			<custom-dropdown></custom-dropdown>
			<view class="nav">
				<view class="set-title">
					<view class="flex flex-items-center" @click="show = !show">
						<text>关键数据</text>
						<u-icon :name="show ? 'eye-fill' : 'eye-off'" color="#fff" size="24"></u-icon>
						<view class="time">
							更新于
							{{ lastTime }}
						</view>
					</view>
				</view>
				<view class="key-data">
					<view class="key-data-item" v-for="item in reportData" :key="item.id">
						<u--text :text="item.title" size="12" color="#ABC4FA"></u--text>
						<view class="price">
							{{ hiddenContent(formatMoney(item.num)) }}
						</view>

						<u--text :text="'昨日 ' + hiddenContent(item.value)" size="12" color="#ABC4FA"></u--text>
					</view>
				</view>
			</view>

			<view class="main">
				<view class="white mb20 echart">
					<u--text bold text="销售趋势" size="17" color="#000"></u--text>
				</view>
				<view class="white mb20 commodity">
					<view class="flex">
						<u--text bold text="商品热销" size="17" color="#000"></u--text>
						<u--text suffixIcon="arrow-right" align="right" text="查看更多" size="13" color="#A0A0A0"></u--text>
					</view>
				</view>
				<view class="white">
					<view class="flex">
						<u--text bold text="商品热销" size="17" color="#000"></u--text>
						<u--text suffixIcon="arrow-right" align="right" text="查看更多" size="13" color="#A0A0A0"></u--text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CustomDropdown from '@/components/CustomDropdown/CustomDropdown.vue'
import { getBusinessOverview } from '@/apis'
import { formatMoney } from '@/utils/index.js'
export default {
	components: {
		CustomDropdown
	},
	data() {
		return {
			formatMoney,
			show: true,
			lastTime: '',
			reportData: [
				{ id: 1, title: '销售额(￥)', num: '', value: '' },
				{ id: 2, title: '笔数', num: '', value: '' },
				{ id: 3, title: '毛利(￥)', num: '', value: '' },
				{ id: 4, title: '资金收入(￥)', num: '', value: '' }
			]
		}
	},
	onLoad() {
		this.getData()
	},
	methods: {
		hiddenContent(val) {
			if (this.show) return val
			else return '****'
		},
		async getData() {
			const { data } = await getBusinessOverview({
				timeType: 1,
				time: '2024-10-14',
				depotId: '',
				salesTrendsType1: 1,
				salesTrendsType2: 1
			})

			let { keyData } = data || {}

			this.reportData[0].num = keyData.nowCapitalIncome
			this.reportData[0].value = keyData.preCapitalIncome
			this.reportData[1].num = keyData.nowSalesCount
			this.reportData[1].value = keyData.preSalesCount
			this.reportData[2].num = keyData.nowGrossProfit
			this.reportData[2].value = keyData.preGrossProfit
			this.reportData[3].num = keyData.nowSalesRevenue
			this.reportData[3].value = keyData.preSalesRevenue
			this.lastTime = keyData.lastCreateTime
			console.log('data', data)
		},
		leftClick() {
			console.log('点击我的')
		}
	}
}
</script>

<style lang="scss" scoped>
.nav {
	height: 600rpx;
	background-color: #1d73ff;
	-webkit-clip-path: ellipse(100% 68% at 50% 30%);
	clip-path: ellipse(100% 68% at 50% 30%);
	color: #fff;
	padding: 40rpx;

	.set-title {
		margin-bottom: 20px;
		.time {
			color: #abc4fa;
			font-size: 24rpx;
			margin-left: 10px;
		}
	}

	.key-data {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 1fr;
		grid-column-gap: 40rpx;
		grid-row-gap: 50rpx;
		&-item {
			.price {
				color: #fff;
				font-size: 40rpx;
				font-weight: 600;
				margin: 10px 0;
			}
		}
	}
}

.main {
	margin-top: -60px;
	padding: 25rpx;
	position: relative;
	z-index: 1;
	.white {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 25rpx;
	}
	.echart {
	}
}
</style>
