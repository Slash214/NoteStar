<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top :refresher-enabled="false">
		<template slot="top">
			<AppletHeader title="库存查询" rightIcon=" "></AppletHeader>
			<nav-search-bar @rightClick="rightClick" @search="getKeyWords" desc="商品名称/条形码/简拼"></nav-search-bar>
		</template>

		<view class="container">
			<view class="select flex">
				<view class="flex" @click="visible = true">
					<text>{{ curStore.name }}</text>
					<u-icon name="arrow-down-fill" size="12"></u-icon>
				</view>
				<view class="flex" @click="selectSort">
					<text>{{ curSortItem.label }}</text>
					<u-icon name="arrow-down-fill" size="12"></u-icon>
				</view>
			</view>
			<horizontal-card
				title="实际库存"
				:titlePrice="total"
				subtitle="总金额"
				:subtitlePrice="totalCostPrice"
			></horizontal-card>
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="cardItem" v-for="item of dataList" :key="item.id" @click="gotoStockDetails(item)">
				<view class="img-box">
					<u--image :showLoading="true" :src="item.imgName" width="60px" height="60px"></u--image>
				</view>

				<view class="content">
					<u--text margin="10px 0" :text="item.name" size="16" bold></u--text>
					<view>库存：{{ item.currentStock }}</view>
					<view class="flex">
						<text>总金额：</text>
						<u--text mode="price" :text="item.costPrice"></u--text>
					</view>
				</view>
			</view>
		</view>

		<select-shop :show="visible" @cancel="visible = false" @confirm="storeConfirm"></select-shop>
		<u-picker
			:show="show"
			@cancel="show = false"
			@confirm="sortConfirm"
			keyName="label"
			:columns="[sortList]"
		></u-picker>
	</z-paging>
</template>

<script>
import SelectShop from '@/components/SelectShop/SelectShop.vue'
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import HorizontalCard from '@/components/HorizontalCard/HorizontalCard.vue'
import { getStockList, getDepotByUserId } from '@/apis'
import Big from 'big.js';

export default {
	components: {
		NavSearchBar,
		HorizontalCard,
		SelectShop
	},
	data() {
		return {
			show: false,
			visible: false,
			dataList: [],
			keywords: '',
			// sortType: 1,
			total: 0,
			enabled: true,
			sortRule: 1,
			totalCostPrice: 0,
			loading: true,
			sortList: [
				{ label: '按商品名称升序', value: 1 },
				{ label: '按库存数量升序', value: 2 },
				{ label: '按库存金额升序', value: 3 }
			],
			curSortItem: {},
			curStore: {
				id: 0,
				name: '全部门店'
			},
			userId: 0
		}
	},
	onLoad() {
		this.curSortItem = this.sortList[0]
		const user = uni.getStorageSync('userInfo') || null
		this.userId = user?.id || 0
	},
	onShow() {
		const obj = uni.getStorageSync('stockData')
		if (obj) {
			this.enabled = obj.enabled
			this.sortRule = obj.sortRule
			this.$refs.paging.reload()
		}
	},
	methods: {
		// async getUserStore() {
		// 	const { data } = await getDepotByUserId({
		// 		userId: this.userId
		// 	})
			
		// 	console.log('店铺', data)
		// },
		gotoStockDetails(item) {
			console.log('去商品库存', item)
			let depotId = this.curStore.id
			uni.navigateTo({
				url: `/pages/packageE/stock-details/stock-details?id=${item.id}&depotId=${depotId}`
			})
		},
		rightClick() {
			uni.navigateTo({
				url: '/pages/packageC/stock-filter/stock-filter'
			})
		},
		storeConfirm(e) {
			console.log('店铺', e)
			this.curStore = e
			this.visible = false
			this.$refs.paging.reload()
		},
		selectSort() {
			console.log('选择')
			this.show = true
		},
		sortConfirm(e) {
			console.log(e.value)
			// let item = e.value[0]
			this.curSortItem = e.value[0]
			this.show = false
			this.$refs.paging.reload()
		},
		getKeyWords(v) {
			console.log(v)
			this.keywords = v
			this.$refs.paging.reload()
		},
		async queryList(pageNo, pageSize) {
			this.loading = true
			try {
				const { data } = await getStockList({
					currentPage: pageNo,
					pageSize: pageSize,
					enabled: this.enabled,
					depotId: this.curStore?.id || '',
					sortType: this.curSortItem.value,
					materialParam: this.keywords,
					sortRule: this.sortRule,
					isStock: false,
					userId: this.userId
				})
				let { rows, totalCostPrice, total } = data || {}
				// this.total = total
				// this.totalCostPrice = totalCostPrice
				this.total = new Big(total);
				this.totalCostPrice = new Big(totalCostPrice);
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

<style scoped lang="scss">
.container {
	padding: 0 30rpx;
}
.select {
	height: 82rpx;
	margin-bottom: 20rpx;
	view {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #737373;
	}
}
.cardItem {
	margin-bottom: 17rpx;
	padding: 25rpx;
	border-radius: 20rpx;
	background-color: #fff;
	display: flex;
	.img-box {
		background-color: #cdd7dc;
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.content {
		margin-left: 30rpx;
		flex: 1;
		color: #737373;
	}
}
</style>
