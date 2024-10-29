<template>
	<view class="block">
		<u--text bold margin="0 0 10px 5px" size="18" text="时间"></u--text>
		<view class="grid grid-4">
			<view :class="item.select ? 'grid-item select' : 'grid-item'" v-for="item of timeArray" :key="item.id" @click="handleClickTime(item)">
				{{ item.name }}
			</view>
		</view>

		<view class="time-box flex flex-items-center">
			<view class="start" @click="showTimeSelect(1)">{{ startTime }}</view>
			<view class="ml10 mr10">至</view>
			<view class="end" @click="showTimeSelect(2)">{{ endTime }}</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'TimeFilterBox',
	data() {
		return {
			timeArray: [
				{ id: 1, name: '昨日', select: false },
				{ id: 2, name: '今日', select: false },
				{ id: 3, name: '上月', select: false },
				{ id: 4, name: '本月', select: true }
			],
			startShow: false,
			endShow: false,
			startTime: '',
			endTime: '',
			timpStartTime: '',
			timpEndTime: ''
		}
	},
	methods: {
		showTimeSelect(type) {
			if (type === 1) {
				this.startShow = true
				this.endShow = false
			} else {
				this.startShow = false
				this.endShow = true
			}

			console.log('选择自定义时间的')
		},
		formatDate(date) {
			let year = date.getFullYear()
			let month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份从0开始，需要加1
			let day = date.getDate().toString().padStart(2, '0')
			return `${year}-${month}-${day}`
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
		handleClickTime(item) {
			console.log('item', item)
			// 获取时间范围的辅助函数
			const getTimeRange = (startAdjust, endAdjust) => {
				let currentTime = new Date()
				let startTime = new Date(currentTime)
				let endTime = new Date(currentTime)
				// 调整开始时间
				if (startAdjust) {
					startTime.setDate(startTime.getDate() + startAdjust)
				}
				// 调整结束时间
				if (endAdjust) {
					endTime.setDate(endTime.getDate() + endAdjust)
				}
				return {
					startTime: this.formatDate(startTime),
					endTime: this.formatDate(endTime)
				}
			}
		
			let startTime, endTime
		
			switch (item.id) {
				case 1: // 昨天
					console.log('昨天的')
					;({ startTime, endTime } = getTimeRange(-1, -1))
					break
		
				case 2: // 今天
					console.log('今天的')
					;({ startTime, endTime } = getTimeRange(0, 0))
					break
		
				case 3: // 上个月
					console.log('上个月的')
					let current = new Date()
					startTime = this.formatDate(new Date(current.getFullYear(), current.getMonth() - 1, 1))
					endTime = this.formatDate(new Date(current.getFullYear(), current.getMonth(), 0))
					break
		
				case 4: // 本月
					console.log('本月的')
					let now = new Date()
					startTime = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
					endTime = this.formatDate(now)
					break
		
				default:
					console.log('未知时间范围')
					break
			}
		
			// 赋值
			this.startTime = startTime
			this.endTime = endTime
		
			// 改变状态
			this.timeArray.forEach((e) => {
				e.select = e.id === item.id
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.block {
	margin-bottom: 60rpx;
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 1fr;
		grid-column-gap: 20rpx;
		grid-row-gap: 20rpx;

		.grid-item {
			border-radius: 20rpx;
			background-color: #fff;
			border: 1px solid #ccc;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
		}

		.select {
			background-color: #e9f0fd;
			color: #3775fe;
			border: 1px solid #3775fe;
		}
	}

	.grid-4 {
		grid-template-columns: repeat(4, 1fr);
	}

	.time-box {
		margin-top: 20rpx;
		.start,
		.end {
			flex: 1;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			background: #fff;
			color: #000;
			border: 1px solid #ccc;
			border-radius: 20rpx;
		}
	}
}
</style>
