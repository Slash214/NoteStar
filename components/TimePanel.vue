<template>
	<view class="time-panel">
		<!-- 顶部切换按钮 -->
		<view class="time-switch">
			<view :class="['time-option', currentMode === 'month' ? 'active' : '']" @tap="switchMode('month')">
				选择月份
			</view>
			<view :class="['time-option', currentMode === 'date' ? 'active' : '']" @tap="switchMode('date')">
				选择日期
			</view>
		</view>

		<!-- 月份选择面板 -->
		<scroll-view v-if="currentMode === 'month'" scroll-y class="time-content">
			<view v-for="(year, yearIndex) in monthData" :key="yearIndex" class="time-year">
				<view class="time-year-label">{{ year.year }}年</view>
				<view class="time-months">
					<view
						v-for="(month, monthIndex) in year.months"
						:key="monthIndex"
						:class="['time-month', selectedMonth === `${year.year}-${month}` ? 'selected' : '']"
						@tap="selectMonth(year.year, month)"
					>
						{{ month }}月
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 日期选择面板 -->
		<scroll-view v-if="currentMode === 'date'" scroll-y class="time-content">
			<view v-for="(year, yearIndex) in dateData" :key="yearIndex" class="time-year">
				<view class="time-year-label">{{ year.year }}年</view>
				<view v-for="(month, monthIndex) in year.months" :key="monthIndex" class="time-month">
					<view class="time-month-label">{{ month.month }}月</view>
					<view class="time-days">
						<view
							v-for="(day, dayIndex) in month.days"
							:key="dayIndex"
							:class="[
								'time-day',
								selectedDate === `${year.year}-${month.month}-${day}` ? 'selected' : ''
							]"
							@tap="selectDate(year.year, month.month, day)"
						>
							{{ day }}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'TimePanel',
	data() {
		return {
			currentMode: 'month', // 当前模式：'month' 或 'date'
			selectedMonth: '', // 当前选中的月份，格式为 yyyy-mm
			selectedDate: '', // 当前选中的日期，格式为 yyyy-mm-dd
			monthData: [], // 月份选择的数据
			dateData: [] // 日期选择的数据
		}
	},
	created() {
		this.initMonthData()
		this.initDateData()
		this.setDefaultSelection()
	},
	methods: {
		// 切换模式
		switchMode(mode) {
			this.currentMode = mode
		},
		// 初始化月份数据
		initMonthData() {
			const currentYear = new Date().getFullYear()
			for (let year = currentYear - 1; year <= currentYear + 1; year++) {
				const months = Array.from({ length: 12 }, (_, i) => i + 1)
				this.monthData.push({ year, months })
			}
		},
		// 初始化日期数据
		initDateData() {
			const currentYear = new Date().getFullYear()
			for (let year = currentYear - 1; year <= currentYear + 1; year++) {
				const months = Array.from({ length: 12 }, (_, i) => {
					const days = new Date(year, i + 1, 0).getDate() // 获取每月天数
					return {
						month: i + 1,
						days: Array.from({ length: days }, (_, j) => j + 1)
					}
				})
				this.dateData.push({ year, months })
			}
		},
		// 设置默认选中值
		setDefaultSelection() {
			const today = new Date()
			const year = today.getFullYear()
			const month = today.getMonth() + 1
			const date = today.getDate()
			this.selectedMonth = `${year}-${String(month).padStart(2, '0')}`
			this.selectedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
		},
		// 选择月份
		selectMonth(year, month) {
			this.selectedMonth = `${year}-${String(month).padStart(2, '0')}`
			this.$emit('select', { mode: 'month', value: this.selectedMonth })
		},
		// 选择日期
		selectDate(year, month, day) {
			this.selectedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
			this.$emit('select', { mode: 'date', value: this.selectedDate })
		}
	}
}
</script>

<style scoped lang="scss">
.time-panel {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.time-switch {
	display: flex;
	justify-content: space-around;
	padding: 10px 0;
	background-color: #f7f7f7;
	border-bottom: 1px solid #e5e5e5;
}

.time-option {
	flex: 1;
	text-align: center;
	padding: 10px 0;
	font-size: 16px;
	color: #333;
	cursor: pointer;
}

.time-option.active {
	font-weight: bold;
	color: #007aff;
}

.time-content {
	flex: 1;
	overflow-y: auto;
	padding: 10px;
}

.time-year {
	margin-bottom: 20px;
}

.time-year-label {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
	color: #666;
}

.time-months,
.time-days {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.time-month,
.time-day {
	width: 20%;
	text-align: center;
	padding: 10px 0;
	background-color: #f2f2f2;
	border-radius: 5px;
	font-size: 16px;
	color: #333;
	cursor: pointer;
}

.time-month.selected,
.time-day.selected {
	background-color: #007aff;
	color: #fff;
	font-weight: bold;
}

.time-month-label {
	font-size: 16px;
	margin-bottom: 5px;
	font-weight: bold;
}
</style>
