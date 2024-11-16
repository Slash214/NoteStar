<template>
	<view>
		<AppletHeader :autoBack="false" @leftClick="rightClick" title="开单成功" right-icon="完成" @rightClick="rightClick" right-icon-size="14"></AppletHeader>
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
					<u--text mode="price" text="3600"></u--text>
				</view>
				<view :class="type === 1 ? 'xs btns' : 'jh btns'" @click="handleClick">再来一单</view>
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
			orderNumber: ""
		}
	},
	onLoad(options) {
		console.log(options)
		this.type = +options?.type || 1
		this.orderNumber = options.orderNum
	},
	methods: {
		handleClick() {
			console.log('再来一单')
			uni.redirectTo({
				url: `/pages/packageB/set-form/set-form?type=${this.type}`
			})
		},
		lookDetails() {
			console.log('查看详情')
		},
		rightClick() {
			console.log('完成')
			
			let url = this.type === 1 ? '/pages/sales/sales' : '/pages/purchase/purchase'
			uni.switchTab({
				url
			})
		}
	}
}
</script>

<style scoped lang="scss">
.flex {
	display: flex;
	align-items: center;
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
		width: 156px;
		margin: 30rpx auto auto auto;
	}

	.xs {
		background: linear-gradient(to right, #5fcadd, #6adae8);
	}

	.jh {
		background: linear-gradient(to right, #fa6400, #f79151);
	}
}
</style>
