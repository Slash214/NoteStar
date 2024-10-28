<template>
	<web-view :src="linkUrl"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				linkUrl: ''
			}
		},
		onLoad(options) {
			this.linkUrl = options?.url || ''
		},
		methods: {

		}
	}
</script>

<style>

</style>