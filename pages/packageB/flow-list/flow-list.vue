<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" auto-show-back-to-top>
		<AppletHeader :title="title" right-icon=" "></AppletHeader>
		<view class="container">
			<view class="list flex flex-between flex-items-center" v-for="item in dataList" :key="item.id"
				@click="gotoDetails(item)">
				<view class="box">
					<view class="title">{{ item.flag === 0 ? item.supplierName : item.type }}</view>
					<view>{{ item.type }}</view>
				</view>
				<view class="num">
					{{formatMoney(item.money)}}
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script>
	import {
		getCapitalFlowDetail
	} from '@/apis'
	import {
		formatMoney
	} from '@/utils'
	export default {
		data() {
			return {
				title: '流水',
				list: [],
				depotId: 0,
				time: '',
				dataList: [],
				total: 0,
				formatMoney
			}
		},
		onLoad(options) {
			console.log(options)
			this.time = options.time
			this.depotId = options.id || 0
			this.title = `${this.time}流水`
		},
		methods: {
			async queryList(pageNo, pageSize) {
				try {
					const {
						data
					} = await getCapitalFlowDetail({
						depotId: this.depotId || '',
						time: this.time,
						currentPage: pageNo,
						pageSize

					})

					console.log('data', data)
					this.total = data.total
					this.$refs.paging.complete(data.data)
					this.loading = false
				} catch (e) {
					console.log('请求失败', e)
					this.$refs.paging.complete(false)
				}
			},
			gotoDetails(item) {
				console.log(item)
				let obj = JSON.stringify(item)
				uni.navigateTo({
					url: `/pages/packageB/flow-list-details/flow-list-details?obj=${obj}`
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		.list {
			width: 100%;
			margin-bottom: 17rpx;
			padding: 25rpx;
			border-radius: 20rpx;
			background-color: #fff;

			.box {
				margin-right: 28rpx;
			}

			.title {
				font-weight: 500;
				font-size: 32rpx;
				margin-bottom: 5px;
			}

			.num {
				font-weight: 600;
				font-size: 32rpx;
				flex: 1;
				text-align: right;
			}
		}
	}
</style>