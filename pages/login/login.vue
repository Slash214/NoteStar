<template>
	<view class="login flex-column flex-between flex-items-center">
		<view class="login-header flex-column flex-items-center">
			<text>好闲惠</text>
			<text>引领新零售时代</text>
		</view>

		<view class="login-box">
			<view class="tab">
				<text @click="toggleCurrentIndex(1)" :class="currIndex === 1 ? 'active' : ''">密码登录</text>
				<text @click="toggleCurrentIndex(2)" :class="currIndex === 2 ? 'active' : ''">验证码登录</text>
			</view>
			<view class="from">
				<block v-if="currIndex === 1">
					<u--input
						:placeholderStyle="{ color: '#303133' }"
						:customStyle="{ fontSize: '32rpx', marginLeft: '10px', height: '54px' }"
						placeholder="请输入登录账号"
						border="bottom"
						v-model="username"
						clearable
						@change="changeUserName"
					></u--input>
					<u--input
						:placeholderStyle="{ color: '#303133' }"
						:customStyle="{ fontSize: '32rpx', marginLeft: '10px', height: '54px' }"
						placeholder="请输入密码"
						password
						suffixIcon="eye"
						:border="false"
						v-model="password"
						@change="changePassword"
					></u--input>
				</block>

				<block v-else>
					<u--input
						:placeholderStyle="{ color: '#303133' }"
						:customStyle="{ fontSize: '32rpx', marginLeft: '10px', height: '54px' }"
						placeholder="请输入手机号"
						border="bottom"
						v-model="mobile"
						clearable
						@change="getMobile"
					></u--input>
					<u-input
						:placeholderStyle="{ color: '#303133' }"
						:customStyle="{ fontSize: '32rpx', marginLeft: '10px', height: '54px' }"
						placeholder="请输入验证码"
						:border="false"
						v-model="code"
						@change="getCode"
					>
						<template slot="suffix">
							<u-code ref="uCode" @change="codeChange" seconds="20" changeText="X秒重新获"></u-code>
							<u-button color="rgba(90, 198, 218, 0.6)" @tap="sendCode" :text="tips"></u-button>
						</template>
					</u-input>
				</block>
			</view>

			<u-button v-if="currIndex === 1" color="rgba(90, 198, 218, 0.6)" text="登录" @tap="userpwdLogin"></u-button>
			<u-button v-else color="rgba(90, 198, 218, 0.6)" text="登录" @tap="userTelLogin"></u-button>
		</view>

		<view class="login-footer">
			<view class="">
				我已经阅读并同意
				<text>用户协议</text>
				和
				<text>隐私政策</text>
			</view>
			<u--text margin="5px 0 5px 0" color="#fff" align="center" text="好闲惠掌柜宝"></u--text>
			<u--text color="#fff" align="center" text="门店加盟：400-690-8890"></u--text>
		</view>
	</view>
</template>

<script>
import { login } from '@/apis'
export default {
	data() {
		return {
			username: '',
			password: '',
			currIndex: 1,
			mobile: '',
			code: '',
			tips: '获取验证码'
		}
	},
	methods: {
		userTelLogin() {
			console.log('手机号登录')
		},
		async userpwdLogin() {
			if (!this.username || !this.password) {
				uni.showToast({
					title: '账号/密码不能为空',
					icon: 'none'
				})
				return
			}
			
			// 接口验证
			const { data } = await login({
				loginName: this.username,
				password: this.password,
			})
			
			console.log(data)
		},
		toggleCurrentIndex(index) {
			this.currIndex = index
			this.username = ''
			this.password = ''
			this.mobile = ''
			this.code = ''
		},

		changePassword(val) {
			console.log(val)
		},
		changeUserName(val) {
			console.log(val)
		},
		codeChange(text) {
			this.tips = text
		},
		sendCode() {
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码'
				})
				setTimeout(() => {
					uni.hideLoading()
					// 这里此提示会被this.start()方法中的提示覆盖
					uni.$u.toast('验证码已发送')
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start()
				}, 2000)
			} else {
				uni.$u.toast('倒计时结束后再发送')
			}
		},
		getCode(v) {
			console.log('code', v)
		},
		getMobile(v) {
			console.log('手机号', v)
		}
	}
}
</script>

<style lang="scss">
.login {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: linear-gradient(to bottom right, #77d7c3, #3a92da);
	&-header {
		margin-top: 300rpx;
		font-size: 56rpx;
		color: #fff;
		font-weight: 400;
		letter-spacing: 2px;
		line-height: 1.5;
	}
	&-box {
		width: 100%;
		padding: 0 40px;
		flex: 1;
		margin-top: 40px;
		.tab {
			border-radius: 30rpx 30rpx 0 0;
			width: 100%;
			overflow: hidden;
			text {
				width: 50%;
				line-height: 40px;
				height: 40px;
				text-align: center;
				background-color: #bcbebf;
				color: #000;
			}

			.active {
				background-color: #f7f7f7;
				color: #5ac6da;
			}
		}
		.from {
			margin: -1px 0 20px 0;
			background-color: #f7f7f7;
			padding: 0px 10px;
			border-radius: 0 0 30rpx 30rpx;
		}
	}
	&-footer {
		margin-bottom: 60rpx;
		line-height: 1.5;
	}
}
</style>
