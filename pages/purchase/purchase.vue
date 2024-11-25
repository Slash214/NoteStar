<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList">
		<u-navbar
			bgColor="#F1F5F8"
			right-icon=" "
			leftIcon="account"
			:placeholder="true"
			autoBack="false"
			@leftClick="modalVisible = true"
			:use-cache="true" cache-key="PurchaseKey"
		>
			<!-- 中间内容 -->
			<view class="slot-content" slot="center" :style="{ marginRight: width + 'px' }">
				<view class="flex flex-center">
					<text
						:class="status === item.id ? 'tab-text ml15 active' : ' tab-text ml15'"
						v-for="item of statusArray"
						:key="item.id"
						@click="handleClickTab(item)"
					>
						{{ item.name }}
					</text>
				</view>
				<view class="slot-right" @click="handleClickRight">
					<u-icon name=" "></u-icon>
				</view>
			</view>
		</u-navbar>

		<nav-search-bar desc="单号/客户/商品/备注" @rightClick="rightClick" @search="getKeyWords"></nav-search-bar>

		<view class="container">
			<horizontal-card
				title="共"
				:titlePrice="total"
				subtitle="合计"
				:subtitlePrice="totalPrice"
			></horizontal-card>
			<view class="mb20"></view>
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="list" v-for="(item, index) in dataList" :key="item.id" @click="handleClick(item)">
				<view class="dataTitle" v-if="index === 0 || item.time !== dataList[index - 1].time">
					{{ item.time }}
				</view>
				<view class="dataItem flex flex-between flex-items-center">
					<view class="">
						<view class="organName flex flex-items-center">
							<text class="deleteFlag" v-if="item.deleteFlag == 1">已作废</text>
							<text>{{ item.organName }}</text>
						</view>
						<view class="number">{{ item.number }}</view>
					</view>
					<text class="price">￥{{ item.money }}</text>
				</view>
			</view>
		</view>

		<view v-if="!loading" class="fix-icon flex flex-items-center flex-center" @click="gotoSetForm">
			<image :src="staticImageUrl + '/purchase/purchase.png'" mode="widthFix"></image>
		</view>

		<template slot="empty">
			<view class="">
				<image
					style="height: 250rpx"
					mode="heightFix"
					:src="staticImageUrl + '/purchase/empty-purchase.png'"
				></image>
				<view style="text-align: center">暂无进货单，点击右下角马上开单</view>
			</view>
		</template>

		<user-popup :visible="modalVisible" @close="modalVisible = false"></user-popup>
	</z-paging>
</template>

