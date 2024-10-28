<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" auto-show-back-to-top :loading-more-enabled="type === 1">
		<template slot="top">
			<AppletHeader @rightClick="rightClick" :title="objItem[type].title"></AppletHeader>
		</template>

		<view class="container">
			<view class="list" v-for="(item,index) in dataList" :key="item.id">
               <u--text bold size="16" margin="0 0 10px 0" :text="item.title"></u--text>
               <view class="flex flex-between flex-items-center">
               	<u--text :text="item.subtitle"></u--text>
				<view class="">
					<u-icon name="more-dot-fill"></u-icon>
				</view>
               </view>
			</view>
		</view>
	</z-paging>
</template>

<script>
	import {
		getDepotList,
		getUserByDepotId
	} from '@/apis'
	export default {
		data() {
			return {
				// 1店铺  2员工
				type: 1,
				objItem: {
					1: {
						title: '门店管理'
					},
					2: {
						title: '员工管理'
					}
				},
				dataList: [],
				total: 0,
			};
		},
		onLoad(options) {
			console.log(options)
			this.type = +options?.type || 1
			console.error('dq1', this.type)
		},
		methods: {
			rightClick() {
				uni.navigateTo({
					url: `/pages/packageA/add-store-info/add-store-info?type=${this.type}`
				})
			},
			formatData(data) {
				let array = []
				
				if (this.type === 1) {
					array = data.map(item => ({
						...item,
						title: item.name,
						subtitle: item.location
					}))
				} else {
					array = data.map(item => ({
						...item,
						title: item.roleName,
						subtitle: item.userName
					}))
				}
				
				return array
			},
			async queryList(pageNo, pageSize) {
				try {
					const fn = this.type === 1 ? getDepotList : getUserByDepotId
					
				
					let params = {
						currentPage: pageNo,
						pageSize,
					}
					if (this.type === 2) {
						params['depotId'] = 0
					}
					const {
						data
					} = await fn(params)
					
					
					console.error('data', data)
					if (this.type === 1) {
						let {
							rows,
							total
						} = data || {}
						this.total = total
						this.$refs.paging.complete(this.formatData(rows))
					} else {
						this.total = data.length
						this.$refs.paging.complete(this.formatData(data))
					}
					
					
					this.loading = false
				} catch (e) {
					console.log('请求失败', e)
					this.$refs.paging.complete(false)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		margin-bottom: 17rpx;
		padding: 25rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}
</style>