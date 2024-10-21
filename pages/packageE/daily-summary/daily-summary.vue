<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>
		<view slot="top">
			<AppletHeader title="日常收支"></AppletHeader>
			<nav-search-bar @search="getSearchValue" desc="单号/备注"></nav-search-bar>
		</view>

		<view class="container">
			<view class="flex flex-items-center nav-box">
				<view class="flex flex-items-center">
					<text>收入合计:</text>
					<u--text color="#9d9ea0" :text="inAmount" mode="price"></u--text>
				</view>
				<view class="line"></view>
				<view class="flex flex-items-center">
					<text>支出合计:</text>
					<u--text color="#9d9ea0" :text="outAmount" mode="price"></u--text>
				</view>
			</view>

			<view class="list" v-for="(item, index) in dataList" :key="item.id">
				<view class="dataTitle" v-if="index === 0 || item.time !== dataList[index - 1].time">{{ item.time }}</view>
				<view class="dataItem flex flex-between">
					<view class="">
						<view class="organName">{{ item.name }}</view>
						<view class="number">{{ item.number }}</view>
					</view>
					<view class="flex flex-items-center">
						<text v-if="item.type === 'out'">-</text>
						<u--text align="right" color="#444" size="16" mode="price" :text="item.totalAmount"></u--text>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script>
import { getInOutinfoList } from '@/apis'
import { formatDateToChinese } from '@/utils'
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
export default {
	components: {
		NavSearchBar
	},
	data() {
		return {
			keywords: '',
			salesMan: '',
			beginTime: '',
			endTime: '',
			dataList: [],
			inAmount: 0,
			outAmount: 0
		}
	},
	onLoad() {},
	onShow() {
		// 判断有没有缓存
		const screenData = uni.getStorageSync('screenData') || null
		if (screenData) {
			console.log('缓存', screenData)
			this.beginTime = screenData.startTime
			this.endTime = screenData.endTime
			this.salesMan = screenData.arr[1].obj?.id ? screenData.arr[1].obj?.id : ''
			this.$refs.paging.reload()
		} else {
			// 开始时间和结束时间默认为本月的
			let endTime = new Date()
			// 获取当前月份的1号时间
			let startTime = new Date(endTime.getFullYear(), endTime.getMonth(), 1)
			this.beginTime = this.formatDate(startTime)
			this.endTime = this.formatDate(endTime)
		}
	},
	methods: {
		getSearchValue(v) {
			console.log('搜索', v)
			this.keywords = v
			this.$refs.paging.reload()
		},
		async queryList(page, pageNo) {
			let obj = {
				beginTime: this.beginTime,
				endTime: this.endTime,
				depotId: '',
				salesMan: this.salesMan,
				creator: ''
			}

			try {
				const { data } = await getInOutinfoList({
					currentPage: page,
					pageSize: pageNo,
					search: { materialParam: this.keywords, ...obj }
				})
				console.log(data)
				let { outAmount, inAmount } = data
				this.inAmount = inAmount
				this.outAmount = outAmount
				let array = data.data.map((item) => ({ ...item, time: formatDateToChinese(item.createTime) }))
				console.log('array', array)
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
.container {
	.nav-box {
		width: 100%;
		height: 75rpx;
		margin-bottom: 17rpx;
		background-color: #fafbfd;
		border-radius: 10rpx;
		padding: 0 30rpx;
		color: #9d9ea0;

		.line {
			width: 1rpx;
			height: 30rpx;
			background-color: #ccc;
			margin: 0 15rpx;
		}
	}

	.list {
		margin-bottom: 17rpx;
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
				font-weight: 500;
				font-size: 32rpx;
				margin-bottom: 25rpx;
			}
			.price {
				color: #000;
				font-weight: 500;
				font-size: 32rpx;
			}
		}
	}
}
</style>
