<template>
	<u-sticky :offset-top="stickyOffset">
		<view class="search">
			<u-search @change="debouncedGetKeyword" @search="handleClickSearch" :showAction="false" searchIcon="search"
				@custom="handleClickSearch" bgColor="#fff" :placeholder="desc" v-model="keyword"
				:clearabled="false"></u-search>
			<view v-if="showRight" class="ml15" @click="screening">
				<image class="images" mode="widthFix"
					src="https://haoxianhui.com//hxh/2024/11/19/5e093d14b79a4cc2ad6766a456adc410.png"></image>
			</view>
			<view class="scan" :style="{right: right }" @click="handleClickLeft">
				<u-icon name="scan" size="20"></u-icon>
			</view>
		</view>
	</u-sticky>
</template>

<script>
	import {
		debounce
	} from '@/utils'
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
			},
			right: {
				type: String,
				default: '170rpx'
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
			// 在 created 钩子中定义防抖函数，确保 this 已经初始化
			this.debouncedGetKeyword = debounce(this.getValueChange, 500) // 500 毫秒的防抖时间，可以根据需要调整
		},
		methods: {
			getValueChange(val) {
				console.log(val)
				this.$emit('search', val)
			},
			handleClickSearch(val) {
				console.log('点击了右侧或者输入框确定')
			},
			handleClickLeft() {
				console.log('左边')
				// 二维码扫码 搜索内容

				uni.scanCode({
					scanType: ['barCode'],
					enableFlash: true, // 设置为true以显示开启手电筒的按钮
					success: res => {
						this.keyword = res.result
						this.$emit('search', res.result)
					},
					fail: err => {
						uni.showToast({
							title: '识别失败',
							icon: 'none'
						})
						console.log(err)
					},
					complete: e => {
						console.log(e)
					}
				})
			},
			screening() {
				// console.log('点击了右边！')
				this.$emit('rightClick')
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
		position: relative;

		.scan {
			position: absolute;
			// right: 170rpx;
			// right: 50rpx;
			top: 50%;
			transform: translateY(-50%);
			z-index: 4;
		}

		.images {
			width: 45px;
			display: block;
		}
	}
</style>