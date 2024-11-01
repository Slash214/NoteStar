<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>


		<template slot="top">
			<AppletHeader title="资金流水" right-icon=" "></AppletHeader>
		</template>

		<view class="main">
			<view class="nav flex flex-between">
				<view class="">
					<u--text margin="0 0 0 5px" size="12" text="收入"></u--text>
					<u--text margin="5px 0" bold size="20" mode="price" text="78000"></u--text>
					<u--text margin="0 0 0 5px" size="12" text="共15笔记"></u--text>
				</view>

				<view class="">
					<u--text margin="0 0 0 5px" size="12" text="支出"></u--text>
					<u--text margin="5px 0" bold size="20" mode="price" text="178000"></u--text>
					<u--text margin="0 0 0 5px" size="12" text="共15笔记"></u--text>
				</view>
			</view>
		</view>

		<view class="container">
			<view class="list" v-for="(item, index) in dataList" :key="index">
				<text class="time">{{formatDateToChinese(item.operTime)}}</text>
				<view class="flex content">
					<text>收入{{item.totalInCount}}笔</text>
					<text>￥{{formatMoney(item.totalInPrice)}}</text>
					<text>支出{{item.totalOutCount}}笔</text>
					<text>￥{{formatMoney(item.totalOutPrice)}}</text>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script>
	import {
		timestampToDate,
		formatDateToChinese,
		formatMoney
	} from '@/utils'
	import {
		getCapitalFlow
	} from '@/apis'
	export default {
		data() {
			return {
				formatDateToChinese,
				formatMoney,
				dataList: [],
				beginTime: "",
				endTime: "",
				timeType: 0,
				depotId: "",
				reqObj: {
					accountId: '',
					salesMan: '',
				},
				loading: true
			}
		},
		onLoad() {
			this.beginTime = timestampToDate(Date.now())
			this.endTime = this.beginTime
		},
		methods: {
			async queryList(page, pageNo) {
				try {
					const {
						data
					} = await getCapitalFlow({
						currentPage: page,
						pageSize: pageNo,
						beginTime: this.beginTime,
						endTime: this.endTime,
						timeType: this.timeType,
						depotId: this.depotId,
						...this.reqObj

					})
					console.log(data)
					const keys = Object.keys(data.data);
					let firstKey = keys[0]
					console.log('itesm', data.data[firstKey])

					let {
						totalInCount,
						totalInPrice,
						totalOutCount,
						totalOutPrice,
					} = data
					let array = [data.data[firstKey]]
					console.log('array', array)

					this.$refs.paging.complete(array)
					this.loading = false
				} catch (e) {
					console.log('请求失败', e)
					this.$refs.paging.complete(false)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.main {
		.nav {
			height: 300rpx;
			background-color: #ffaf38;
			-webkit-clip-path: ellipse(100% 68% at 50% 30%);
			clip-path: ellipse(100% 68% at 50% 30%);
			padding: 40rpx 80rpx;
		}
	}

	.container {
		margin-top: -60px;
		position: relative;
		z-index: 2;

		.list {
			margin-bottom: 17rpx;
			padding: 25rpx;
			border-radius: 20rpx;
			background-color: #fff;
			display: flex;
			flex-direction: column;

			.time {
				color: #000;
				font-weight: 600;
				font-size: 32rpx;
			}

			.content {
				padding: 25rpx 0 10rpx 0;
				color: #737373;
				align-items: center;
				font-size: 26rpx;

				text {
					padding-left: 10rpx;
				}
			}
		}
	}
</style>