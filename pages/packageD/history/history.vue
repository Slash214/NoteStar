<template>
	<view>
		<AppletHeader :title="genTitle()" right-icon=" "></AppletHeader>

		<view class="container">
			<u-divider text="没有更多了" v-if="!list.length" :hairline="true"></u-divider>
			<block v-else>
				<view class="box">
					<text>单号：{{nums}}</text>
					<text style="padding: 0 5px;">|</text>
					<text>修改次数：{{length}}</text>
				</view>
				<view class="card" v-for="item in list" :key="item.id" @click="gotoHistory(item)">
					<u--text margin="0 0 10px 0" :text="formatTimestamp(item.changeTime)" bold size="16"></u--text>
					<u--text :text="'操作人：' + item.modifierName" size="14"></u--text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		getHistoryDetailByNumber
	} from '@/apis'
	import {
		formatTimestamp
	} from '@/utils'

	export default {
		data() {
			return {
				// 1销售 2进货
				type: 1,
				nums: 0,
				list: [],
				length: 1,
				formatTimestamp
			}
		},
		onLoad(options) {
			console.log(options)
			let {
				type,
				number
			} = options

			this.type = +type
			this.nums = number
			console.log('DAQ', this.nums)
			this.getData()
		},
		methods: {
			gotoHistory(item) {
				uni.navigateTo({
					url: `/pages/packageB/sales-order-detail/sales-order-detail?number=${item.number}&type=${this.type}&h=1`
				})
			},
			genTitle() {
				let name = this.type === 1 ? '销售单' : '进货单'
				return `${name}历史记录`
			},
			async getData() {
				const {
					data
				} = await getHistoryDetailByNumber({
					number: this.nums
				})

				this.list = data
				this.length = data.length
				console.log('data', data)
			}
		},

	}
</script>

<style scoped lang="scss">
	.container {
		.box {
			width: 100%;
			height: 75rpx;
			background-color: #FAFBFD;
			border-radius: 10rpx;
			padding: 0 30rpx;
			color: #9D9EA0;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-bottom: 17rpx;
		}

		.card {
			width: 100%;
			margin-bottom: 17rpx;
			padding: 25rpx;
			border-radius: 20rpx;
			background-color: #fff;
			position: relative;
			display: flex;
			flex-direction: column;
		}
	}
</style>