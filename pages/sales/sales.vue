<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" auto-show-back-to-top>
		<template slot="top">
			<AppletHeader
				:autoBack="false"
				@leftClick="modalVisible = true"
				title="销售"
				left-icon="account"
				right-icon=" "
			></AppletHeader>
			<nav-search-bar @rightClick="rightClick" @search="getKeyWords" desc="单号/客户/商品/备注"></nav-search-bar>
		</template>

		<view class="container">
			<tag-count-text :text="'共' + total + '笔'" :desc="'合计：' + totalPrice || 0"></tag-count-text>
			<view class="mb20"></view>
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="list" v-for="(item, index) in dataList" :key="item.id" @click="handleClick(item)">
				<view class="dataTitle" v-if="index === 0 || item.time !== dataList[index - 1].time">
					{{ item.time }}
				</view>
				<view class="dataItem flex flex-between">
					<view class="">
						<view class="organName">{{ item.organName }}</view>
						<view class="number">{{ item.number }}</view>
					</view>
					<u--text align="right" color="#000" size="18" bold mode="price" :text="item.totalPrice"></u--text>
				</view>
			</view>
		</view>

		<view v-if="!loading" class="fix-icon flex flex-items-center flex-center" @click="gotoSetForm">
			<image :src="staticImageUrl + '/sales/kaidan.png'" mode="aspectFit"></image>
		</view>

		<user-popup :visible="modalVisible" @close="modalVisible = false"></user-popup>
	</z-paging>
</template>

<script>
import { getDepotHeadList } from '@/apis'
import { formatDateToChinese, timestampToDate } from '@/utils'
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import TagCountText from '@/components/TagCountText/TagCountText.vue'
import { staticImageUrl } from '@/common/contanst'
import UserPopup from '@/components/UserPopup/UserPopup.vue'

export default {
	components: {
		TagCountText,
		NavSearchBar,
		UserPopup
	},
	data() {
		return {
			modalVisible: false,
			staticImageUrl,
			loading: true,
			dataList: [],
			total: '',
			totalPrice: '',
			formatDateToChinese,
			keyword: '',
			reqObj: {
				depotId: '',
				salesMan: '',
				creator: '',
				beginTime: '',
				endTime: ''
			}
		}
	},
	onLoad() {
		this.reqObj.beginTime = timestampToDate(Date.now())
	},
	onShow() {
		const screenData = uni.getStorageSync('screenData')
		if (screenData) {
			let { startTime, endTime, arr } = screenData
			console.log('筛选结果', screenData)
			let obj = {}
			obj.beginTime = `${startTime} 00:00:00`
			obj.endTime = `${endTime} 23:59:59`
			obj.depotId = !arr[0].obj.id ? '' : arr[0].obj.id
			obj.salesMan = !arr[1].obj.id ? '' : arr[1].obj.id
			obj.creator = !arr[2].obj.id ? '' : arr[2].obj.id
			this.reqObj = obj
			console.log('请求测试', this.reqObj)
			this.$refs.paging.reload()
		}
		
		uni.removeStorageSync('selectList')
		uni.removeStorageSync('currPage')
		uni.removeStorageSync('goodsInfo')
		uni.removeStorageSync('goodsUpdate')
		
	},
	methods: {
		rightClick() {
			console.log('点击右边的')
			uni.navigateTo({
				url: '/pages/packageB/screening-page/screening-page'
			})
		},
		handleClick(item) {
			uni.navigateTo({
				url: `/pages/packageB/sales-order-detail/sales-order-detail?number=${item.number}&type=1`
			})
		},
		getKeyWords(v) {
			console.log('获取的', v)
			this.keyword = v
			this.$refs.paging.reload()
		},
		gotoSetForm() {
			console.log('销售开单的')
			uni.navigateTo({
				url: '/pages/packageB/set-form/set-form?type=1'
			})
		},
		async queryList(pageNo, pageSize) {
			let obj = {}
			try {
				const { data } = await getDepotHeadList({
					apiName: 'depotHeadList',
					currentPage: pageNo,
					pageSize: pageSize,
					search: {
						type: '出库',
						subType: '零售',
						fuzzyQueryParam: this.keyword,
						...this.reqObj
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
	background-color: #00c9dd;
	bottom: 50rpx;
	right: 30rpx;
	width: 180rpx;
	height: 90rpx;
	border-radius: 50rpx;
	box-shadow: 5px 5px 20px rgba(0, 201, 221, 0.5);
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
		align-items: flex-start;
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
