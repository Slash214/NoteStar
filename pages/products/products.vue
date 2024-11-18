<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>
		<template slot="top">
			<AppletHeader title="商品" @leftClick="leftClick" :autoBack="false" left-icon="account" right-icon="plus" left-icon-bold="true" @rightClick="addProduct"></AppletHeader>
			<nav-search-bar @search="getKeyWord" :showRight="false" desc="名称/条形码/简称"></nav-search-bar>
		</template>

		<view class="container">
			<horizontal-card title="商品数量" :titlePrice="total" subtitle="库存" :subtitle-price="totalPrice"></horizontal-card>

			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="list" v-for="(item, index) in dataList" :key="item.id" @click="handleClickCard(item)">
				<view class="card flex">
					<view class="card-box">
						<u--image mode="aspectFit" :showLoading="true" :src="item.imgName ? item.imgList[0] : ''" width="60" height="60"></u--image>
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

							<view class="" @tap.stop="handleClickOpt(item)">
								<u-icon bold name="more-dot-fill"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="" slot="loading">
			<u-loading :show="true"></u-loading>
		</view>

		<u-action-sheet
			@close="show = false"
			cancelText="取消"
			safeAreaInsetBottom
			:actions="list"
			:closeOnClickOverlay="true"
			:closeOnClickAction="true"
			@select="selectClick"
			:show="show"
		></u-action-sheet>

		<u-modal showCancelButton @cancel="delVisible = false" @confirm="onConfirm" :show="delVisible" title="删除商品">
			<view class="slot-content" style="text-align: center">
				{{ content }}
			</view>
		</u-modal>
		
		<user-popup :visible="modalVisible" @close="modalVisible = false"></user-popup>
	</z-paging>
</template>

<script>
import { getMaterialList, deleteMaterial } from '@/apis'
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import TagCountText from '@/components/TagCountText/TagCountText.vue'
import HorizontalCard from '@/components/HorizontalCard/HorizontalCard.vue'
import UserPopup from '@/components/UserPopup/UserPopup.vue'
export default {
	components: {
		NavSearchBar,
		TagCountText,
		UserPopup,
		HorizontalCard
	},
	data() {
		return {
			modalVisible: false,
			dataList: [],
			keywords: '',
			total: '',
			totalPrice: '',
			loading: true,
			show: false,
			delVisible: false,
			productName: '',
			productId: 0,
			content: '确定要删除商品：',
			list: [
				{
					name: '编辑',
					id: 1
				},
				{
					name: '删除',
					id: 2
				}
			],
			cacheItem: {}
		}
	},
	onLoad() {},
	onShow() {
		this.$refs.paging.reload()
		
		uni.removeStorageSync('screenData')
		uni.removeStorageSync('goodsUpdate')
		uni.removeStorageSync('selectList')
		uni.removeStorageSync('goodsInfo')
	},
	methods: {
		leftClick() {
			this.modalVisible = true
		},
		addProduct() {
			console.log('添加商品')
			uni.navigateTo({
				url: '/pages/packageD/set-product/set-product?isUpdate=false'
			})
		},
		handleClickCard(item) {
			console.log('item', item)
			uni.navigateTo({
				url: `/pages/packageC/product-details/product-details?id=${item.id}`
			})
		},
		async onConfirm() {
			console.log('确认删除')
			const { data, code } = await deleteMaterial({
				id: this.productId,
				apiName: 'material'
			})
			this.delVisible = false
			console.log(data)
			if (code !== 0) {
				uni.showToast({
					title: '开单商品无法删除',
					icon: 'none'
				})
			} else {
				uni.showToast({
					title: '删除成功',
					icon: 'none'
				})
				this.dataList = this.dataList.filter((item) => item.id !== this.productId)
			}
		},
		getKeyWord(v) {
			this.keywords = v
			this.loading = true
			this.$refs.paging.reload()
		},
		selectClick(index) {
			if (index.id === 2) {
				this.delVisible = true
				this.content = `确定要删除商品：${this.productName}`
				console.log('删除')
			}

			if (index.id === 1) {
				console.log('编辑')
				// return
				uni.setStorageSync('editData', this.cacheItem)
				uni.navigateTo({
					url: '/pages/packageD/set-product/set-product?isUpdate=true'
				})
			}
		},
		handleClickOpt(item) {
			console.log('点击了操作', item)
			this.cacheItem = item
			this.productId = item.id
			this.productName = item.name
			this.show = true
		},
		async queryList(page, pageNo) {
			let obj = {}
			try {
				const { data } = await getMaterialList({
					apiName: 'material',
					currentPage: page,
					pageSize: pageNo,
					search: {
						materialParam: this.keywords
					}
				})
				console.log(data)
				let { rows, total, totalStockCount } = data
				let array = rows.map((item) => ({
					...item,
					imgList: item?.imgName?.split(',') || []
				}))

				// console.error('array', array)
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
	padding: 25rpx 25rpx 0 25rpx;
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
