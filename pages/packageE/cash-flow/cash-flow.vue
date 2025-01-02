<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" :refresher-enabled="false" @query="queryList"
		auto-show-back-to-top>
		<template slot="top">
			<AppletHeader @rightClick="navRightClick" title="资金流水"
				right-icon="https://haoxianhui.com/hxh/2024/11/22/8ed8f9218a7943fea23281041aa4319b.png"></AppletHeader>
		</template>
		<custom-dropdown @onCreated="onCreated" @selectStore="selectStore" @selectTime="selectTime"></custom-dropdown>
		<view class="main" v-if="dataList.length">
			<view class="nav">
				<view class="nav-item">
					<view class="title">收入</view>
					<view class="money">￥{{formatMoney(navData.totalInPrice)}}</view>
					<view class="subtitle">共{{navData.totalInCount}}笔</view>
				</view>
				<view class="nav-item">
					<view class="title">支出</view>
					<view class="money">￥{{formatMoney(navData.totalOutPrice)}}</view>
					<view class="subtitle">共{{navData.totalOutCount}}笔</view>
				</view>
			</view>
		</view>

		<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>

		<view class="container">
			<view class="list" v-for="(item, index) in dataList" :key="index" @click="hadndaleClick(item)">
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
			<image style="height: 250rpx; margin: auto" mode="heightFix"
				src="https://haoxianhui.com/hxh/2024/11/22/102ed023996742b8b30d64d8fb7c8caf.png"></image>
			<view style="text-align: center">暂无资金流水</view>
		</template>


	</z-paging>
</template>

<script>
	import {
		timestampToDate,
		formatDateToChinese,
		formatMoney,
		getStartAndEndTimes,
		getMonthStartAndEnd
	} from '@/utils'
	import {
		getCapitalFlow
	} from '@/apis'
	import CustomDropdown from '@/components/CustomDropdown/CustomDropdown.vue'

	export default {
		components: {
			CustomDropdown
		},
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
				isShow: false,
			}
		},
		onLoad() {
			// 默认按月查询
			// this.beginTime = timestampToDate(Date.now())
			// this.endTime = this.beginTime
			let {
				start_time,
				end_time
			} = getStartAndEndTimes()
			this.beginTime = start_time
			this.endTime = end_time
		},
		onShow() {
			const obj = uni.getStorageSync('flowScreenData')
			if (obj) {
				this.reqObj = obj
				this.$refs.paging.reload()
			}
		},
		methods: {
			onCreated(e) {
				// console.log('获取的怕', e)
				// this.depotId = e.id
			},
			hadndaleClick(item) {
				uni.navigateTo({
					url: `/pages/packageB/flow-list/flow-list?time=${item.operTime}&id=${this.depotId}`
				})
			},
			navRightClick() {
				uni.navigateTo({
					url: '/pages/packageD/fund-flow-screening/fund-flow-screening'
				})
			},
			selectStore(e) {
				console.log(e)
				this.depotId = e.id
				this.$refs.paging.reload()
			},
			selectTime(e) {
				// 1是日期   3是月份 
				if (e.mode === 'date') {
					this.time = timestampToDate(e.value)
					console.log(this.time)
					let {
						start_time,
						end_time
					} = getStartAndEndTimes(this.time)
					
					// 查询一个日期的 就 开始等于结束时间
					this.beginTime = end_time
					this.endTime = end_time
					this.timeType = 1
				} else {
					this.time = timestampToDate(e.value)
					let {
						start_time,
						end_time
					} = getMonthStartAndEnd(this.time)

					this.beginTime = start_time
					this.endTime = end_time
					this.timeType = 3
				}
				this.$refs.paging.reload()
			},

			async queryList(page, pageNo) {
				this.loading = true
				
				console.error('this', this.depotId)
				let params = {
					beginTime: this.beginTime,
					endTime: this.endTime,
					timeType: this.timeType,
					depotId: this.depotId || "",
				}

				if (this.reqObj?.accountId) {
					params['accountId'] = this.reqObj.accountId
				}

				if (this.reqObj?.salesMan) {
					params['salesMan'] = this.reqObj.salesMan
				}

				try {
					const {
						data
					} = await getCapitalFlow({
						currentPage: page,
						pageSize: pageNo,
						...params
					})
					// const keys = Object.keys(data.data)
					// let firstKey = keys[0]
					let {
						totalInCount,
						totalInPrice,
						totalOutCount,
						totalOutPrice
					} = data
					this.navData = {
						totalInCount: totalInCount || 0,
						totalInPrice,
						totalOutCount: totalOutCount || 0,
						totalOutPrice
					}
					let array = []

					for (let item in data.data) {
						array.push(data.data[item])
					}
					// console.error('this.navData', this.navData)
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
			background-color: #ffaf38;
			-webkit-clip-path: ellipse(100% 68% at 50% 30%);
			clip-path: ellipse(100% 68% at 50% 30%);
			display: flex;
			height: 300rpx;
			padding: 40rpx;
			&-item {
				width: 50%;
				font-size: 24rpx;
				text-align: justify;
				.money {
					font-weight: 700;
					color: #000;
					font-size: 40rpx;
					margin: 15rpx 0;
				}
			}
		}
	}

	.container {
		margin-top: -120rpx;
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