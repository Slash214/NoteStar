<template>
	<view class="login flex-column flex-between flex-items-center">
		<view class="login-header flex-column flex-items-center">
			<text>好闲惠</text>
			<text>引领新零售时代</text>
		</view>
		
		<view class="login-box">
			21122112
		</view>
		
		<view class="login-footer">
			<view class="">
				我已经阅读并同意<text><<用户协议>><text/>和<text><<隐私政策>></text>
			</view>
			<u--text text="好闲惠掌柜宝"></u--text>
			<u--text text="门店加盟：400-690-8890"></u--text>
		</view>

	</view>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		jump() {
			uni.switchTab({
				url: '/pages/overview/overview'
			})
		}
	}
}
</script>

<style lang="scss">
.login {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: linear-gradient(to bottom right, #77d7c3, #3a92da);
	&-header {
		margin-top: 300rpx;
		font-size: 56rpx;
		color: #fff;
		font-weight: 400;
		letter-spacing: 2px;
		line-height: 1.5;
	}
}
</style>
