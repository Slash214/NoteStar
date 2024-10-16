<template>
	<view class="fixed-bottom-button" :style="{height: height}">
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'FixedBottom',
	props: {
		height: {
			type: String,
			default: '70px'
		}
	},

	data() {
		return {}
	}
}
</script>

<style lang="scss">
.fixed-bottom-button {
	position: fixed;
	z-index: 999;
	left: 0;
	right: 0;
	bottom: 0;
	height: 50px;
	background-color: #ffffff;
	box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
</style>
