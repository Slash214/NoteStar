<template>
	<view>
		<AppletHeader title="新增商品" right-icon="保存" :right-icon-size="14" @rightClick="rightClick"></AppletHeader>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1
			}
		},
		onLoad(options) {
			console.log(options)
		},
		methods: {
			rightClick() {
				console.log(1)
			}
		}
	}
</script>

<style>

</style>
