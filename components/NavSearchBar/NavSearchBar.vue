<template>
	<u-sticky :offset-top="stickyOffset">
		<view class="search">
			<u-search @search="handleClickSearch" :showAction="false" searchIcon="scan" @custom="handleClickSearch" bgColor="#fff" :placeholder="desc" v-model="keyword"></u-search>
			<view v-if="showRight" class="ml15" @click="screening">筛选</view>
		</view>
	</u-sticky>
</template>

<script>
export default {
	name: 'NavSearchBar',
	props: {
		desc: {
			type: String,
			default: '描述内容'
		},
		showRight: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			keyword: '',
			stickyOffset: 0, // 计算后的 offset-top 值
			navHeight: 44, // 自定义导航栏高度
			statusBarHeight: 0 // 系统状态栏高度
		}
	},
	created() {
		this.calculateStickyOffset()
	},
	methods: {
		handleClickSearch(val) {
			console.log('传递17点20分')
		},
		screening() {
			console.log('点击了右边！')
		},
		calculateStickyOffset() {
			try {
				const systemInfo = uni.getSystemInfoSync()
				this.statusBarHeight = systemInfo.statusBarHeight
				this.stickyOffset = this.navHeight + this.statusBarHeight
				console.log('calculateStickyOffset', this.stickyOffset)
			} catch (e) {
				// 如果获取系统信息失败，设置默认值
				this.statusBarHeight = 20 // 这是一个常见的默认值，可根据需要调整
				this.stickyOffset = this.navHeight + this.statusBarHeight
			}
		}
	}
}
</script>

<style scoped lang="scss">
.search {
	padding: 25rpx;
	height: 100rpx;
	background-color: #f1f5f8;
	display: flex;
	align-items: center;
	flex: 1;
}
</style>
