<template>
	<view>
		<AppletHeader title="员工业绩统计"></AppletHeader>
		<view class="table">
			<view class="table-header">
				<text>员工</text>
				<text>销量</text>
				<text>金额</text>
				<text>利润</text>
			</view>
			<view v-for="(item, index) in tableData" :key="index" class="table-row" :class="{ highlight: index < 3 }">
				<text>{{ index + 1 }} {{ item.employee }}</text>
				<text>{{ item.sales }}</text>
				<text>{{ item.amount }}</text>
				<text>{{ item.profit }}</text>
			</view>
			<view class="footer">没有更多了</view>
		</view>
	</view>
</template>

<script>
import { getEmployeePerformance } from '@/apis'
export default {
	data() {
		return {
			tableData: [
				{ employee: '龙泉店-石勇', sales: 1, amount: 17143.0, profit: 9143.0 },
				{ employee: '新都仓-陈梦婷', sales: 1, amount: 456.0, profit: 217.39 },
				{ employee: '新都仓-胡晓月', sales: 3, amount: 14047.0, profit: 1304.63 },
				{ employee: '岳池店-胡婷', sales: 3, amount: 748.0, profit: 508.0 },
				{ employee: '双流店-二娃', sales: 4, amount: 2248.0, profit: 1178.0 },
				{ employee: '广安店-胡长军', sales: 5, amount: 624.9, profit: 465.9 }
			]
		}
	},
	onLoad() {},
	methods: {
		async getData() {},
		formatCurrency(value) {
			return value.toLocaleString('en-US', { style: 'currency', currency: '' })
		}
	}
}
</script>

<style lang="scss" scoped>
.table {
	padding: 10px;
	.table-header,
	.table-row {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		text-align: justify;
		border-bottom: 1px solid #e5e5e5;
		text {
			display: inline-block;
			width: 20%;
			&:first-child {
				width: 40%;
			}
		}
	}

	.table-header {
		font-weight: bold;
		background-color: #EEF3FE;
		color: #444648;
	}

	.table-row.highlight {
		color: #f56c6c;
	}

	.footer {
		text-align: center;
		margin-top: 10px;
		color: #888888;
	}
}
</style>
