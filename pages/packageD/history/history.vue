<template>
	<view>
		<AppletHeader :title="genTitle()" right-icon=" "></AppletHeader>

		<view class="container">
			<u-divider text="没有更多了" v-if="!list.length" :hairline="true"></u-divider>
			<block v-else>
				<view class="box">
					<text>单号：{{number}}</text>
					<text style="padding: 0 5px;">|</text>
					<text>修改次数：1</text>
				</view>
				<view class="card" v-for="item in list" :key="item.id">
					<u--text margin="0 0 10px 0" :text="item.changeTime" bold size="16"></u--text>
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
	// import { forma}
	export default {
		data() {
			return {
				// 1销售 2进货
				type: 1,
				number: 0,
				list: []
			}
		},
		onLoad(options) {
			console.log(options)
			let {
				type,
				number
			} = options

			this.type = +type
			this.number = number
			this.getData()
		},
		methods: {
			genTitle() {
				let name = this.type === 1 ? '销售单' : '进货单'
				return `${name}历史记录`
			},
			async getData() {
				const {
					data
				} = await getHistoryDetailByNumber({
					number: this.numbner
				})

				this.list = data
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