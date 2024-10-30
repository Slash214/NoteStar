<template>
	<view>
		<AppletHeader title="当前库存" right-icon=" "></AppletHeader>
		<view class="container">
			<view class="box">
				<u-cell-group>
					<u-cell  size="large" :title="item.depotName" :value="item.stock + '件'" v-for="item of list" :key="item.depotId" ></u-cell>
				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: []
		}
	},
	onLoad() {
		const data = uni.getStorageSync('shopList')
		console.log(data)
		this.list = data
	},
	onHide() {
		uni.removeStorageSync('shopList')
	}
}
</script>

<style lang="scss" scoped>
.box {
	background-color: #fff;
	border-radius: 30rpx;
	overflow: hidden;
}

.container {
	padding-bottom: 40px;
}
</style>
