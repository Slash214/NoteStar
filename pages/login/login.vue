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
					<u--input :placeholderStyle="{ color: '#303133' }"
						:customStyle="{ fontSize: '36rpx', marginLeft: '10px', height: '54px' }" placeholder="请输入登录账号"
						border="bottom" v-model="username" clearable @change="changeUserName"></u--input>
					<u--input :placeholderStyle="{ color: '#303133' }"
						:customStyle="{ fontSize: '36rpx', marginLeft: '10px', height: '54px' }" placeholder="请输入密码"
						password suffixIcon="eye" :border="false" v-model="password"
						@change="changePassword"></u--input>
				</block>

				<block v-else>
					<u--input :placeholderStyle="{ color: '#303133' }"
						:customStyle="{ fontSize: '36rpx', marginLeft: '10px', height: '54px' }" placeholder="请输入手机号"
						border="bottom" v-model="mobile" clearable @change="getMobile"></u--input>
					<u-input :placeholderStyle="{ color: '#303133' }"
						:customStyle="{ fontSize: '36rpx', marginLeft: '10px', height: '54px' }" placeholder="请输入验证码"
						:border="false" v-model="code" @change="getCode">
						<template slot="suffix">
							<u-code ref="uCode" @change="codeChange" seconds="20" changeText="X秒重新获"></u-code>
							<u-button color="rgba(90, 198, 218, 0.6)" @tap="sendCode" :text="tips"></u-button>
						</template>
					</u-input>
				</block>
			</view>

			<!-- <u-button  color="" text="登录" </u-button> -->
			<view  class="userpwd-button" v-if="currIndex === 1" @tap="userpwdLogin">
				登录
			</view>
			<view v-else class="userpwd-button" @tap="userTelLogin">
				登录
			</view>
			<view class="flex flex-center flex-items-center pwd">
				<u-icon :name="remberMe ? 'checkmark-circle-fill' : 'checkmark-circle'" color="#5AC6DA" size="18"
					@click="remberMe = !remberMe"></u-icon>
				<text>记住密码</text>
			</view>
		</view>

		<u-modal :show="show" title="温馨提示" @cancel="show = false"  @confirm="onConfirm"  showCancelButton confirmColor="#5AC6DA">
			<view class="slot-content">
				阅读并同意
				<text @click="gotoPageWebView(1)">《用户协议》</text>
				及
				<text @click="gotoPageWebView(2)">《隐私政策》</text>
				可以继续登录
			</view>
		</u-modal>

		<view class="login-footer">
			<view class="flex flex-items-center">
				<u-icon :name="isArgree ? 'checkmark-circle-fill' : 'checkmark-circle'" color="#5AC6DA" size="18"
					@click="isArgree = !isArgree"></u-icon>
				<view class="text">
					我已经阅读并同意
					<text @click="gotoPageWebView(1)">用户协议</text>
					和
					<text @click="gotoPageWebView(2)">隐私政策</text>
				</view>
			</view>
			<u--text margin="5px 0 5px 0" color="#fff" align="center" text="好闲惠掌柜宝"></u--text>
			<u--text color="#fff" align="center" text="门店加盟：400-690-8890"></u--text>
		</view>
	</view>
</template>

<script>
	import {
		login
	} from '@/apis'
	import w_md5 from "@/js_sdk/zww-md5/w_md5.js"
	import {
		UserAgreement,
		PrivacyPolicy
	} from '@/common/contanst.js'

	export default {
		data() {
			return {
				username: '',
				password: '',
				currIndex: 1,
				mobile: '',
				code: '',
				tips: '获取验证码',
				isArgree: false,
				remberMe: false,
				show: false
			}
		},
		onLoad() {
			const user = uni.getStorageSync('userInfo') || null
			if (user) {
				uni.switchTab({
					url: '/pages/overview/overview'
				})
			}
		},
		methods: {
			onConfirm() {
				console.log('确认关闭')
				this.show = false
				this.isArgree = true
			},
			gotoPageWebView(id) {
				console.log('登录', id)
				let url = id === 1 ? UserAgreement : PrivacyPolicy
				uni.navigateTo({
					url: `/pages/packageA/web-view/web-view?url=${url}`
				})
			},
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


				if (!this.isArgree) {
					console.log('同意协议')
					this.show = true
					return
				}


				// 接口验证
				const {
					data
				} = await login({
					loginName: this.username,
					password: w_md5.hex_md5_32(this.password),
				})

				const {
					token,
					user
				} = data || {}
				uni.setStorageSync('userInfo', user)
				uni.setStorageSync('token', token)
				console.log(data)
				uni.showToast({
					title: '登录成功',
					icon: 'none'
				})

				setTimeout(() => {
					uni.switchTab({
						url: '/pages/overview/overview'
					})
				}, 400)

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
				
				// 验证手机号是否合规
				console.log('this.mobile', this.mobile)
				const phoneRegex = /^(1[3-9]\d{9})$/
				if (!phoneRegex.test(this.mobile)) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					})
					return
				}
				
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
				this.code = v
			},
			getMobile(v) {
				this.mobile = v
				console.log('手机号', v)
			}
		}
	}
</script>

<style lang="scss">
	.slot-content {
		font-size: 30rpx;
		color: #606266;
		text {
			color: #5AC6DA;
		}
	}

	.login {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: linear-gradient(to bottom right, #68cab7, #3577cd);
		
		.userpwd-button {
			background-color: rgba(90, 198, 218, 0.6);
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 40rpx;
			border-radius: 15rpx;
		}

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
			margin-top: 80px;

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

		.pwd {
			color: #fff;
			margin: 20px auto;

			text {
				padding: 0 6rpx;
			}
		}

		&-footer {
			margin-bottom: 60rpx;
			line-height: 1.5;

			.text {
				color: #ccc;
			}

			text {
				color: #5AC6DA;
				margin: 0 10rpx;
			}
		}
	}
</style>