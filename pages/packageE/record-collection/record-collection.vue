<template>
	<view>
		<u-navbar placeholder :autoBack="true" bgColor="rgba(255,255,255,0)">
			<view class="nav-content" slot="center">
				<text @click="toggleIndex(1)" :class="currIndex === 1 ? 'active' : ''">收入</text>
				<text @click="toggleIndex(2)" :class="currIndex === 2 ? 'active' : ''">支出</text>
			</view>
		</u-navbar>

		<view class="container">
			<view class="box">
				<u--form labelPosition="left" labelWidth="100" :labelStyle="{ fontSize: '14px', lineHeight: 2 }">
					<u-form-item label="门店" required borderBottom @click="showStore = true">
						<view class="flex flex-between">
							<text>{{curStore.name || '请选择店铺'}}</text>
							<u-icon name="arrow-down-fill" size="14" color="#c0c4cc"></u-icon>
						</view>
					</u-form-item>
				</u--form>
			</view>

			<view class="box">
				<u--form labelPosition="left" labelWidth="100" :labelStyle="{ fontSize: '14px', lineHeight: 2 }">
					<u-form-item v-for="item of formList" :key="item.id" :required="item.required" :label="item.title"
						prop="item.id" borderBottom @click="handleClick(item)">
						<u--input v-if="!item.right" prefixIcon="￥" placeholder="0.00" v-model="item.value"
							border="none"></u--input>
						<view class="flex flex-between" v-else>
							<text :class="item.select ? 'select' : 'no-select'">{{ item.value }}</text>
							<u-icon :name="item.right" size="14" color="#c0c4cc"></u-icon>
						</view>
					</u-form-item>
				</u--form>
			</view>

			<view class="box remark">
				<u--text text="备注" margin="10px"></u--text>
				<u--textarea border="none" v-model="remark" placeholder="请输入内容"></u--textarea>

				<view class="">
					<u-upload width="60" height="60" :fileList="fileList1" @afterRead="afterRead" @delete="deletePic"
						name="1" multiple :maxCount="6"></u-upload>
				</view>
			</view>
		</view>

		<view class="fixed-bottom">
			<view class="dailyInOut" @click="saveData">{{ isUpdate ? '更新' : '保存' }}</view>
		</view>

		<select-shop @onCreated="onCreated" :all="false" :show="showStore" @cancel="showStore = false" @confirm="confirmStore"></select-shop>

		<u-picker :show="showPerson" @cancel="showPerson = false" @confirm="confirmPerson" keyName="userName"
			:columns="[person]"></u-picker>
		<u-picker :show="showType" @cancel="showType = false" @confirm="confirmType" keyName="label"
			:columns="[filteredList]"></u-picker>
		<select-time :show="showTime" @cancel="showTime = false" @confirm="confirmTime"></select-time>
	</view>
</template>

