<template>
	<view>
		<AppletHeader title="普通账户"></AppletHeader>
		<view class="container">
			<view class="flex flex-items-center mb10 box">
				<text>账户合计：</text>
				<u--text mode="price" :text="total"></u--text>
			</view>

			<view class="list mb10" v-for="(item, index) of list" :key="index">
				<u--text :text="item.name" bold color="#000" margin="0 0 10px 0"></u--text>
				<view class="flex flex-items-center">
					<text style="color: #737373">余额：</text>
					<u--text color="#737373" mode="price" :text="item.amount"></u--text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getAccountByDepotId } from '@/apis'
export default {
	data() {
		return {
			total: 0,
			depotId: 0,
			list: []
		}
	},
	onLoad() {
		this.getData()
	},
	methods: {
		async getData() {
			const { data } = await getAccountByDepotId({
				depotId: this.depotId
			})
			const { totalAmout, info } = data || {}
			this.total = totalAmout
			this.list = info
			console.log(data)
		}
	}
}
</script>

<style lang="scss">
.box {
	width: 100%;
	height: 75rpx;
	background-color: #fafbfd;
	border-radius: 10rpx;
	padding: 0 30rpx;
	color: #9d9ea0;
}

.list {
	background-color: #fff;
	padding: 25rpx;
	border-radius: 20rpx;
}
</style>
