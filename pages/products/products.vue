<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" auto-show-back-to-top>
		<template slot="top">
			<AppletHeader title="商品" left-icon="account" right-icon=" "></AppletHeader>
			<nav-search-bar :showRight="false" desc="名称/条形码/简称"></nav-search-bar>
		</template>

		<view class="container">
			<tag-count-text :text="'共' + total + '笔'" :desc="'合计：' + totalPrice"></tag-count-text>
			<view class="mb20"></view>
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="list" v-for="(item, index) in dataList" :key="item.id">
				<view class="card flex">
					<view class="card-box">
						<u--image mode="aspectFit" :showLoading="true" :src="item.imgName" width="60" height="60"></u--image>
					</view>
					<view class="card-content">
						<u--text block bold :text="item.name" size="16" margin="0 0 10px 0" color="#000"></u--text>
						<view class="flex">
							<text>零售价：</text>
							<u--text mode="price" :text="item.commodityDecimal" color="#737373"></u--text>
						</view>
						<view class="flex">
							<text>批发价：</text>
							<u--text mode="price" :text="item.wholesaleDecimal" color="#737373"></u--text>
						</view>
						<view class="flex flex-between">
							<view class="flex">
								<text>库存：</text>
								<u--text :text="item.stock" color="#737373"></u--text>
							</view>

							<u-icon @click="handleClickOpt(item)" bold name="more-dot-fill"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script>
import { getMaterialList } from '@/apis'
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import TagCountText from '@/components/TagCountText/TagCountText.vue'

export default {
	components: {
		NavSearchBar,
		TagCountText
	},
	data() {
		return {
			dataList: [],
			keywords: '',
			total: '',
			totalPrice: '',
			loading: true
		}
	},
	onLoad() {},
	methods: {
		handleClickOpt(item) {
			console.log('点击了操作', item)
		},
		async queryList(page, pageNo) {
			let obj = {}
			try {
				const { data } = await getMaterialList({
					apiName: 'material',
					currentPage: page,
					pageSize: pageNo,
					search: { materialParam: this.keywords }
				})
				console.log(data)
				let { rows, total, totalStockCount } = data
				let array = rows
				this.totalPrice = totalStockCount
				this.total = total
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

<style lang="scss" scoped>
.search {
	padding: 25rpx 25rpx 10rpx 25rpx;
	background-color: #f1f5f8;
	width: 100%;
}

.title {
	width: 100%;
	height: 75rpx;
	background-color: #fafbfd;
	border-radius: 10rpx;
	padding: 0 30rpx;
	color: #9d9ea0;
	margin-bottom: 20px;
}

.card {
	background-color: #fff;
	margin-bottom: 17rpx;
	padding: 25rpx;
	border-radius: 20rpx;
	&-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		background-color: #cdd7dc;
		overflow: hidden;
	}
	&-content {
		flex: 1;
		color: #737373;
		margin-left: 30rpx;
	}
}
</style>
