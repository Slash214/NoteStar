<template>
	<view>
		<AppletHeader :title="isUpdate ? '编辑商品' : '新增商品'" right-icon="保存" :right-icon-size="14"
			@rightClick="handleRightClick"></AppletHeader>
		<view class="container">
			<view class="nav-scan" v-if="!isUpdate" @click="scanCode">
				<u-icon name="scan" size="24" color="#4f96e6"></u-icon>
				<text>扫条形码快速录入商品</text>
			</view>

			<view class="box">
				<u--form labelPosition="left" labelWidth="100">
					<u-form-item required label="商品名称" prop="userInfo.name" borderBottom>
						<u--input v-model="baseForm.name" placeholder="请输入" border="none"></u--input>
					</u-form-item>
					<u-form-item v-if="!isUpdate" label="门店" prop="userInfo.name" borderBottom>
						<view class="flex flex-between" @click="handleSelect">
							<text>{{ baseForm.store || '点击选择门店' }}</text>
							<u-icon name="arrow-down-fill"></u-icon>
						</view>
					</u-form-item>
					<u-form-item label="商品图片" prop="userInfo.name" borderBottom>
						<u-upload width="60" height="60" :fileList="fileList1" @afterRead="afterRead"
							@delete="deletePic" name="1" multiple :maxCount="6"></u-upload>
					</u-form-item>
				</u--form>
			</view>

			<view class="box">
				<u--form labelPosition="left" labelWidth="100">
					<u-form-item required label="条形码">
						<u-input v-model="marCode" placeholder="请输入" clearable border="none">
							<template slot="suffix">
								<view class="flex">
									<text v-if="!marCode" @click="genCode">自动生成</text>
									<u-line direction="col"></u-line>
									<u-icon @click="scanCode" size="20" color="#4F96E6" name="scan"></u-icon>
								</view>
							</template>
						</u-input>
					</u-form-item>
				</u--form>
			</view>

			<u--text text="价格" bold margin="10px"></u--text>

			<view class="box">
				<u--form labelPosition="left" labelWidth="100">
					<u-form-item label="进货价" borderBottom>
						<u--input prefixIcon="￥" v-model="priceForm.purchaseDecimal" placeholder="0.00"
							border="none"></u--input>
					</u-form-item>
					<u-form-item label="零售价" borderBottom>
						<u--input prefixIcon="￥" v-model="priceForm.commodityDecimal" placeholder="0.00"
							border="none"></u--input>
					</u-form-item>
					<u-form-item label="批发价" borderBottom>
						<u--input prefixIcon="￥" v-model="priceForm.wholesaleDecimal" placeholder="0.00"
							border="none"></u--input>
					</u-form-item>
				</u--form>
			</view>

			<view class="box remark">
				<u--text text="备注" margin="0 10px 10px 10px"></u--text>
				<u--textarea border="none" v-model="remark" placeholder="在这里输入关于商品的详细信息..."></u--textarea>
			</view>
		</view>

		<select-shop :all="false" :show="show" @cancel="show = false" @confirm="confirm"></select-shop>
	</view>
</template>