<script>
	import {
		getUserByDepotId,
		addinOutItem,
		updateinOutItem,
		genbuildNumber
	} from '@/apis'
	import {
		timestampToDate,
		formatTimestamp
	} from '@/utils'
	import {
		UPLOAD_FILE_URL,
		IMAGE_OSS_URL
	} from '@/common/contanst.js'
	import SelectTime from '@/components/SelectTime/SelectTime.vue';
	import SelectShop from '@/components/SelectShop/SelectShop.vue';
	export default {
		components: {
			SelectTime,
			SelectShop,
		},
		data() {
			return {
				// 1 收入   2是 支出
				currIndex: 1,
				remark: '',
				curTemp: '',
				fileList1: [],

				formList: [{
						id: 1,
						title: '收入金额',
						required: true,
						value: '',
						right: '',
						select: false
					},
					{
						id: 2,
						title: '账户',
						required: true,
						value: '现金',
						right: ' ',
						select: true
					},
					{
						id: 3,
						title: '收入类型',
						required: true,
						value: '请选择收入类型',
						right: 'arrow-down-fill',
						select: false
					},
					{
						id: 4,
						title: '时间',
						required: false,
						value: '',
						right: 'arrow-down-fill',
						select: false
					},
					{
						id: 5,
						title: '业务员',
						required: true,
						value: '',
						right: 'arrow-down-fill',
						select: false
					}
				],
				curStore: {
					id: 0,
					name: ''
				},
				// 收入类型show 控制
				showType: false,
				// 选择时间的
				showTime: false,
				// 选择业务员
				showPerson: false,
				// 店铺
				showStore: false,
				list: [{
						id: 1,
						label: '投资款',
						type: 'in'
					},
					{
						id: 2,
						label: '合作分红',
						type: 'in'
					},
					{
						id: 3,
						label: '代销提成',
						type: 'in'
					},
					{
						id: 4,
						label: '其他收入',
						type: 'in'
					},
					{
						id: 5,
						label: '房租',
						type: 'out'
					},
					{
						id: 6,
						label: '员工工资',
						type: 'out'
					},
					{
						id: 7,
						label: '水电气费',
						type: 'out'
					},
					{
						id: 8,
						label: '物流运费',
						type: 'out'
					},
					{
						id: 9,
						label: '临时工工资',
						type: 'out'
					},
					{
						id: 10,
						label: '门店物料',
						type: 'out'
					},
					{
						id: 11,
						label: '抖音运营',
						type: 'out'
					},
					{
						id: 12,
						label: '股东分红',
						type: 'out'
					},
					{
						id: 13,
						label: '其他支出',
						type: 'out'
					},
				],
				// 业务员ID
				salesMan: 0,
				typeName: "",
				person: [],
				createTime: Date.now(),
				isUpdate: false,
				updateData: {
					number: '',
					id: 0
				}
			}
		},
		onLoad(options) {
			this.token = uni.getStorageSync('token')
			console.log(options)
			const time = timestampToDate(Date.now())
			this.formList[3].value = time
			this.formList[3].select = true
			this.getData()

			if (options?.isUpdate) {
				console.log('更新状态')
				this.isUpdate = true
			}

		},
		computed: {
			filteredList() {
				if (this.currIndex === 1) {
					return this.list.filter(item => item.type === 'in');
				} else if (this.currIndex === 2) {
					return this.list.filter(item => item.type === 'out');
				} else {
					return [];
				}
			}
		},
		methods: {
			onCreated(item) {
				console.log('获取的第一个', item)
				this.curStore = item
			},
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
			toggleIndex(index) {
				this.currIndex = index

				if (index === 1) {
					this.formList[0].title = '收入金额'
					this.formList[2].title = '收入类型'
					this.formList[2].value = '请选择收入类型'
				} else {
					this.formList[0].title = '支出金额'
					this.formList[2].title = '支出类型'
					this.formList[2].value = '请选择支出类型'
				}

			},
			confirmStore(e) {
				console.log(e)
				this.showStore = false
				this.curStore = e
			},
			confirmPerson(e) {
				this.showPerson = false
				console.log(e)
				let obj = e.value[0]
				this.formList[4].value = obj.userName
				this.formList[4].select = true
				this.salesMan = obj.id

			},
			confirmTime(e) {
				this.showTime = false
				console.log(e)
				this.createTime = e.temp
				this.formList[3].value = e.time
			},
			// 确认选择收入类型
			confirmType(e) {
				console.log(e.value[0])
				let obj = e.value[0]
				this.showType = false
				this.formList[2].value = obj.label
				this.formList[2].select = true
				this.typeName = obj.label
			},
			async getData() {
				const {
					data
				} = await getUserByDepotId({
					depotId: 1
				})
				this.person = data
				const user = uni.getStorageSync('userInfo')
				let curItem = this.person.filter(item => item.userName === user.username)[0]
				this.formList[4].value = user.username
				this.formList[4].select = true
				this.salesMan = curItem.id

				if (this.isUpdate) {
					const cache = uni.getStorageSync('recordCollectionData')

					this.formList[4].value = cache.salesManStr
					this.formList[4].select = true
					this.salesMan = cache.salesMan
					this.formList[0].value = cache.totalAmount
					this.remark = cache.remark
					this.typeName = cache.name
					this.formList[2].value = cache.name
					this.formList[2].select = true
					this.curStore = {
						name: cache.depotName,
						id: cache.depotId
					}
					 this.currIndex  = cache.type === 'in' ? 1 : 2 
					this.updateData = {
						number: cache.number,
						id: cache.id
					}
					if (cache.imgName) {
						let imgArray = cache.imgName.split(',')
						console.log(imgArray)

						this.fileList1 = imgArray.map(e => ({
							url: e
						}))
					}

					console.log(cache)
				}

			},
			handleClick(item) {
				console.log(item)
				if (item.id === 0) {
					console.log('选择店铺')
				}

				if (item.id === 3) {
					this.showType = true
				}

				if (item.id === 4) {
					this.showTime = true
				}

				if (item.id === 5) {
					this.showPerson = true
				}
			},
			toast(title) {
				uni.showToast({
					title,
					icon: 'none'
				})
			},
			async saveData() {
				console.log('保存数据')
				let type = this.currIndex === 1 ? 'in' : 'out'

				if (!this.curStore.id) {
					this.toast('请选择店铺')
					return
				}

				if (!this.formList[0].value) {
					this.toast('请填写金额')
					return
				}

				if (!this.typeName) {
					this.toast('请填写类型')
					return
				}

				if (!this.salesMan) {
					this.toast('请选择业务员')
					return
				}
			
			
			    let number = ""
				const FN = this.isUpdate ? updateinOutItem : addinOutItem
				console.log(typeof this.formList[0].value)
				let imgStrArr = this.fileList1.map(item => item.url).join(',') || ""
				if (!this.isUpdate) {
					// 接口生成编号
					const result = await genbuildNumber({
						type: 2
					})
					number = result?.data.defaultNumber || ''
				} else {
					number = this.updateData.number
				}

				let paramsData = {
					type,
					apiName: "inOutItem",
					createTime: formatTimestamp(this.createTime, false),
					depotId: this.curStore.id,
					imgName: imgStrArr,
					name: this.typeName,
					number,
					remark: this.remark,
					salesMan: this.salesMan,
					totalAmount: this.formList[0].value,
					accountInfos: [{
						accountId: 1,
						amount: this.formList[0].value
					}]
				}

				if (this.isUpdate) {
					paramsData['id'] = this.updateData.id
				}

				const {
					data
				} = await FN(paramsData)

				console.log(data)
				this.toast('操作成功')
				// 返回
				// uni.navigateBack()
				
				
				if (this.isUpdate) {
					uni.reLaunch({
						url: '/pages/packageE/daily-summary/daily-summary'
					})
				} else {
					setTimeout(() => {
						uni.navigateBack()
					}, 300)
				}
			},
			formatMoney(value) {
				const number = parseFloat(value);
				return isNaN(number) ? '0.00' : number.toFixed(2);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-content {
		display: flex;
		align-items: center;
		font-size: 36rpx;
		font-weight: 600;

		text {
			color: #93969d;
			position: relative;
			margin: 0 10px;
		}

		.active {
			color: #333;

			&::after {
				content: '';
				position: absolute;
				bottom: -3rpx;
				left: 5rpx;
				width: 85%;
				height: 8rpx;
				border-radius: 40rpx;
				background: linear-gradient(to right, #f2b759, #e5f0f6);
				border-top-left-radius: 20px;
				border-top-right-radius: 20px;
				border-bottom-right-radius: 20px;
				border-bottom-left-radius: 20px;
				background-image: linear-gradient(to right, rgb(242, 183, 89), rgb(229, 240, 246));
			}
		}
	}

	.container {
		.box {
			border-radius: 20rpx;
			background: #fff;
			padding: 0 40rpx;
			margin-bottom: 17rpx;

			.select {
				color: #333;
			}

			.no-select {
				color: #c0c4cc;
			}
		}

		.remark {
			padding: 20rpx;
		}
	}

	.dailyInOut {
		width: 95%;
		margin: auto;
		height: 90rpx;
		background: linear-gradient(to right, #ffaf38, #fac575);
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: 700;
	}
</style>