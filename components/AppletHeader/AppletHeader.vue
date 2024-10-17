<template>
	<u-navbar bgColor="#F1F5F8" :placeholder="true">
		<!-- 左边icon -->
		<view class="slot-left" slot="left">
			<u-icon @click="handleClickLeft" :bold="leftIconBold" :name="leftIcon" size="20"></u-icon>
		</view>
		<!-- 中间内容 -->
		<view class="slot-content" slot="center" :style="{ marginRight: width + 'px'}">
			<text class="title">{{title}}</text>
			<view class="slot-left" slot="right"></view>
		</view>
	</u-navbar>
</template>

<script>
	export default {
		name: "AppletHeader",
		props: {
			title: {
				type: String,
				default: '默认标题'
			},
			leftIcon: {
				type: String,
				default: 'arrow-left'
			},
			rightIcon: {
				type: String,
				default: 'plus'
			},
			rightIconBold: {
				type: Boolean,
				default: true
			},
			leftIconBold: {
				type: Boolean,
				default: true
			},
			isLeftClick: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				width: 0
			};
		},
		created() {
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			console.log('信息', menuButtonInfo)
			this.width = menuButtonInfo.width
		},
		methods: {
			handleClickLeft() {
				if (this.isLeftClick) {
					this.$emit('click')
				} else {
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss">
	.slot-content {
		flex: 1;
		text-align: center;

		.title {
			font-size: 36rpx;
			font-weight: 600;
			position: relative;
			color: #111;

			&::after {
				content: '';
				position: absolute;
				bottom: -3rpx;
				left: 5rpx;
				width: 85%;
				height: 8rpx;
				border-radius: 40rpx;
				background: linear-gradient(to right, #5FCADD, #E5F0F6);
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
</style>