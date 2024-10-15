<template>
	<view class="tag-count" v-if="text && desc">
		<view class="">{{ text }}</view>
		<view class="line"></view>
		<view class="">{{ desc }}</view>
	</view>
</template>

<script>
export default {
	name: 'TagCountText',
	props: {
		text: {
			type: String,
			default: ''
		},
		desc: {
			type: String,
			default: ''
		}
	},
	data() {
		return {}
	}
}
</script>

<style scoped lang="scss">
.tag-count {
	width: 100%;
	padding: 0 30rpx;
	height: 75rpx;
	color: #9d9ea0;
	display: flex;
	align-items: center;
	background-color: #fafbfd;
	border-radius: 10rpx;
	.line {
		width: 1rpx;
		height: 30rpx;
		background-color: #ccc;
		margin: 0 15rpx;
	}
}
</style>
