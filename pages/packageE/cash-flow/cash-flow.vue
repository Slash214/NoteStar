<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>
		<template slot="top">
			<AppletHeader
				@rightClick="navRightClick"
				title="资金流水"
				right-icon="https://haoxianhui.com/hxh/2024/11/22/8ed8f9218a7943fea23281041aa4319b.png"
			></AppletHeader>
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
		<view class="main" v-if="dataList.length">
			<view class="nav flex flex-between">
				<view class="">
					<u--text margin="0 0 0 5px" size="12" text="收入"></u--text>
					<u--text margin="5px 0" bold size="20" mode="price" :text="navData.totalInPrice"></u--text>
					<u--text margin="0 0 0 5px" size="12" :text="'共' + navData.totalInCount + '笔'"></u--text>
				</view>

				<view class="">
					<u--text margin="0 0 0 5px" size="12" text="支出"></u--text>
					<u--text margin="5px 0" bold size="20" mode="price" :text="navData.totalOutPrice"></u--text>
					<u--text margin="0 0 0 5px" size="12" :text="'共' + navData.totalOutCount + '笔'"></u--text>
				</view>
			</view>
		</view>

		<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>

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

		<template slot="empty">
			<image
				style="height: 250rpx; margin: auto"
				mode="heightFix"
				src="https://haoxianhui.com/hxh/2024/11/22/102ed023996742b8b30d64d8fb7c8caf.png"
			></image>
			<view style="text-align: center">暂无资金流水</view>
		</template>
	</z-paging>
</template>

<script>
import { timestampToDate, formatDateToChinese, formatMoney } from '@/utils'
import { getCapitalFlow } from '@/apis'
export default {
	data() {
		return {
			formatDateToChinese,
			formatMoney,
			beginTime: '',
			endTime: '',
			timeType: 1,
			depotId: '',
			reqObj: {
				accountId: '',
				salesMan: ''
			},
			loading: true,
			getCapitalFlow,
			navData: {},
			dataList: [],
			isShow: false
		}
	},
	onLoad() {
		this.beginTime = timestampToDate(Date.now())
		this.endTime = this.beginTime
	},
	onShow() {
		const obj = uni.getStorageSync('flowScreenData')
		if (obj) {
			this.reqObj = obj
			this.$refs.paging.reload()
		}
	},
	methods: {
		navRightClick() {
			uni.navigateTo({
				url: '/pages/packageD/fund-flow-screening/fund-flow-screening'
			})
		},
		selectAllShop() {
			console.log('选择店铺', 1)
		},
		selectTime() {
			console.log('选择时间')
		},

		async queryList(page, pageNo) {
			this.loading = true
			let params = {
				beginTime: this.beginTime,
				endTime: this.endTime,
				timeType: this.timeType,
				depotId: this.depotId,
			}
			
			if (this.reqObj?.accountId) {
				params['accountId'] = this.reqObj.accountId
			}
			
			if (this.reqObj?.salesMan) {
				params['salesMan'] = this.reqObj.salesMan
			}
			
			try {
				const { data } = await getCapitalFlow({
					currentPage: page,
					pageSize: pageNo,
					...params
				})

				const keys = Object.keys(data.data)
				let firstKey = keys[0]
				let { totalInCount, totalInPrice, totalOutCount, totalOutPrice } = data
				this.navData = {
					totalInCount: totalInCount || 0,
					totalInPrice,
					totalOutCount: totalOutCount || 0,
					totalOutPrice
				}
				let array = []

				console.error('this.navData', this.navData)
				if (data.data[firstKey]) {
					this.isShow = true
					array = [data.data[firstKey]]
				}
				console.log('array', array)

				this.$refs.paging.complete(array)
				this.loading = false
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
