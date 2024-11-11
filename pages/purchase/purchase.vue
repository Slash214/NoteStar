<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList">
		<AppletHeader title="进货" left-icon="account" right-icon=" "></AppletHeader>
		<nav-search-bar desc="单号/客户/商品/备注"></nav-search-bar>
		
		<view class="container">
			<tag-count-text :text="'共' + total + '笔'" :desc="'合计：' + totalPrice"></tag-count-text>
			<view class="mb20"></view>
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="list" v-for="(item, index) in dataList" :key="item.id">
				<view class="dataTitle" v-if="index === 0 || item.time !== dataList[index - 1].time">{{ item.time }}</view>
				<view class="dataItem flex flex-between">
					<view class="">
						<view class="organName">{{ item.organName }}</view>
						<view class="number">{{ item.number }}</view>
					</view>
					<u--text align="right" color="#000" size="18" block bold mode="price" :text="item.totalPrice"></u--text>
				</view>
			</view>
		</view>
		
		<view v-if="!loading" class="fix-icon flex flex-items-center flex-center" @click="gotoSetForm">
			<image :src="staticImageUrl + '/purchase/purchase.png'" mode="aspectFit"></image>
		</view>
	</z-paging>
</template>

<script>
import { getDepotHeadList } from '@/apis'
import { formatDateToChinese } from '@/utils'
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import TagCountText from '@/components/TagCountText/TagCountText.vue'
import { staticImageUrl } from '@/common/contanst'


export default {
	components: {
		TagCountText,
		NavSearchBar
	},
	data() {
		return {
			staticImageUrl,
			loading: true,
			dataList: [],
			total: '',
			totalPrice: '',
			formatDateToChinese,
			keyword: '',
		}
	},
	onLoad() {
		
	},
	methods: {
		screening() {
			uni.navigateTo({
				url: '/pages/packageB/screening-page/screening-page'
			})
		},
		scanCode() {
			console.log('扫码')
		},
		gotoSetForm() {
			console.log('进货的')
			uni.navigateTo({
				url: '/pages/packageB/set-form/set-form?type=2'
			})
		},
		handleClickSearch(v) {
			console.log('开始搜索', v)
			this.keyword = v
		},
		async queryList(pageNo, pageSize) {
			let obj = {}
			try {
				const { data } = await getDepotHeadList({
					apiName: 'depotHeadList',
					currentPage: pageNo,
					pageSize: pageSize,
					search: {
						type: '入库',
						subType: '采购',
						// 搜索关键词
						fuzzyQueryParam: '',
						...obj
					}
				})
				let { rows, totalPrice, total } = data || {}
				this.total = total
				this.totalPrice = totalPrice
				console.log('data', data)
				let array = rows.map((item) => ({ ...item, time: formatDateToChinese(item.operTime) }))
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
.title {
	width: 100%;
	height: 75rpx;
	background-color: #fafbfd;
	border-radius: 10rpx;
	padding: 0 30rpx;
	color: #9d9ea0;
	margin-bottom: 20px;
}

.fix-icon {
	position: fixed;
	z-index: 9;
	background-color: #FA6400;
	bottom: 50rpx;
	right: 30rpx;
	width: 180rpx;
	height: 90rpx;
	border-radius: 50rpx;
	box-shadow: 5px 5px 20px rgba(250,100,0, 0.5);
	image {
		width: 120rpx;
	}
}
.list {
	margin-bottom: 25rpx;
	.dataTitle {
		margin: 0 0 17rpx 20rpx;
		color: #9d9ea0;
	}
	.dataItem {
		background-color: #fff;
		padding: 25rpx;
		border-radius: 20rpx;
		.organName {
			color: #000;
			font-weight: 600;
			font-size: 32rpx;
			margin-bottom: 25rpx;
		}
		.price {
			color: #000;
			font-weight: 600;
			font-size: 32rpx;
		}
	}
}
</style>
