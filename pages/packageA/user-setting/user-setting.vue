<template>
	<view>
		<AppletHeader title="个人信息" right-icon=" "></AppletHeader>
		<view class="box">
			<view class="box-item" v-for="item in list" :key="item.id">
				<view class="label">
					{{item.title}}
				</view>

				<view class="content">
					<view v-if="item.id !== 2">
						{{item.value}}
					</view>

					<view class="" v-else>
						<u-avatar :text="capitalizeFirstLetter(item.value)" fontSize="18" bg-color="#86B5DD"></u-avatar>
					</view>
					<u-icon v-if="item.right" :name="item.right"></u-icon>
				</view>
			</view>
		</view>

		<view class="box">
			<view class="box-item">
				<view class="label">
					手机号
				</view>

				<view class="content">
					<view class="">
						手机号
					</view>
				</view>
			</view>
			<view class="box-item">
				<view class="label">
					密码
				</view>

				<view class="content" @click="setPassword">
					<view :style="{ color: password ? '#333' : '#ccc'}">
						{{password || '去设置'}}
					</view>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						id: 1,
						title: '姓名',
						value: '',
						right: 'arrow-right'
					},
					{
						id: 2,
						title: '头像',
						value: '',
						right: ' '
					},
					{
						id: 3,
						title: '登录账号',
						value: '',
						right: ' '
					},
					{
						id: 4,
						title: '所属商户',
						value: '',
						right: ' '
					},
					{
						id: 5,
						title: '角色',
						value: '',
						right: ' '
					}
				],
				password: ''
			}
		},
		onLoad() {
			const user = uni.getStorageSync('userInfo')
			console.log(user)
			this.loadData(user)
		},
		methods: {
			loadData(item) {
				this.list[0].value = item.username
				this.list[1].value = item.username
				this.list[2].value = item.loginName
				this.list[3].value = ""
				this.list[4].value = item.position

				this.password = item.password
			},
			capitalizeFirstLetter(str) {
				if (!str || typeof str !== 'string') {
					return ''; // 如果不是字符串或为空，返回空字符串
				}
				const firstLetter = str.charAt(0).toUpperCase(); // 获取第一个字符并大写
				const restOfString = str.slice(1); // 获取剩余部分
				return firstLetter; // 拼接返回
			},
			setPassword() {
				console.log('设置密码')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		background-color: #fff;
		padding: 0 25rpx;
		margin-bottom: 20rpx;

		.box-item {
			display: flex;
			align-items: center;
			height: 60px;
			border-bottom: 1rpx solid #e4e7ed;
			padding: 0 20rpx;

			&:last-child {
				border-bottom: none;
			}

			.label {
				width: 93px;
				margin-right: 10px;
			}

			.content {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
	}
</style>