<script>
import { getDepotHeadList } from '@/apis'
import { formatDateToChinese, formatMoney } from '@/utils'
import { staticImageUrl } from '@/common/contanst'
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import HorizontalCard from '@/components/HorizontalCard/HorizontalCard.vue'
import UserPopup from '@/components/UserPopup/UserPopup.vue'
export default {
	components: {
		NavSearchBar,
		UserPopup,
		HorizontalCard
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
			// 1 是进货  2是预订  3是退货
			status: 1,
			statusArray: [
				{
					id: 1,
					name: '进货'
				},
				{
					id: 2,
					name: '预订'
				},
				{
					id: 3,
					name: '退货'
				}
			],
			width: 0
		}
	},
	onLoad() {
		uni.removeStorageSync('selectList')
		uni.removeStorageSync('currPage')

		const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
		console.log('信息', menuButtonInfo)
		this.width = menuButtonInfo.width
	},
	onShow() {
		uni.removeStorageSync('t1screenData')
		const screenData = uni.getStorageSync('t2screenData')
		if (screenData) {
			let { startTime, endTime, arr } = screenData
			console.log('筛选结果', screenData)
			let obj = {}
			obj.beginTime = `${startTime} 00:00:00`
			obj.endTime = `${endTime} 23:59:59`
			obj.depotId = !arr[0].obj.id ? '' : arr[0].obj.id
			obj.salesMan = !arr[1].obj.id ? '' : arr[1].obj.id
			obj.creator = !arr[2].obj.id ? '' : arr[2].obj.id
			obj.deleteFlag = !arr[3].obj.id ? '0' : '1'
			this.reqObj = obj
			console.log('请求测试', this.reqObj)
			this.$refs.paging.reload()
		}
	},
	methods: {
		handleClickTab(item) {
			console.log(item)
			this.status = item.id
		},
		rightClick() {
			console.log('点击右边的')
			uni.navigateTo({
				url: `/pages/packageB/screening-page/screening-page?type=2`
			})
		},
		getKeyWords(v) {
			console.log('获取的', v)
			this.keyword = v
			this.$refs.paging.reload()
		},
		screening() {
			uni.navigateTo({
				url: `/pages/packageB/screening-page/screening-page?type=2`
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
		handleClick(item) {
			console.log(item)
			let number = item.number
			uni.navigateTo({
				url: `/pages/packageB/sales-order-detail/sales-order-detail?type=2&number=${number}`
			})
		},
		async queryList(pageNo, pageSize) {
			let obj = {}

			let statusType = {}
			if (this.status !== 1) {
				statusType = {
					type: '入库',
					subType: '采购'
				}
			} else {
				statusType = {
					type: '进货',
					subType: '预定'
				}
			}

			try {
				const { data } = await getDepotHeadList({
					apiName: 'depotHeadList',
					currentPage: pageNo,
					pageSize: pageSize,
					search: {
						type: '入库',
						subType: '采购',
						// 搜索关键词
						fuzzyQueryParam: this.keyword,
						...this.reqObj
					}
				})
				let { rows, totalPrice, total } = data || {}
				this.total = total
				this.totalPrice = totalPrice
				// console.log('data', data)
				let array = rows.map((item) => ({
					...item,
					money: formatMoney(item.totalPrice),
					time: formatDateToChinese(item.operTime)
				}))
				this.$refs.paging.complete(array)
				console.log('array', array)
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
.slot-content {
	flex: 1;
	text-align: center;
	position: relative;
	margin-left: 45px;

	.slot-right {
		position: absolute;
		top: 50%;
		right: 15px;
		transform: translateY(-50%);
	}

	.tab-text {
		font-size: 32rpx;
		color: #111;
		display: block;
	}

	.active {
		font-size: 36rpx;
		position: relative;
		font-weight: 600;

		&::after {
			content: '';
			position: absolute;
			bottom: -3rpx;
			left: 5rpx;
			width: 85%;
			height: 8rpx;
			border-radius: 40rpx;
			background: linear-gradient(to right, #5fcadd, #e5f0f6);
			border-top-left-radius: 20px;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;
			border-bottom-left-radius: 20px;
			background-image: linear-gradient(to right, rgb(95, 202, 221), rgb(229, 240, 246));
			background-position-x: initial;
			background-position-y: initial;
			background-size: initial;
			background-repeat-x: initial;
			background-repeat-y: initial;
			background-attachment: initial;
			background-origin: initial;
			background-clip: initial;
			background-color: initial;
		}
	}
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

.fix-icon {
	position: fixed;
	z-index: 9;
	background-color: #fa6400;
	bottom: 50rpx;
	right: 30rpx;
	width: 180rpx;
	height: 90rpx;
	border-radius: 50rpx;
	box-shadow: 5px 5px 20px rgba(250, 100, 0, 0.5);
	overflow: hidden;
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

			.deleteFlag {
				color: #5b6066;
				font-weight: normal;
				height: 32rpx;
				line-height: 32rpx;
				padding: 0 10rpx;
				font-size: 26rpx;
				background: #eff4f8;
				margin-right: 10rpx;
				border-radius: 8rpx;
			}
		}

		.price {
			color: #000;
			font-weight: 600;
			font-size: 34rpx;
		}
	}
}
</style>
