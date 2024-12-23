<template>
	<view>
		<AppletHeader :autoBack="false" @leftClick="rightClick" title="开单成功" right-icon="完成" @rightClick="rightClick"
			:right-icon-size="16"></AppletHeader>
		<view class="container">
			<view class="box">
				<view class="top">
					<u--text bold :text="type === 1 ? '销售单' : '进货单'"></u--text>
					<u--text @click="lookDetails" text="查看详情" color="" align="right"></u--text>
				</view>
				<view class="flex middle">
					<u-icon size="24" color="#FA6400" name="account-fill"></u-icon>
					<text>零散供应商</text>
				</view>
				<view class="flex">
					<text>合计金额：</text>
					<u--text mode="price" :text="total"></u--text>
				</view>

				<view class="group-button">
					<view :class="type === 1 ? 'xs-b btns' : 'jh-b btns'" v-if="statusType > 1" @click="handleClickDep">
						{{ type === 1 ? '转销售' : '转进货'}}
					</view>
					<view :class="type === 1 ? 'xs btns' : 'jh btns'" @click="handleClick">再来一单</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 1 销售单  2 进货单
				type: 1,
				orderNumber: "",
				total: 0,
				statusType: 1
			}
		},
		onLoad(options) {
			console.log(options)
			this.type = +options?.type || 1
			this.orderNumber = options.orderNum
			this.total = options.total || 0
			this.statusType = +options.status || 1
		},
		methods: {
			handleClick() {
				console.log('再来一单')
				uni.navigateTo({
					url: `/pages/packageB/set-form/set-form?type=${this.type}`
				})
			},
			lookDetails() {
				console.log('查看详情')
				uni.navigateTo({
					url: `/pages/packageB/sales-order-detail/sales-order-detail?type=${this.type}&number=${this.orderNumber}&status=${this.statusType}`
				})
			},
			rightClick() {
				console.log('完成')

				let url = this.type === 1 ? '/pages/sales/sales' : '/pages/purchase/purchase'
				uni.switchTab({
					url
				})
			},
			handleClickDep() {
				console.log('转进货')
				uni.showToast({
					title: '接口对接中',
					icon: 'none'
				})
				// uni.navigateTo({
				// 	url: ''
				// })
			},
		}
	}
</script>

<style scoped lang="scss">
	.flex {
		display: flex;
		align-items: center;
	}

	.group-button {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.box {
		border-radius: 20rpx;
		background: #fff;
		padding: 25rpx;
		margin-bottom: 60rpx;
		font-size: 32rpx;

		.top {
			align-items: center;
			display: flex;
		}

		.middle {
			margin: 30rpx 0;
		}

		.btns {
			height: 90rpx;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-weight: 700;
			width: 280rpx;
			margin: 30rpx auto auto auto;
		}

		.xs {
			background: linear-gradient(to right, #5fcadd, #6adae8);
		}

		.jh {
			background: linear-gradient(to right, #fa6400, #f79151);
		}
		
		.xs-b {
			background-color: #fff;
			color: #5fcadd;
			border: 1rpx solid #5fcadd;
		}
		
		.jh-b {
			background-color: #fff;
			color: #fa6400;
			border: 1rpx solid #fa6400;
		}
	}
</style>