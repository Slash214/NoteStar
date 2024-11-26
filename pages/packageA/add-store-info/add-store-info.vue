<template>
	<view>
		<AppletHeader
			@rightClick="saveData"
			:title="objItem[id].title"
			right-icon-size="15"
			right-icon="保存"
		></AppletHeader>
		<view class="box">
			<u--form
				labelPosition="left"
				:model="model1"
				ref="uForm"
				labelWidth="93"
				:labelStyle="{ fontSize: '28rpx', lineHeight: 2 }"
			>
				<u-form-item
					v-for="item in objItem[id].data"
					:key="item.id"
					:label="item.label"
					:prop="item.key"
					:borderBottom="item.id !== objItem[id].data.length"
				>
					<block v-if="item.type === 'input'">
						<u--input v-model="item.value" border="none" :placeholder="item.desc"></u--input>
					</block>

					<block v-if="item.type === 'select'">
						<view class="flex flex-between" @click="handleClick(item)">
							<text style="line-height: 1.5">{{ item.value || item.desc }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</block>
					
					<block v-if="item.type === 'location'">
						<address-picker @select="getSelectAddress"></address-picker>
					</block>
				</u-form-item>
			</u--form>

			<u-picker
				@cancel="roleShow = false"
				@confirm="onSelectRole"
				:show="roleShow"
				keyName="name"
				:columns="roleList"
			></u-picker>
			
			
		</view>
	</view>
</template>

<script>
import {
	updateShopDataDeopt,
	addShopDataDeopt,
	updateUserData,
	addUserData,
	getRoleList,
	getUserByUserId
} from '@/apis'
import SelectShop from '@/components/SelectShop/SelectShop.vue'
import AddressPicker from '@/components/AddressPicker/AddressPicker.vue'
export default {
	components: {
		SelectShop,
		AddressPicker
	},
	data() {
		return {
			objItem: {
				1: {
					title: '新增门店',
					data: [
						{ id: 1, label: '门店名称', desc: '请输入内容', value: '', type: 'input', key: 'name' },
						{ id: 2, label: '门店类型', desc: '请输入内容', value: '直营', type: 'input', key: '' },
						{ id: 3, label: '门店电话', desc: '请输入内容', value: '', type: 'input', key: 'phone' },
						{
							id: 4,
							label: '所在地区',
							desc: '请输入内容',
							value: '四川省-成都市-双流区',
							type: 'location',
							key: 'location'
						},
						{ id: 5, label: '详细地址', desc: '请输入内容', value: '', type: 'input', key: 'address' },
						{ id: 6, label: '备注', value: '', desc: '请输入内容', type: 'input', key: 'remark' }
					]
				},
				2: {
					title: '新增员工',
					data: [
						{ id: 1, label: '员工名称', desc: '2-20个字', value: '', type: 'input', key: 'username' },
						{ id: 2, label: '登录账号', desc: '3-11个字符', value: '', type: 'input', key: 'loginName' },
						{ id: 3, label: '手机号', desc: '请输入手机号', value: '', type: 'input', key: 'phonenum' },
						{ id: 4, label: '所属角色', desc: '请选择所属角色', value: '', type: 'select', key: 'roleId' },
						{ id: 5, label: '所属门店', desc: '请选择所属门店', value: '', type: 'select', key: 'depotIds' }
					]
				}
			},
			id: 1,
			updateId: 0,
			isUpdate: false,

			roleShow: false,
			roleList: [],
			curRole: {},

			shopShow: false,
			curShop: {},
			allIdStr: ''
		}
	},
	async onLoad(options) {
		console.log(options)
		this.id = +options?.type || 1

		if (this.id === 1) {
			if (options?.obj) {
				this.isUpdate = true
				let curItem = JSON.parse(options.obj)
				console.log('店铺', curItem)
				this.objItem[this.id].data.forEach((e) => {
					e.value = curItem[e.key]
					if (e.key === '') {
						e.value = '直营'
					}
				})
				this.updateId = curItem.id
			}
		}

		if (this.id === 2) {
			await this.getList()
			if (options?.userId) {
				const { data } = await getUserByUserId({ userId: options.userId })
				console.log('员工', data)
				this.curRole = this.roleList[0].filter((e) => e.id === data.roleId)[0]
				let newObj = this.objItem[this.id].data
				newObj[0].value = data.userName
				newObj[1].value = data.loginName
				newObj[2].value = data.phone
				newObj[3].value = this.curRole.name
				let name = data.depotList.map((item) => item.name).join('，')
				newObj[4].value = name
				this.allIdStr = data.depotList.map((item) => item.id).join(',')
				uni.setStorageSync('selectShop',  data.depotList)
			}
		}
	},
	onShow() {
		if (this.id === 2) {
			const cacheShop = uni.getStorageSync('selectShop')
			if (cacheShop) {
				console.log('选择的店铺', cacheShop)
				let name = cacheShop.map((item) => item.name).join('，')
				let newObj = this.objItem[this.id].data
				newObj[4].value = name
				this.allIdStr = cacheShop.map((item) => item.id).join(',')
			}
		}
	},
	methods: {
		getSelectAddress(e) {
			console.log(e)
			city: "成都市"
			district: "双流区"
			province: "四川省"
			let newVal = this.objItem[this.id].data
			newVal[3].value = `${e.province}-${e.city}-${e.district}`
		},
		handleClick(item) {
			console.log(item)
			if (this.id === 2) {
				// 员工的
				if (item.id === 4) {
					console.log('选择角色')
					this.roleShow = true
				}

				if (item.id === 5) {
					uni.navigateTo({
						url: '/pages/packageC/select-store/select-store'
					})
				}
			} else {
				console.log('店铺的')
			}
		},

		onSelectShop(e) {
			this.curShop = e
			console.log(e)
			this.shopShow = false
			this.objItem[this.id].data[4].value = e.name
		},

		getAllId(v) {
			console.log('所有id', v)
			this.allIdStr = v
		},

		onSelectRole(e) {
			console.log('选择了角色', e)
			let obj = e.value[0]
			this.roleShow = false
			this.objItem[this.id].data[3].value = obj.name
			this.curRole = obj
		},
		saveData() {
			console.log('保存')
			if (this.id === 1) {
				this.shopOpt()
			} else {
				this.staffOpt()
			}
		},
		async getList() {
			const { data } = await getRoleList({
				apiName: 'role',
				currentPage: 1,
				pageSize: 100
			})

			this.roleList = [data.rows]
			console.log(data)
		},
		// 店铺增加更新
		async shopOpt() {
			let reqObj = {}
			this.objItem[this.id].data.forEach((e) => {
				if (e.key) {
					reqObj[e.key] = e.value
				}
			})
			console.log(reqObj)

			reqObj['apiName'] = 'depot'

			if (this.isUpdate) {
				reqObj['id'] = this.updateId
			}

			const Fn = this.isUpdate ? updateShopDataDeopt : addShopDataDeopt
			const { data } = await Fn(reqObj)
			console.log(data)
			uni.showToast({
				title: '操作成功',
				icon: 'none'
			})

			uni.navigateBack()
		},

		// 员工增加更新
		async staffOpt() {
			let reqObj = {}
			this.objItem[this.id].data.forEach((e) => {
				if (e.key) {
					reqObj[e.key] = e.value
				}
			})
			console.log(reqObj)

			if (!this.curRole.id) {
				uni.showToast({
					title: '请选择角色',
					icon: 'none'
				})
				return
			}

			if (!this.allIdStr) {
				uni.showToast({
					title: '请选择所属门店',
					icon: 'none'
				})
				return
			}

			reqObj['depotIds'] = this.curShop.id || this.allIdStr
			reqObj['roleId'] = this.curRole.id

			if (this.isUpdate) {
				reqObj['id'] = this.updateId
			}

			const Fn = this.isUpdate ? updateUserData : addUserData
			const { data } = await Fn(reqObj)

			uni.showToast({
				title: '操作成功',
				icon: 'none'
			})

			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.box {
	background-color: #fff;
	padding: 10rpx 40rpx;
}
</style>