<script>
	import SelectShop from '@/components/SelectShop/SelectShop.vue'
	import {
		getMaxBarCode,
		updateMaterial,
		addMaterial
	} from '@/apis'
	import {
		UPLOAD_FILE_URL,
		IMAGE_OSS_URL
	} from '@/common/contanst.js'
	export default {
		components: {
			SelectShop
		},
		data() {
			return {
				fileList1: [],
				UPLOAD_FILE_URL,
				IMAGE_OSS_URL,
				show: false,
				isUpdate: false,
				baseForm: {
					name: '',
					store: '',
					image: [],
					imgListShow: [] // 初始展示的图片列表
				},
				marCode: '',
				// 当前选择的门店 id 和 name
				curStore: {},
				remark: '',
				priceForm: {
					purchaseDecimal: '',
					commodityDecimal: '',
					wholesaleDecimal: ''
				},
				updateInfo: {},
				token: '',
				progressList: [],
				codeProduct: false
			}
		},
		onLoad(options) {
			let { isUpdate, code } = options || {}
			
			if (isUpdate === 'true') {
				this.isUpdate = true
				this.genEditData()
			}
			
			if (code) {
				this.marCode = code
				this.codeProduct = true
			}
			
			
			this.token = uni.getStorageSync('token')
		},
		onUnload() {
			uni.removeStorageSync('editData')
		},
		methods: {
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(
						fileListLen,
						1,
						Object.assign(item, {
							status: 'success',
							message: '',
							url: result
						})
					)
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: UPLOAD_FILE_URL, // 仅为示例，非真实的接口地址
						filePath: url,
						header: {
							'X-Access-Token': this.token,
							'content-type': 'application/json'
						},
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							console.log('res', res.data)
							const result = JSON.parse(res.data)
							console.log('TP1', result.data)
							let url = `${IMAGE_OSS_URL}/${result.data}`
							resolve(url)
						}
					})
				})
			},


			scanCode() {
				uni.scanCode({
					scanType: ['barCode'],
					enableFlash: true, // 设置为true以显示开启手电筒的按钮
					success: (res) => {
						console.log('条码类型：' + res.scanType)
						console.log('条码内容：' + res.result)
						this.marCode = res.result
					},
					fail: err => {
						uni.showToast({
							title: '识别失败',
							icon: 'none'
						})
						console.log(err)
					}
				})

			},
			genEditData() {
				const cacheData = uni.getStorageSync('editData')
				console.error('cacheData', cacheData)
				this.updateInfo = cacheData
				let {
					commodityDecimal,
					purchaseDecimal,
					remark,
					wholesaleDecimal
				} = cacheData || {}
				this.baseForm.name = cacheData.name
				this.marCode = cacheData.mbarCode
				this.priceForm = {
					commodityDecimal,
					purchaseDecimal,
					wholesaleDecimal
				}
				let imgList = cacheData.imgName.split(',') || []
				this.fileList1 = imgList.map(item => ({
					url: item
				}))
				this.remark = remark
			},
			async genCode() {
				console.log('生成code')
				const {
					data: {
						barCode
					}
				} = await getMaxBarCode({})
				// console.log('data', data)
				this.marCode = Number(barCode) + 1 || ''
			},
			confirm(e) {
				console.log('选择的门店', e)
				this.baseForm.store = e.name
				this.curStore = e
				this.show = false
			},
			formatDate() {
				const date = new Date()
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				return `${year}${month}${day}`
			},

			handleSelect() {
				this.show = true
			},
			async handleRightClick() {
				//
				console.log(this.isUpdate)
				// true 更新  false 添加
				// if (this.fileList1.length) {
				// 	console.log('')
				// 	let array = this.fileList1.map(e => e.url)
				// 	console.log(array.join(','))
				// }

				console.log(this.fileList1)

				if (!this.baseForm.name) {
					uni.showToast({
						title: '请设置商品名称',
						icon: 'none'
					})
					return
				}

				if (!this.marCode) {
					uni.showToast({
						title: '条形码不能为空',
						icon: 'none'
					})
					return
				}

				let imgName = ''
				if (this.fileList1.length) {
					// console.log('')
					let array = this.fileList1.map(e => e.url)
					imgName = array.join(',')
				}

				let storeName = this.curStore.name || ''
				let name = this.isUpdate ? this.baseForm.name :
					`${storeName}${this.baseForm.name}-${this.formatDate()}`
				const params = {
					// 选择的店铺名+时间戳
					name,
					remark: this.remark,
					imgName,
					meList: [{
						barCode: this.marCode,
						...this.priceForm
					}],
					apiName: 'material'
				}

				// 修改需要传id
				if (this.isUpdate) {
					params.id = this.updateInfo.id // 商品表id
					params.meList[0].id = this.updateInfo.meId // 价格表id
				}
				const FN = this.isUpdate ? updateMaterial : addMaterial
				const {
					data,
					code
				} = await FN(params)
				uni.showToast({
					title: '操作成功',
					icon: 'none'
				})
				
				// console.error(data)
				// 缓存单独扫码添加的商品
				// uni.setStorageSync('scanData', data)
				// return
				setTimeout(() => {
					
					if (this.codeProduct) {
						uni.setStorageSync('addScanData', 1)
						uni.navigateBack()
					} else {
						uni.switchTab({
							url: '/pages/products/products'
						})
					}
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.box {
			border-radius: 20rpx;
			background: #fff;
			padding: 0 40rpx;
			margin-bottom: 17rpx;
			line-height: 2;
		}

		.remark {
			padding: 20rpx;
		}

		.nav-scan {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100rpx;
			background: #fff;
			color: #4f96e6;
			font-size: 32rpx;
			border-radius: 20rpx;
			margin-bottom: 17rpx;
		}
	}
</style>