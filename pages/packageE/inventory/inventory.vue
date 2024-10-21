<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" auto-show-back-to-top>
		<template slot="top">
			<AppletHeader title="销售" left-icon="account" right-icon=" "></AppletHeader>
			<nav-search-bar @search="getKeyWords" desc="单号/客户/商品/备注"></nav-search-bar>
		</template>

		<view class="container">
			<horizontal-card title="实际库存" :title-price="total" :subtitle-price="totalCostPrice" subtitle="总金额"></horizontal-card>

			<view class="list flex" v-for="item of dataList" :key="item.id">
				<view class="img">
					<u--image :showLoading="true" :src="item.imgName" width="60px" height="60px"></u--image>
				</view>
				<view class="content">
					<u--text :text="item.name" bold margin="0 0 10px 0"></u--text>
					<text>库存：{{ item.currentStock }}</text>
					<view class="flex flex-items-center">
						<text>总金额：</text>
						<u--text mode="price" :text="item.costPrice"></u--text>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script>
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import HorizontalCard from '@/components/HorizontalCard/HorizontalCard.vue'
import { getStockList } from '@/apis'
export default {
	components: {
		HorizontalCard,
		NavSearchBar
	},
	data() {
		return {
			dataList: [],
			keywords: '',
			depotId: '',
			total: 0,
			totalCostPrice: 0
		}
	},
	onLoad() {},
	methods: {
		getKeyWords(v) {
			this.keyword = v
			this.$refs.paging.reload()
		},
		async queryList(pageNo, pageSize) {
			let obj = {}
			try {
				const { data } = await getStockList({
					enabled: true,
					currentPage: pageNo,
					pageSize: pageSize,
					depotId: this.depotId,
					sortType: 1,
					sortRule: 1,
					isStock: false,
					materialParam: this.keywords
				})

				let { rows, totalCostPrice, total } = data || {}
				this.total = total
				this.totalCostPrice = totalCostPrice
				console.log('data', data)
				// let array = rows.map((item) => ({ ...item, time: formatDateToChinese(item.operTime) }))
				this.$refs.paging.complete(rows)
				this.loading = false
			} catch (e) {
				console.log('请求失败', e)
				this.$refs.paging.complete(false)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.list {
	margin-bottom: 17rpx;
	padding: 25rpx;
	border-radius: 20rpx;
	background-color: #fff;
	.img {
		background-color: #cdd7dc;
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
	}
	.content {
		flex: 1;
		margin-left: 20rpx;
	}
}
</style>
