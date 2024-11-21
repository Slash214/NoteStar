<template>
	<view class="flex flex-items-center horizontal-card">
		<view class="flex flex-items-center">
			<text>{{ title }}:</text>
			<text >￥{{formatMoney(titlePrice)}}</text>
		</view>
		<view class="line"></view>
		<view class="flex flex-items-center">
			<text>{{ subtitle }}:</text>
			<text>￥{{formatMoney(subtitlePrice)}}</text>
		</view>
	</view>
</template>

<script>
import { formatMoney } from '@/utils'	
export default {
	name: 'HorizontalCard',
	props: {
		title: {
			type: String,
			default: ''
		},
		titlePrice: {
			type: Number,
			default: 0
		},
		subtitle: {
			type: String,
			default: ''
		},
		subtitlePrice: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			formatMoney
		}
	}
}
</script>

<style scoped lang="scss">
.horizontal-card {
	width: 100%;
	height: 75rpx;
	margin-bottom: 17rpx;
	background-color: #fafbfd;
	border-radius: 10rpx;
	padding: 0 30rpx;
	color: #9d9ea0;
	.line {
		width: 1rpx;
		height: 30rpx;
		background-color: #ccc;
		margin: 0 15rpx;
	}
}
</style>
