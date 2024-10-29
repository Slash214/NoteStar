<template>
	<z-paging :refresher-enabled="false" ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>
		<template slot="top">
			<AppletHeader title="员工业绩统计" right-icon=" "></AppletHeader>
		</template>
		<view class="select">
			<view class="" @click="show = true">{{ shopName }}</view>
			<view class="">今日：{{ endTime }}</view>
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
	</z-paging>
</template>

<script>
import { timestampToDate } from '@/utils'
import { getEmployeePerformance } from '@/apis'
import SelectShop from '@/components/SelectShop/SelectShop.vue'
export default {
	components: {
		SelectShop
	},
	data() {
		return {
			dataList: [],
			beginTime: '',
			endTime: '',
			sortType: 1,
			sortRule: 1,
			depotId: '',
			show: false,
			shopName: '全部门店'
		}
	},
	onLoad() {
		this.beginTime = timestampToDate(Date.now())
		this.endTime = this.beginTime
	},
	methods: {
		cancel() {
			console.log('取消了')
			this.show = false
		},
		confirm(e) {
			console.log(e)
			this.show = false
			this.depotId = !e.id ? '' : e.id
			this.shopName = e.name
			this.$refs.paging.reload()
		},
		async queryList(pageNo, pageSize) {
			let obj = {}
			try {
				const { data } = await getEmployeePerformance({
					currentPage: pageNo,
					pageSize,
					beginTime: this.beginTime,
					endTime: this.endTime,
					depotId: this.depotId,
					sortType: this.sortType,
					sortRule: this.sortRule
				})
				let { employeePerformance } = data || {}
				console.log('data', employeePerformance)
				this.$refs.paging.complete(employeePerformance)
				// this.loading = false
			} catch (e) {
				console.log('请求失败', e)
				this.$refs.paging.complete(false)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
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
