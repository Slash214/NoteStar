<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>
		<view slot="top">
			<AppletHeader :autoBack="false" @leftClick="leftClick" title="日常收支" right-icon=" "></AppletHeader>
			<nav-search-bar @search="getSearchValue" desc="单号/备注"  @rightClick="rightClick"></nav-search-bar>
		</view>

		<view class="container">
			<block v-if="dataList.length">
				<horizontal-card title="收入合计" :titlePrice="inAmount" subtitle="支出合计" :subtitlePrice="outAmount"></horizontal-card>
			</block>

			<view class="list" v-for="(item, index) in dataList" :key="item.id" @click="handleClickItem(item)">
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
		
		
		<template slot="empty">
			<view class="">
				<image style="height: 250rpx" mode="heightFix" src="https://haoxianhui.com/hxh/2024/11/22/6118c2c4089c4b818bcbfc92296f5bf2.png"></image>
			    <view style="text-align: center;">暂无日常收支，点击右下角马上开单</view>
			</view>
		</template>
		
		<view class="fixed-btn" @click="gotoView">
			<image :src="staticImageUrl + '/more/inOut.png'" mode="aspectFit"></image>
		</view>
	</z-paging>
</template>

<script>
import { staticImageUrl } from '@/common/contanst'
import { getInOutinfoList } from '@/apis'
import HorizontalCard from '@/components/HorizontalCard/HorizontalCard.vue'
import { formatDateToChinese, timestampToDate } from '@/utils'
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
export default {
	components: {
		NavSearchBar,
		HorizontalCard
	},
	data() {
		return {
			staticImageUrl,
			keywords: '',
			dataList: [],
			inAmount: 0,
			outAmount: 0,
			reqObj: {
				salesMan: '',
				beginTime: '',
				deleteFlag: '',
				endTime: '',
				creator: '',
				deleteFlag: '',
				depotId: ''
			}
		}
	},
	onLoad() {},
	onShow() {
		// 判断有没有缓存
		const screenData = uni.getStorageSync('t2screenData') || null
		if (screenData) {
			console.log('缓存', screenData)
			let { startTime, endTime, arr } = screenData
			let obj = {}
			obj.beginTime = `${startTime} 00:00:00`
			obj.endTime = `${endTime} 23:59:59`
			obj.depotId = !arr[0].obj.id ? '' : arr[0].obj.id
			obj.salesMan = !arr[1].obj.id ? '' : arr[1].obj.id
			obj.creator = !arr[2].obj.id ? '' : arr[2].obj.id
			obj.deleteFlag = !arr[3].obj.id ? "0" : "1"
			this.reqObj = obj
			console.log('请求测试', this.reqObj)
			this.$refs.paging.reload()
		} else {
			// 开始时间和结束时间默认为本月的
			let endTime = new Date()
			// 获取当前月份的1号时间
			let startTime = new Date(endTime.getFullYear(), endTime.getMonth(), 1)
			this.reqObj.beginTime = timestampToDate(startTime)
			this.reqObj.endTime = timestampToDate(endTime)
			this.$refs.paging.reload()
		}
	},
	methods: {
		rightClick() {
			uni.navigateTo({
				url: `/pages/packageB/screening-page/screening-page?type=3`
			})
		},
		leftClick() {
			uni.switchTab({
				url: '/pages/more/more'
			})
		},
		handleClickItem(item) {
			console.log(item)
			let number = item.number
			uni.navigateTo({
				url: `/pages/packageE/daily-details/daily-details?number=${number}`
			})
		},
		getSearchValue(v) {
			console.log('搜索', v)
			this.keywords = v
			this.$refs.paging.reload()
		},
		gotoView() {
			uni.navigateTo({
				url: '/pages/packageE/record-collection/record-collection'
			})
		},
		async queryList(page, pageNo) {
			try {
				const { data } = await getInOutinfoList({
					currentPage: page,
					pageSize: pageNo,
					search: { fuzzyParam: this.keywords, ...this.reqObj }
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

.fixed-btn {
	position: fixed;
	z-index: 1000;
	background-color: #FFAF38;
	bottom: 170rpx;
	right: 30rpx;
	width: 200rpx;
	height: 90rpx;
	border-radius: 50rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 5px 5px 20px rgba(255, 175, 56, 0.5);
}


.fixed-btn image {
	width: 140rpx;
}
</style>
