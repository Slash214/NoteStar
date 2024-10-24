<template>
	<u-navbar bgColor="#F1F5F8" :leftIcon="leftIcon" :placeholder="true" :autoBack="autoBack" @leftClick="leftClick">
		<!-- 中间内容 -->
		<view class="slot-content" slot="center" :style="{ marginRight: width + 'px' }">
			<text class="title">{{ title }}</text>
			<view class="slot-right" v-if="rightIcon" @click="handleClickRight">
				<u-icon size="18" :name="rightIcon"></u-icon>
			</view>
		</view>
	</u-navbar>
</template>

<script>
export default {
	name: 'AppletHeader',
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
		autoBack: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			width: 0
		}
	},
	created() {
		const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
		console.log('信息', menuButtonInfo)
		this.width = menuButtonInfo.width
	},
	methods: {
		leftClick() {
			if (this.autoBack) {
				console.log('返回上一级')
			} else {
				console.log('传递点击事件')
				this.$emit('leftClick')
			}
		},
		// handleClickLeft() {
		// 	console.log('水水水', this.isLeftClick)

		// 	if (this.isLeftClick) {
		// 		this.$emit('click')
		// 	} else {
		// 		console.error('返回')
		// 		uni.navigateBack()
		// 	}
		// },
		handleClickRight() {
			this.$emit('rightClick')
		}
	}
}
</script>

<style lang="scss">
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
</style>
