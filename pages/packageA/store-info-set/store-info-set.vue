<template>
	<custom-view
		:getData="this.type === 1 ? getDepotList : getUserByDepotId"
		:transformData="transformData"
		:params="{ depotId: this.type === 2 ? 0 : 0 }"
	>
		<template slot="top">
			<AppletHeader @rightClick="rightClick" :title="objItem[type].title"></AppletHeader>
		</template>

		<template v-slot:content="{ dataList }">
			<view class="container">
				<view class="list" v-for="(item, index) in dataList" :key="item.id">
					<u--text bold size="16" margin="0 0 10px 0" :text="item.title"></u--text>
					<view class="flex flex-between flex-items-center">
						<u--text :text="item.subtitle"></u--text>
						<view class="">
							<u-icon name="more-dot-fill"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</template>
	</custom-view>
</template>

<script>
import { getDepotList, getUserByDepotId } from '@/apis'
import CustomView from '@/components/CustomView/CustomView.vue'
export default {
	components: {
		CustomView
	},
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
			getDepotList,
			getUserByDepotId
		}
	},
	onLoad(options) {
		console.log(options)
		this.type = +options?.type || 1
		console.error('当前的type', this.type)
	},
	methods: {
		rightClick() {
			uni.navigateTo({
				url: `/pages/packageA/add-store-info/add-store-info?type=${this.type}`
			})
		},
		transformData(data) {
			if (this.type === 1) {
				let { rows, total } = data || {}
				this.total = total
				return rows.map((item) => ({
					...item,
					title: item.name,
					subtitle: item.location
				}))
			} else {
				this.total = data.length
				return data.map((item) => ({
					...item,
					title: item.roleName,
					subtitle: item.userName
				}))
			}
		},
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
