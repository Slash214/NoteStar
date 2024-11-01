<template>
	<CustomView :getData="getAccountByDepotId" :transformData="transformData" :params="{ depotId: this.depotId }">
		<template v-slot:top>
			<AppletHeader title="普通账户" right-icon="plus" @rightClick="rightClick"></AppletHeader>
		</template>

		<template  v-slot:content="{ dataList }">
			<view class="container">
				<view class="flex flex-items-center mb10 box">
					<text>账户合计：</text>
					<u--text mode="price" :text="total"></u--text>
				</view>

				<view class="list mb10" v-for="(item, index) of dataList" :key="index">
					<u--text :text="item.name" bold color="#000" margin="0 0 10px 0"></u--text>
					<view class="flex flex-items-center">
						<text style="color: #737373">余额：</text>
						<u--text color="#737373" mode="price" :text="item.amount"></u--text>
					</view>
				</view>
			</view>
		</template>
	</CustomView>

</template>

<script>
	import CustomView from '@/components/CustomView/CustomView.vue'
	import {
		getAccountByDepotId
	} from '@/apis'
	export default {
		components: {
			CustomView
		},
		data() {
			return {
				getAccountByDepotId,
				total: 0,
				depotId: 0,
			}
		},
		onLoad() {
			// this.getData()
		},
		methods: {
			rightClick() {
				uni.navigateTo({
					url: '/pages/packageE/add-account/add-account'
				})
			},
			transformData(data) {
				console.log('data', data)
				const {
					totalAmout,
					info
				} = data || {}
				return info
			},
			async getData() {
				const {
					data
				} = await getAccountByDepotId({
					depotId: this.depotId
				})

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