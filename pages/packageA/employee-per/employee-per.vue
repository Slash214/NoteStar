<template>
	<z-paging
		:refresher-enabled="false"
		ref="paging"
		v-model="dataList"
		:default-page-size="20"
		@query="queryList"
		auto-show-back-to-top
	>
		<template slot="top">
			<AppletHeader title="员工业绩统计" right-icon=" "></AppletHeader>
		</template>
		<view class="select">
			<view class="flex" @click="show = true">
				{{ curShop.name }}
				<u-icon name="arrow-down-fill" size="8"></u-icon>
			</view>
			<view class="flex" @click="timeShow = true">
				{{ curTime.name }}

				<u-icon name="arrow-down-fill" size="8"></u-icon>
			</view>
		</view>
		<view class="table-container">
			<!-- Table Header -->
			<view class="table-header">
				<view class="table-cell merge">员工</view>
				<view class="table-cell">销量</view>
				<view class="table-cell">金额</view>
				<view class="table-cell">利润</view>
			</view>
			<!-- Table Rows -->
			<view class="table-row" v-for="(item, index) in dataList" :key="index">
				<view class="table-cell index half">{{ index + 1 }}</view>
				<view class="table-cell">{{ item.salesManStr }}</view>
				<view class="table-cell">{{ item.salesCount }}</view>
				<view class="table-cell">{{ item.salesRevenue.toFixed(2) }}</view>
				<view class="table-cell">{{ item.grossProfit.toFixed(2) }}</view>
			</view>
		</view>

		<select-shop :show="show" @cancel="cancel" @confirm="confirm"></select-shop>

		<u-popup :show="timeShow" @close="timeShow = false">
			<view class="popup">
				<time-filter-box @changeTime="changeTime"></time-filter-box>
				<view class="flex">
					<u-button type="info" text="取消" @click="timeShow = false"></u-button>
					<view class="ml10 mr10"></view>
					<u-button type="primary" text="确定" @click="selectTime"></u-button>
				</view>
			</view>
		</u-popup>
	</z-paging>
</template>

<script>
import { timestampToDate } from '@/utils'
import { getEmployeePerformance } from '@/apis'
import SelectShop from '@/components/SelectShop/SelectShop.vue'
import TimeFilterBox from '@/components/TimeFilterBox/TimeFilterBox.vue'

export default {
	components: {
		SelectShop,
		TimeFilterBox
	},
	data() {
		return {
			dataList: [],
			sortType: 1,
			sortRule: 1,
			show: false,
			timeShow: false,
			curShop: {
				name: '全部门店',
				id: 0
			},
			curTime: {
				name: '本月',
				tamp: '',
				start: '',
				end: ''
			},
			cacheTime: {}
		}
	},
	onLoad() {
		this.beginTime = timestampToDate(Date.now())
		this.endTime = this.beginTime
	},
	methods: {
		changeTime(e) {
			console.log('选择时间', e)
			this.cacheTime = e
			if (e.first) {
				this.curTime = {
					name: `${e.name}${e.endTime}`,
					start: e.startTime,
					end: e.endTime
				}
			}
		},
		selectTime() {
			console.log('选择了', this.cacheTime)
			let e = this.cacheTime
			this.curTime = {
				name: `${e.name}${e.endTime}`,
				start: e.startTime,
				end: e.endTime
			}
			this.timeShow = false
			this.$refs.paging.reload()
		},

		confirm(e) {
			console.log(e)
			this.show = false
			this.curShop = e
			this.$refs.paging.reload()
		},
		async queryList(pageNo, pageSize) {
			let { s, e } = this.fmatDat()
			try {
				const { data } = await getEmployeePerformance({
					currentPage: pageNo,
					pageSize,
					beginTime: this.curTime.start || s,
					endTime: this.curTime.end || e,
					depotId: this.curShop.id || '',
					sortType: this.sortType,
					sortRule: this.sortRule
				})
				let { employeePerformance } = data || {}
				console.log('data', employeePerformance)
				this.$refs.paging.complete(employeePerformance)
			} catch (e) {
				console.log('请求失败', e)
				this.$refs.paging.complete(false)
			}
		},
		fmatDat() {
			const today = new Date()
			const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

			// 格式化日期为 YYYY-MM-DD
			const formatDate = (date) => {
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				return `${year}-${month}-${day}`
			}
			let s = formatDate(firstDay)
			let e = formatDate(today)

			return { s, e }
		}
	}
}
</script>

<style lang="scss" scoped>
.popup {
	width: 100%;
	padding: 20px;
}	
	
.select {
	box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
	border-top-left-radius: 40rpx;
	border-top-right-radius: 40rpx;
	background: #fff;
	height: 100rpx;
	display: flex;
	color: #606266;
	font-size: 28rpx;
	align-items: center;
	justify-content: space-around;
	padding: 20rpx;
}

.table-container {
	display: flex;
	flex-direction: column;
	// border: 1px solid #ddd;
	border-radius: 8px;
	overflow: hidden;
}

.table-header,
.table-row {
	display: flex;
	align-items: center;
}

.index {
	font-weight: 700;
	color: #9d9ea0;
}
.table-header {
	background: #eef3fe;
	font-weight: 500;
}
.table-row {
	&:nth-child(odd) {
		background-color: #f7f9fe;
	}
	&:nth-child(2) {
		.index {
			color: #d75546;
		}
	}
	&:nth-child(3) {
		.index {
			color: #f0822d;
		}
	}
	&:nth-child(4) {
		.index {
			color: #e5b840;
		}
	}
}

.table-cell {
	padding: 10px;
	flex: 1;
	text-align: center;
}
.merge {
	flex: 1.5; /* This will make it span across two columns */
}
.half {
	flex: 0.2;
}
</style>
