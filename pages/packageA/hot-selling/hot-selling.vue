<template>
	<z-paging
		:refresher-enabled="false"
		ref="paging"
		v-model="dataList"
		:default-page-size="20"
		@query="queryList"
		auto-show-back-to-top
	>
		<template slot="top">
			<AppletHeader title="商品热销" right-icon=" "></AppletHeader>
		</template>
		<view class="main">
			<view class="select">
				<view class="flex" @click="show = true">
					{{ curShop.name }}

					<u-icon name="arrow-down-fill" size="8"></u-icon>
				</view>
				<view class="flex" @click="timeShow = true">
					{{ curTime.name }}

					<u-icon name="arrow-down-fill" size="8"></u-icon>
				</view>
			</view>
			<view class="nav flex flex-between flex-items-center">
				<text>商品</text>
				<text>销售数量</text>
			</view>
			<view class="box">
				<view class="box-item flex flex-items-center" v-for="(item, index) of dataList" :key="item.mId">
					<text class="index">{{ index + 1 }}</text>
					<view class="content">
						<view class="image-box">
							<u--image :showLoading="true" :src="item.imgName" width="40px" height="40px"></u--image>
						</view>
						<view class="name">
							{{ item.materialName }}
						</view>
					</view>
					<view class="right">
						{{ item.sum }}
					</view>
				</view>
			</view>
		</view>

		<select-shop :show="show" @cancel="show = false" @confirm="confirm"></select-shop>

		<u-popup :show="timeShow" @close="timeShow = false">
			<view class="popup">
				<time-filter-box @changeTime="changeTime"></time-filter-box>
				<view class="flex">
					<u-button type="info" text="取消" @click="timeShow = false"></u-button>
					<view class="ml10 mr10"></view>
					<u-button type="primary" text="确定" @click="selectTime"></u-button>
				</view>
			</view>
		</u-popup>
	</z-paging>
</template>

<script>
import { getHotSellingGoods } from '@/apis'
import { timestampToDate } from '@/utils'
import SelectShop from '@/components/SelectShop/SelectShop.vue'
import TimeFilterBox from '@/components/TimeFilterBox/TimeFilterBox.vue'
export default {
	components: {
		SelectShop,
		TimeFilterBox
	},
	data() {
		return {
			dataList: [],
			show: false,
			timeShow: false,
			curShop: {
				name: '全部门店',
				id: 0
			},
			curTime: {
				name: '本月',
				tamp: '',
				start: '',
				end: ''
			},
			cacheTime: {}
		}
	},
	onLoad() {},
	methods: {
		changeTime(e) {
			console.log('选择时间', e)
			this.cacheTime = e
			if (e.first) {
				this.curTime = {
					name: `${e.name}${e.endTime}`,
					start: e.startTime,
					end: e.endTime
				}
			}
		},
		selectTime() {
			console.log('选择了', this.cacheTime)
			let e = this.cacheTime
			this.curTime = {
				name: `${e.name}${e.endTime}`,
				start: e.startTime,
				end: e.endTime
			}
			this.timeShow = false
			this.$refs.paging.reload()
		},
		confirm(e) {
			console.log(e)
			this.show = false
			this.curShop = e
			this.$refs.paging.reload()
		},
		async queryList(pageNo, pageSize) {
			let { s, e } = this.fmatDat()
			try {
				const { data } = await getHotSellingGoods({
					currentPage: pageNo,
					pageSize,
					beginTime: this.curTime.start || s,
					endTime: this.curTime.end || e,
					depotId: this.curShop.id || ''
				})
				let { hotSellingGoods } = data || {}
				console.log('data', hotSellingGoods)
				this.$refs.paging.complete(hotSellingGoods)
				// this.loading = false
			} catch (e) {
				console.log('请求失败', e)
				this.$refs.paging.complete(false)
			}
		},
		fmatDat() {
			const today = new Date()
			const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

			// 格式化日期为 YYYY-MM-DD
			const formatDate = (date) => {
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				return `${year}-${month}-${day}`
			}
			let s = formatDate(firstDay)
			let e = formatDate(today)

			return { s, e }
		}
	}
}
</script>

<style lang="scss" scoped>
.popup {
	width: 100%;
	padding: 20px;
}

.main {
	background-color: #fff;
}
.select {
	box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
	border-top-left-radius: 40rpx;
	border-top-right-radius: 40rpx;
	background: #fff;
	height: 100rpx;
	display: flex;
	color: #606266;
	font-size: 28rpx;
	align-items: center;
	justify-content: space-around;
	padding: 20rpx;
}
.nav {
	width: 100%;
	background: #eef3fe;
	color: #444648;
	padding: 15rpx 50rpx 15rpx 60rpx;
}
.box {
	&-item {
		height: 120rpx;
		padding: 0 15rpx 0 30rpx;
		font-weight: 500;
		&:nth-child(2n) {
			background-color: #f7f9fe;
		}
		&:nth-child(1) {
			.index {
				color: #d75546;
			}
		}
		&:nth-child(2) {
			.index {
				color: #f0822d;
			}
		}
		&:nth-child(3) {
			.index {
				color: #e5b840;
			}
		}
		.index {
			font-weight: 600;
			font-size: 32rpx;
			color: #9d9ea0;
		}
		.content {
			flex: 1;
			margin: 0 15px;
			display: flex;
			align-items: center;
			.image-box {
				background-color: #cdd7dc;
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
				margin-right: 15rpx;
			}
		}
		.right {
			width: 30px;
			text-align: justify;
		}
	}
}
</style>
