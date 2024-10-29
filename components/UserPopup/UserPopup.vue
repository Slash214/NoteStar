<template>
	<view>
		<u-popup :show="visible" bgColor="#F1F5F8" mode="left" width="90%" @close="close" @open="open">
			<view class="modal">
				<view class="flex flex-items-center" @click="gotoUserSet">
					<u-avatar size="46" :text="userInfo.username.charAt(0) || ''"></u-avatar>
					<u--text size="18" bold :text="userInfo.username" margin=" 0 0 0 20px"></u--text>
					<u-icon name="arrow-right" color="#ccc"></u-icon>
				</view>

				<view class="modal-content">
					<view v-for="(item, index) in popupList" :class="index === 2 ? 'item' : 'item u-border-bottom'"
						:key="item.id" @click="handleClick(item)">
						<u--text size="14" bold :text="item.text"></u--text>
						<view class="text flex" v-if="item.right">
						    <text class="mr5">{{item.rightText}}</text>	
							<u-icon size="14" name="arrow-right" color="#ccc"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "UserPopup",
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		created() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		data() {
			return {
				userInfo: {
					username: '王'
				},
				popupList: [{
						id: 1,
						text: '店铺管理',
						right: true,
						rightText: '门店 | 员工 '
					},
					{
						id: 2,
						text: '消息中心',
						right: true,
						rightText: ''
					},
					{
						id: 3,
						text: '退出登录',
						right: false
					}
				],
			};
		},
		methods: {
			gotoUserSet() {
				uni.navigateTo({
					url: '/pages/packageA/user-setting/user-setting'
				})
			},
			close() {
				console.log('关闭')
				this.$emit('close')
			},
			open() {
				console.log('打开')
				
			},
			handleClick(item) {
				if (item.id === 1) {
					uni.navigateTo({
						url: '/pages/packageA/store-mnagement/store-mnagement'
					})
				}
				
				if (item.id === 2) {
					uni.navigateTo({
						url: '/pages/packageA/notes/notes'
					})
				}
				
				if (item.id === 3) {
					console.log('退出登录')
					uni.clearStorageSync()
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal {
		padding: 200rpx 30rpx;
		width: 580rpx;

		&-content {
			background-color: #fff;
			border-radius: 10rpx;
			margin-top: 40px;

			.item {
				color: #606266;
				padding: 26rpx 32rpx;
				display: flex;
				align-items: center;
				line-height: 2;
				justify-content: space-between;
				
				.text {
					font-size: 26rpx;
					color: #ccc;
				}

			}
		}
	}
</style>