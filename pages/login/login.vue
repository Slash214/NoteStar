<template>
	<view>
		<button @click="jump">跳转</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			jump() {
				uni.switchTab({
					url: '/pages/overview/overview',
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
