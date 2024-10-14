<template>
	<view class="container">
		<view class="block">
			<u--text bold margin="0 0 10px 5px" size="18" text="时间"></u--text>
			<view class="grid grid-4">
				<view class="grid-item" v-for="item of timeArray" :key="item.id">
					{{ item.name }}
				</view>
			</view>
			
			<!-- <view class="">
				2024-10-01
			</view> -->
		</view>

		<view class="block" v-for="item in dataList" :key="item.id">
			<u--text bold margin="0 0 10px 5px" size="18" :text="item.name"></u--text>
			<view class="grid">
				<view class="grid-item" v-for="el of item.data" :key="el.id" @click="handleClick(item.id, el)">
					{{ el.name }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getUserByDepotId, getDepotByUserId } from '@/apis'
export default {
	data() {
		return {
			dataList: [],
			timeArray: [
				{ id: 1, name: '昨日', select: false },
				{ id: 2, name: '今日', select: false },
				{ id: 3, name: '上月', select: false },
				{ id: 4, name: '本月', select: false }
			]
		}
	},
	async onLoad() {
		const user = uni.getStorageSync('userInfo')
		const [r1, r2] = await Promise.all([getDepotByUserId({ userId: user.id }), getUserByDepotId({ depotId: 0 })])
		const array = r2.data.map((item) => ({ ...item, name: item.userName, select: false }))
		this.dataList = [
			{ id: 1, name: '门店', type: 1, key: '', data: r1.data.map((item) => ({ ...item, select: false })) },
			{ id: 2, name: '业务员', type: 2, key: '', data: array },
			{ id: 3, name: '制单员', type: 3, key: '', data: array }
		]
	},
	methods: {
		handleClick(id, item) {
			console.log('id', id, item)
		}
	}
}
</script>

<style scoped lang="scss">
.block {
	margin-bottom: 60rpx;
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 1fr;
		grid-column-gap: 20rpx;
		grid-row-gap: 20rpx;

		.grid-item {
			border-radius: 20rpx;
			background-color: #fff;
			border: 1px solid #ccc;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
		}
	}
	
	.grid-4 {
		grid-template-columns: repeat(4, 1fr);
	}
}
</style>
