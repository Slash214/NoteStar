<template>
	<view>
		<AppletHeader title="日常收支"></AppletHeader>
		<nav-search-bar desc="单号/备注"></nav-search-bar>
	</view>
</template>

<script>
	import { getInOutinfoList } from '@/apis'
	import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue';
	
	export default {
		components: {
			NavSearchBar
		},
		data() {
			return {
				
			};
		},
		onLoad() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>

</style>
