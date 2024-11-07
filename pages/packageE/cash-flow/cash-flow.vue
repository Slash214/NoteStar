<template>
	<custom-view :getData="getCapitalFlow" :transformData="transformData" :params="genParams()">
		<template slot="top">
			<AppletHeader title="资金流水" right-icon=" "></AppletHeader>
		</template>

		<view class="select">
			<view class="flex flex-items-center" @click="selectAllShop">
				<text>全部门店</text>
				<u-icon name="arrow-down-fill" color="#c0c4cc" size="12"></u-icon>
			</view>
			<view class="flex flex-items-center" @click="selectTime">
				<text>日: {{ beginTime }}</text>
				<u-icon name="arrow-down-fill" color="#c0c4cc" size="12"></u-icon>
			</view>
		</view>
		<view class="main" v-if="isShow">
			<view class="nav flex flex-between">
				<view class="">
					<u--text margin="0 0 0 5px" size="12" text="收入"></u--text>
					<u--text margin="5px 0" bold size="20" mode="price" :text="navData.totalInPrice"></u--text>
					<u--text margin="0 0 0 5px" size="12" :text="'共' + navData.totalInCount + '笔记'"></u--text>
				</view>

				<view class="">
					<u--text margin="0 0 0 5px" size="12" text="支出"></u--text>
					<u--text margin="5px 0" bold size="20" mode="price" :text="navData.totalOutPrice"></u--text>
					<u--text margin="0 0 0 5px" size="12" :text="'共' + navData.totalOutCount + '笔记'"></u--text>
				</view>
			</view>
		</view>

		<template v-slot:content="{ dataList }">
			<view class="container">
				<view class="list" v-for="(item, index) in dataList" :key="index">
					<text class="time">{{ formatDateToChinese(item.operTime) }}</text>
					<view class="flex content">
						<text>收入{{ item.totalInCount }}笔</text>
						<text>￥{{ formatMoney(item.totalInPrice) }}</text>
						<text>支出{{ item.totalOutCount }}笔</text>
						<text>￥{{ formatMoney(item.totalOutPrice) }}</text>
					</view>
				</view>
			</view>
		</template>
	</custom-view>
</template>

<script>
import { timestampToDate, formatDateToChinese, formatMoney } from '@/utils'
import { getCapitalFlow } from '@/apis'
import CustomView from '@/components/CustomView/CustomView.vue'
export default {
	components: {
		CustomView
	},
	data() {
		return {
			formatDateToChinese,
			formatMoney,
			beginTime: '',
			endTime: '',
			timeType: 0,
			depotId: '',
			reqObj: {
				accountId: '',
				salesMan: ''
			},
			loading: true,
			getCapitalFlow,
			navData: {},
			isShow: false
		}
	},
	onLoad() {
		this.beginTime = timestampToDate(Date.now())
		this.endTime = this.beginTime
	},
	methods: {
		selectAllShop() {
			console.log('选择店铺', 1)
		},
		selectTime() {
			console.log('选择时间')
		},
		genParams() {
			let params = {
				beginTime: this.beginTime,
				endTime: this.endTime,
				timeType: this.timeType,
				depotId: this.depotId,
				...this.reqObj
			}

			return params
		},
		transformData(data) {
			const keys = Object.keys(data.data)
			let firstKey = keys[0]
			let { totalInCount, totalInPrice, totalOutCount, totalOutPrice } = data
			this.navData = {
				totalInCount,
				totalInPrice,
				totalOutCount,
				totalOutPrice
			}
			let array = []
			if (data.data[firstKey]) {
				this.isShow = true
				array = [data.data[firstKey]]
			}
			console.log('array', array)
			return array
		}
	}
}
</script>

<style scoped lang="scss">
.select {
	display: flex;
	align-items: center;
	height: 82rpx;
	width: 100%;
	font-size: 28rpx;
	view {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 82rpx;
	}
}
.main {
	.nav {
		height: 300rpx;
		background-color: #ffaf38;
		-webkit-clip-path: ellipse(100% 68% at 50% 30%);
		clip-path: ellipse(100% 68% at 50% 30%);
		padding: 40rpx 80rpx;
	}
}

.container {
	margin-top: -60px;
	position: relative;
	z-index: 2;

	.list {
		margin-bottom: 17rpx;
		padding: 25rpx;
		border-radius: 20rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;

		.time {
			color: #000;
			font-weight: 600;
			font-size: 32rpx;
		}

		.content {
			padding: 25rpx 0 10rpx 0;
			color: #737373;
			align-items: center;
			font-size: 26rpx;

			text {
				padding-left: 10rpx;
			}
		}
	}
}
</style>
