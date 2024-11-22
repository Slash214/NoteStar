<template>
	<view class="dropdown">
		<view class="dropdown-item" @click="toggleStoreVisible">
			<text style="padding-right: 5px">{{curName}}</text>
			<u-icon name="arrow-down-fill" size="8" color="#c0c4cc" />
		</view>
		<view class="dropdown-item" @click="toggleTimeVisible">
			<text style="padding-right: 5px">日{{ formatTime(times) }}</text>
			<u-icon name="arrow-down-fill" size="8" color="#c0c4cc" />
		</view>

		<u-popup :show="storeVisible" :round="10" mode="bottom" @close="toggleStoreVisible">
			<scroll-view :scroll-y="true" class="store">
				<view class="store-item flex flex-between flex-items-center" v-for="item in list" :key="item.id" @click="selectStore(item)">
					<text>{{ item.name }}</text>
					<u-icon v-if="item.select" name="checkbox-mark" size="16" color="#3775FE"></u-icon>
				</view>
			</scroll-view>
		</u-popup>

		<u-picker title="查询月份或者日期" @confirm="getTimeStatus" @cancel="toggleTimeVisible" :show="timeVisible" :columns="columns"></u-picker>

		<u-datetime-picker
			ref="datetimePicker"
			:formatter="formatter"
			:show="show"
			v-model="times"
			:mode="curIndex === 1 ? 'date' : 'year-month'"
			@confirm="getSelectTime"
			@cancel="toggleTimeSelect"
		></u-datetime-picker>
	</view>
</template>

<script>
import { getDepotByUserId } from '@/apis'
export default {
	name: 'CustomDropdown',
	data() {
		return {
			storeVisible: false,
			timeVisible: false,
			show: false,
			columns: [['日', '月']],
			list: [],
			curIndex: 2,
			times: Date.now(),
			curName: '全部门店'
		}
	},
	async created() {
		const user = uni.getStorageSync('userInfo')
		const { data } = await getDepotByUserId({ userId: user.id })
		this.list = data.map((item) => ({
			name: item.name,
			select: false,
			id: item.id,
			location: item.location
		}))
		this.list.unshift({ name: '全部门店', select: true, id: 0, location: '全部' })

	},
	mounted() {
		this.$refs.datetimePicker.setFormatter(this.formatter)
	},
	methods: {
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
		toggleStoreVisible() {
			this.storeVisible = !this.storeVisible
		},
		toggleTimeVisible() {
			this.timeVisible = !this.timeVisible
		},
		toggleTimeSelect() {
			this.show = !this.show
		},

		selectStore(item) {
			console.log('选择当前店铺', item)
			this.list.forEach((e) => {
				e.select = e.id === item.id
			})
			this.toggleStoreVisible()
			this.curName = item.name
			this.$emit('selectStore', item)
		},

		getSelectTime(val) {
			console.log('获取选择的时间', val)
			this.toggleTimeSelect()
			this.$emit('selectTime', val)
		},

		getTimeStatus(v) {
			console.log('查询方式', v.value[0])
			let str = v.value[0]
			if (str === '日') this.curIndex = 1
			else this.curIndex = 2
			this.toggleTimeVisible()
			this.toggleTimeSelect()
		},
		formatTime(timestamp) {
			const date = new Date(timestamp)
			const year = date.getFullYear()
			const month = date.getMonth() + 1 // 月份从0开始，需要加1
			const day = date.getDate()
			// 格式化月份和日期，确保两位数显示（例如：04月，09日）
			const formattedMonth = month < 10 ? `0${month}` : `${month}`
			const formattedDay = day < 10 ? `0${day}` : `${day}`
			return `${year}-${formattedMonth}-${formattedDay}`
		}
	}
}
</script>

<style scoped lang="scss">
.dropdown {
	position: relative;
	height: 82rpx;
	width: 100%;
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 5px;
	&-item {
		font-size: 28rpx;
		color: #606266;
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.store {
	width: 100%;
	height: 300px;
	box-sizing: border-box;
	.store-item {
		border-bottom: 1rpx solid #f2f2f2;
		width: 100%;
		padding: 26rpx 32rpx;
		font-size: 28rpx;
		line-height: 54rpx;
		color: #606266;
		text-align: justify;
	}
}
</style>
