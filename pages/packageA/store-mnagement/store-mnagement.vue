<template>
	<view>
		<AppletHeader title="店铺管理" right-icon=" "></AppletHeader>
		<view class="box">
			<u-cell-group >
				<u-cell   size="large" @click="handleClick" name="1" title="门店管理" :border="true" :isLink="true"></u-cell>
				<u-cell   size="large" @click="handleClick" name="2" title="员工管理" :border="false" :isLink="true"></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			handleClick(e) {
				// 1 店铺  2 员工
				let type = e.name === '1' ? 1 : 2
				uni.navigateTo({
					url: `/pages/packageA/store-info-set/store-info-set?type=${type}`
				})
			}
		},
		onShow() {
			uni.removeStorageSync('selectShop')
		}
	}
</script>

<style lang="scss">
	.box {
		background-color: #fff;
	}
</style>