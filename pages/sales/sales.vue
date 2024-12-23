<template>
	<z-paging :use-cache="true" cache-key="SalesKey" ref="paging" v-model="dataList" @query="queryList"
		auto-show-back-to-top>
		<template slot="top">
			<!-- <AppletHeader :autoBack="false" @leftClick="modalVisible = true" title="销售" left-icon="account"
				right-icon=" " :left-icon-size="24"></AppletHeader> -->

			<u-navbar bgColor="#F1F5F8" right-icon=" " :left-icon-size="24" leftIcon="account" :placeholder="true"
				autoBack="false" @leftClick="modalVisible = true" :use-cache="true" cache-key="PurchaseKey">
				<!-- 中间内容 -->
				<view class="slot-content" slot="center" :style="{ marginRight: width + 'px' }">
					<view class="flex flex-center">
						<text :class="status === item.id ? 'tab-text ml15 active' : ' tab-text ml15'"
							v-for="item of statusArray" :key="item.id" @click="handleClickTab(item)">
							{{ item.name }}
						</text>
					</view>
					<view class="slot-right" @click="handleClickRight">
						<u-icon name=" "></u-icon>
					</view>
				</view>
			</u-navbar>

			<nav-search-bar @rightClick="rightClick" @search="getKeyWords" desc="单号/客户/商品/备注"></nav-search-bar>
		</template>

		<view class="container">
			<horizontal-card title="共" :titlePrice="total" subtitle="合计" :subtitlePrice="totalPrice"></horizontal-card>

			<view class="mb20"></view>
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="list" v-for="(item, index) in dataList" :key="item.id" @click="handleClick(item)">
				<view class="dataTitle" v-if="index === 0 || item.time !== dataList[index - 1].time">
					{{ item.time }}
				</view>
				<view class="dataItem flex flex-between">
					<view class="">
						<view class="organName flex flex-items-center">
							<text class="deleteFlag" v-if="item.deleteFlag == 1">已作废</text>
							<text>{{ item.organName }}</text>
						</view>
						<view class="number">{{ item.number }}</view>
					</view>

					<view class="info">
						<view class="money">
							￥{{ formatMoney(item.totalPrice) }}
						</view>
						<view class="name">
							{{saleStatusName[item.saleStatus] || ""}}
						</view>
					</view>
					
				</view>
			</view>

		</view>

		<template slot="right">
			<view v-if="!loading" @click="gotoSetForm" class="fix-icon flex flex-items-center flex-center">
				<image src="https://haoxianhui.com/hxh/2024/12/23/33b839bf56da4b90b5f711722566b399.png" mode="widthFix">
				</image>
				<text class="text">{{statusArray[status - 1].name}}</text>
			</view>
		</template>

		<template slot="empty">
			<view class="">
				<image style="height: 250rpx" mode="heightFix"
					src="https://haoxianhui.com/hxh/2024/11/19/5005a4c6600b40208b1cbea5ca7d7412.png"></image>
				<view style="text-align: center">暂无销售单，点击右下角马上开单</view>
			</view>
		</template>

		<user-popup :visible="modalVisible" @close="modalVisible = false"></user-popup>
	</z-paging>
</template>

<script>
	import {
		getDepotHeadList
	} from '@/apis'
	import {
		formatDateToChinese,
		timestampToDate,
		formatMoney
	} from '@/utils'
	import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
	import {
		staticImageUrl,
		IMAGE_OSS_URL
	} from '@/common/contanst'
	import UserPopup from '@/components/UserPopup/UserPopup.vue'
	import HorizontalCard from '@/components/HorizontalCard/HorizontalCard.vue'

	export default {
		components: {
			HorizontalCard,
			NavSearchBar,
			UserPopup
		},
		data() {
			return {
				formatMoney,
				modalVisible: false,
				staticImageUrl,
				IMAGE_OSS_URL,
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
				},
				saleStatusName: {
					0: '未转销售',
					1: '部分转销售',
					2: '已完成',
					3: '已关闭',
				},
				status: 1,
				width: 0,
				statusArray: [{

						id: 1,
						name: '销售'
					},
					{
						id: 2,
						name: '预订'
					},
					{
						id: 3,
						name: '退货'
					},
				]
			}
		},
		onLoad() {
			this.reqObj.beginTime = timestampToDate(Date.now())


			uni.removeStorageSync('selectList')
			uni.removeStorageSync('currPage')

			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			console.log('信息', menuButtonInfo)
			this.width = menuButtonInfo.width
		},
		onShow() {
			uni.removeStorageSync('t2screenData')

			const screenData = uni.getStorageSync('t1screenData')
			if (screenData) {
				let {
					startTime,
					endTime,
					arr
				} = screenData
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

			uni.removeStorageSync('selectList')
			uni.removeStorageSync('currPage')
			uni.removeStorageSync('goodsInfo')
			uni.removeStorageSync('goodsUpdate')
			uni.removeStorageSync('transferOrderList')
		},
		methods: {
			handleClickTab(item) {
				console.log(item)
				this.status = item.id

				this.$refs.paging.reload()
			},
			rightClick() {
				console.log('点击右边的')
				uni.navigateTo({
					url: `/pages/packageB/screening-page/screening-page?type=1`
				})
			},
			handleClick(item) {
				uni.navigateTo({
					url: `/pages/packageB/sales-order-detail/sales-order-detail?number=${item.number}&type=1&status=${this.status}&id=${this.status === 2 ? item.id : ''}`
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
					url: `/pages/packageB/set-form/set-form?type=1&status=${this.status}`
				})
			},
			async queryList(pageNo, pageSize) {
				try {

					const statusType = {
						1: {
							type: '出库',
							subType: '零售'
						},
						2: {
							type: '出库',
							subType: '销售预订'
						},
						3: {
							type: '出库',
							subType: '退货'
						},
					}

					let typeObj = statusType[this.status]

					const {
						data
					} = await getDepotHeadList({
						apiName: 'depotHeadList',
						currentPage: pageNo,
						pageSize: pageSize,
						search: {
							...typeObj,
							fuzzyQueryParam: this.keyword,
							...this.reqObj
						}
					})
					let {
						rows,
						totalPrice,
						total
					} = data || {}
					this.total = total
					this.totalPrice = totalPrice
					console.log('data', data)
					let array = rows.map((item) => ({
						...item,
						time: formatDateToChinese(item.operTime)
					}))
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
		background-color: #00c9dd;
		bottom: 50rpx;
		right: 30rpx;
		width: 180rpx;
		height: 90rpx;
		border-radius: 50rpx;
		box-shadow: 5px 5px 20px rgba(0, 201, 221, 0.5);
		overflow: hidden;

		.text {
			font-size: 32rpx;
			padding-left: 10rpx;
			color: #fff;
			font-weight: 500;
		}

		image {
			width: 40rpx;
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

			.info {
				.money {
					font-weight: 700;
					color: #111;
					font-size: 34rpx;
				}

				.name {
					color: #f3660c;
					text-align: center;
					margin-top: 16rpx;
				}
			}

			.organName {
				color: #000;
				font-weight: 600;
				font-size: 32rpx;
				margin-bottom: 25rpx;

				.deleteFlag {
					color: #5B6066;
					font-weight: normal;
					height: 32rpx;
					line-height: 32rpx;
					padding: 0 10rpx;
					font-size: 26rpx;
					background: #EFF4F8;
					margin-right: 10rpx;
					border-radius: 8rpx;
				}
			}

			.price {
				color: #000;
				font-weight: 600;
				font-size: 32rpx;
			}
		}
	}
</style>