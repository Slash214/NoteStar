<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>
		<template slot="top">
			<slot name="top"></slot>
		</template>
		<slot name="content" :dataList="dataList">
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
		</slot>
	</z-paging>

</template>

<script>
	export default {
		name: "CustomView",
		data() {
			return {
				dataList: [],
				loading: true
			};
		},
		props: {
			getData: {
				type: Function,
				default: () => Promise.resolve({
					data: []
				})
			},
			params: {
				type: Object,
				default: () => ({})
			},
			transformData: {
				type: Function,
				default: (data) => data, // 默认不做任何处理
			},
		},
		methods: {
			reload() {
				this.$refs.paging && this.$refs.paging.reload();
			},
			async queryList(page, pageNo) {
				this.loading = true
				try {
					const {
						data
					} = await this.getData({
						currentPage: page,
						pageSize: pageNo,
						...this.params
					})
					const processedData = this.transformData(data);
					this.$refs.paging.complete(processedData)
					this.loading = false
				} catch (e) {
					console.log('请求失败', e)
					this.$refs.paging.complete(false)
				}
			}
		},
	}
</script>

<style lang="scss">

</style>