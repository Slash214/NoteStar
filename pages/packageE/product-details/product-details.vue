<template>
	<view>
		<AppletHeader title="商品销售详细" right-icon=" "></AppletHeader>
		<view class="container">
			<view class="box">
				<view class="top flex u-border-bottom">
					<view class="image-box">
						<image mode="aspectFill" :src="curItem.imgName"></image>
					</view>
					<u--text :text="curItem.materialName" bold size="16"></u--text>
				</view>

				<view class="middle">
					<view class="unit">
						<view class="">
							<text class="label">商品销售额:</text>
							<text class="value">{{ curItem.salesPrice }}</text>
						</view>
						<view class="">
							<text class="label">销售成本:</text>
							<text class="value">{{ curItem.salespurchasePrice }}</text>
						</view>
					</view>
					<view class="unit">
						<view class="">
							<text class="label">销售毛利:</text>
							<text class="value">{{ curItem.salesGrossProfit }}</text>
						</view>
						<view class="">
							<text class="label">毛利率:</text>
							<text class="value">{{ curItem.salesGrossProfitMargin }}%</text>
						</view>
					</view>
					<view class="unit">
						<view class="">
							<text class="label">销量:</text>
							<text class="value">{{ curItem.salesCount }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="select">
				<view class="" @click="visible = true">
					<text>{{ curShop.name }}</text>
					<u-icon name="arrow-down-fill" size="8"></u-icon>
				</view>
				<view class="" @click="show = true">
					<text>{{ curTime.name }}</text>
					<u-icon name="arrow-down-fill" size="8"></u-icon>
				</view>
			</view>

			<select-shop :show="visible" @cancel="visible = false" @confirm="shopComfirm"></select-shop>

			<u-divider text="没有更多了" v-if="!productList.length"></u-divider>
			<view class="product" v-for="item in productList" :key="item.number">
				<u--text :text="formatDateToChinese(item.operTime)" margin="0 0 10px 10px" color="#737373"></u--text>
				<view class="product-item">
					<u--text :text="item.customerName" bold></u--text>
					<view class="flex flex-between flex-items-center numbers u-border-bottom">
						<view>{{ item.number }}</view>
						<view @click="lookDetails(item)" class="flex flex-items-center">
							<text style="padding-bottom: 2px">详情</text>
							<u-icon name="arrow-right" size="14"></u-icon>
						</view>
					</view>
					<view class="num">
						<view class="unit">
							<view class="">
								<text class="label">商品销售额:</text>
								<text class="value">{{ item.salesPrice }}</text>
							</view>
							<view class="">
								<text class="label">销售成本:</text>
								<text class="value">{{ item.salespurchasePrice }}</text>
							</view>
						</view>
						<view class="unit">
							<view class="">
								<text class="label">销售毛利:</text>
								<text class="value">{{ item.salesGrossProfit }}</text>
							</view>
							<view class="">
								<text class="label">毛利率:</text>
								<text class="value">{{ item.salesGrossProfitMargin * 100 }}%</text>
							</view>
						</view>
						<view class="unit">
							<view class="">
								<text class="label">销量:</text>
								<text class="value">{{ item.salesCount }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-popup :show="show" @close="show = false">
			<view class="popup">
				<time-filter-box @changeTime="changeTime"></time-filter-box>
				<view class="flex">
					<u-button type="info" text="取消" @click="show = false"></u-button>
					<view class="ml10 mr10"></view>
					<u-button type="primary" text="确定" @click="selectTime"></u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { getMaterialSalesDetails } from '@/apis'
import { formatDateToChinese } from '@/utils'
import SelectShop from '@/components/SelectShop/SelectShop.vue'
import TimeFilterBox from '@/components/TimeFilterBox/TimeFilterBox.vue'
export default {
	components: {
		SelectShop,
		TimeFilterBox
	},
	data() {
		return {
			curItem: {},
			visible: false,
			show: false,
			formatDateToChinese,
			productList: [],
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
	onLoad(options) {
		let { obj } = options
		if (obj) {
			this.curItem = JSON.parse(obj)
			console.log(this.curItem)
			this.getData()
		}
	},
	methods: {
		selectTime() {
			console.log('选择了', this.cacheTime)
			let e = this.cacheTime
			this.curTime = {
				name: `${e.name}${e.endTime}`,
				start: e.startTime,
				end: e.endTime
			}
			this.show = false
			this.getData()
		},
		changeTime(e) {
			console.log('时间', e)
			this.cacheTime = e
			if (e.first) {
				this.curTime = {
					name: `${e.name}${e.endTime}`,
					start: e.startTime,
					end: e.endTime
				}
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
		},
		shopComfirm(e) {
			console.log('选择的门店', e)
			this.curShop = e
			this.visible = !this.visible
			this.getData()
		},
		lookDetails(item) {
			console.log('销售单详情', item)
			uni.navigateTo({
				url: `/pages/packageB/sales-order-detail/sales-order-detail?number=${item.number}&type=1`
			})
		},
		async getData() {
			let { s, e } = this.fmatDat()

			const { data } = await getMaterialSalesDetails({
				currentPage: 1,
				pageSize: 10,
				beginTime: this.curTime.start || s,
				endTime: this.curTime.end || e,
				depotId: this.curShop.id || '',
				materialId: this.curItem.materialId
			})

			console.log(this.curTime)
			this.productList = data.rows
			console.log(data)
		},
		toTwoDecimalPlaces(num) {
			return Math.round(num * 100) / 100
		}
	}
}
</script>

<style scoped lang="scss">
.popup {
	width: 100%;
	padding: 20px;
	.cancel {
	}
	.comfirm {
	}
}

.container {
	.select {
		width: 100%;
		height: 41px;
		display: flex;
		margin: 20px auto 10px auto;
		view {
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.box {
		width: 100%;
		padding: 30rpx;
		border-radius: 20rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;

		.top {
			padding-bottom: 10px;
			align-items: flex-start;
			.image-box {
				background-color: #cdd7dc;
				width: 120rpx;
				height: 120rpx;
				border-radius: 10rpx;
				overflow: hidden;
				margin-right: 15px;
				image {
					display: block;
				}
			}
		}

		.middle {
			padding-top: 10px;
			.unit {
				display: flex;
				margin-bottom: 17rpx;
				view {
					width: 50%;
					display: flex;
					width: 320rpx;
					font-weight: 500;
					font-size: 30rpx;
					.label {
						color: #737373;
						min-width: 170rpx;
					}
					.value {
						font-weight: 500;
						color: #141414;
					}
				}
			}
		}
	}

	.product {
		&-item {
			width: 100%;
			margin-bottom: 20rpx;
			padding: 30rpx;
			border-radius: 20rpx;
			background-color: #fff;
			.numbers {
				padding: 10px 0;
				color: #737373;
			}

			.num {
				padding-top: 10px;
				.unit {
					display: flex;
					margin-bottom: 10rpx;
					view {
						width: 50%;
						display: flex;
						width: 320rpx;
						font-weight: 500;
						font-size: 28rpx;
						.label {
							color: #737373;
							min-width: 170rpx;
						}
						.value {
							font-weight: 500;
							color: #141414;
						}
					}
				}
			}
		}
	}
}
</style>
