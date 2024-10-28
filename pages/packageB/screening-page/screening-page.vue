<template>
	<view class="container">
		<AppletHeader title="筛选"></AppletHeader>
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

		<view class="block" v-for="item in dataList" :key="item.id">
			<u--text bold margin="0 0 10px 5px" size="18" :text="item.name"></u--text>
			<view class="grid">
				<view v-for="el of item.data" :key="el.id" @click="handleClick(item.id, el)" :class="el.select ? 'grid-item select' : 'grid-item'">
					{{ el.name }}
				</view>
			</view>
		</view>

		<u-datetime-picker
			ref="datetimePicker"
			@cancel="startShow = false"
			@confirm="confirmStart($event, 1)"
			:formatter="formatter"
			:show="startShow"
			v-model="timpStartTime"
			mode="date"
		></u-datetime-picker>
		<u-datetime-picker
			ref="datetimePicker"
			@cancel="startShow = false"
			@confirm="confirmStart($event, 2)"
			:formatter="formatter"
			:show="endShow"
			v-model="timpEndTime"
			mode="date"
		></u-datetime-picker>

		<view class="fix-bottom flex flex-between">
			<view class="btn1">清空条件</view>
			<view class="btn2" @click="handleClickSumbit">确定</view>
		</view>
	</view>
</template>

<script>
import { getUserByDepotId, getDepotByUserId } from '@/apis'
import { timestampToDate } from '@/utils'

export default {
	data() {
		return {
			dataList: [],
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
	async onLoad() {
		const user = uni.getStorageSync('userInfo')
		const [r1, r2] = await Promise.all([getDepotByUserId({ userId: user.id }), getUserByDepotId({ depotId: 0 })])
		const array = r2.data.map((item) => ({ ...item, name: item.userName, select: false }))
		array.unshift({
			id: 0,
			roleName: '全部',
			userName: '全部',
			name: '全部',
			select: true
		})
		
		const store = r1.data.map((item) => ({ ...item, select: false }))
		store.unshift({
			id: 0,
			select: true,
			name: '全部',
		})
		this.dataList = [
			{ id: 1, name: '门店', type: 1, key: '', data: store },
			{ id: 2, name: '业务员', type: 2, key: '', data: JSON.parse(JSON.stringify(array)) },
			{ id: 3, name: '制单人', type: 3, key: '', data: JSON.parse(JSON.stringify(array)) }
		]

		// 开始时间和结束时间默认为本月的
		let endTime = new Date()
		// 获取当前月份的1号时间
		let startTime = new Date(endTime.getFullYear(), endTime.getMonth(), 1)
		this.startTime = this.formatDate(startTime)
		this.endTime = this.formatDate(endTime)
	},
	onReady() {
		// 微信小程序需要用此写法
		this.$refs.datetimePicker.setFormatter(this.formatter)
	},
	methods: {
		confirmStart(val, type) {
			if (type === 1) {
				this.startShow = false
				this.endShow = false
				console.log('开始时间', val)
				this.startTime = timestampToDate(val.value)
			} else {
				this.startShow = false
				this.endShow = false
				this.endTime = timestampToDate(val.value)
			}
		},
		handleClickSumbit() {
			console.log('确定')
			// 开始时间和结束时间传出去
			console.log('开始时间', this.startTime)
			console.log('结束时间', this.endTime)
			let arr = []
			this.dataList.forEach((item) => {
				item.data.forEach((el) => {
					if (el.select) {
						arr.push({
							name: item.name,
							obj: el
						})
					}
				})
			})
			console.log('arr', arr)
			let obj = {
				startTime: this.startTime,
				endTime: this.endTime,
				arr
			}
			uni.setStorageSync('screenData', obj)
			uni.navigateBack()
		},
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
		handleClick(id, item) {
			console.log('id', id, item)

			let data = this.dataList.filter((item) => item.id === id)[0]?.data
			data.forEach((e) => {
				e.select = e.id === item.id
			})
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

<style scoped lang="scss">
.container {
	padding-bottom: 100px;
}

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

.fix-bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 222;
	background-color: #fff;
	width: 100vw;
	height: 200rpx;
	padding: 25rpx;
	box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
	.btn1 {
		width: 180rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background: #fff;
		border-radius: 20rpx;
		border: 1px solid #ccc;
		color: #000;
	}
	.btn2 {
		flex: 1;
		margin-left: 40rpx;
		height: 90rpx;
		background: linear-gradient(to right, #3775fe, #6a9cff);
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: 700;
	}
}
</style>
