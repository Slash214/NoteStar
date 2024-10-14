<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList">
		<AppletHeader title="销售" left-icon="account" right-icon=" "></AppletHeader>
		<u-sticky offset-top="70">
			<view class="search flex">
				<u-search @search="handleClickSearch" :showAction="false" searchIcon="scan"  @custom="handleClickSearch"
				bgColor="#fff" placeholder="单号/客户/商品/备注" v-model="keyword">
				</u-search>
				<view style="margin-left: 15px;" @click="screening">
					筛选
				</view>
			</view>
		</u-sticky>
		<view class="container">
			<view class="title flex flex-items-center">
				共{{ total }}笔 | 合计：
				<u--text mode="price" color="#9d9ea0" :text="totalPrice"></u--text>
			</view>

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
	</z-paging>
</template>

<script>
import { getDepotHeadList } from '@/apis'
import { formatDateToChinese } from '@/utils'
export default {
	data() {
		return {
			page: 1,
			pageSize: 20,
			dataList: [],
			total: '',
			totalPrice: '',
			formatDateToChinese,
			keyword: ''
		}
	},
	onLoad() {},
	methods: {
		screening() {
		   uni.navigateTo({
		   	url: '/pages/packageB/screening-page/screening-page'
		   })
		},
		scanCode() {
			console.log('扫码')
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
						type: '出库',
						subType: '零售',
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

.search {
	padding: 25rpx;
	background-color: #F1F5F8;
	width: 100%;
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
