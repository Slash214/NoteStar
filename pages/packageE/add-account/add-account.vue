<template>
	<view>
		<AppletHeader
			:title="isUpdate ? '修改普通账号' : '新增普通账号'"
			@rightClick="rightClick"
			right-icon="保存"
			right-icon-size="14"
		></AppletHeader>
		<view class="box">
			<u--form labelWidth="93" :labelStyle="{ fontSize: '14px', lineHeight: 2 }">
				<u-form-item label="账户名称" required borderBottom>
					<u--input placeholder="请输入" border="none" v-model="name"></u--input>
				</u-form-item>
				<u-form-item label="银行名称" borderBottom>
					<u--input placeholder="请输入" border="none" v-model="bankName"></u--input>
				</u-form-item>
				<u-form-item label="银行卡号" borderBottom>
					<u--input placeholder="请输入" border="none" v-model="bankNumber"></u--input>
				</u-form-item>
				<u-form-item label="所属门店" required borderBottom>
					<view class="flex flex-between flex-items-center" @click="showShop">
						<text>请选所属门店</text>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="备注">
					<u--input placeholder="请输入" border="none" v-model="remark"></u--input>
				</u-form-item>
			</u--form>
		</view>

		<u-popup :show="show" @close="close" height="50%">
			<view class="main">
				<u-button text="确定" type="primary" @click="onClickSelect"></u-button>
				<view style="margin-bottom: 20px"></view>
				<u-checkbox-group v-model="checkboxValue1" placement="column" @change="checkboxChange">
					<u-checkbox
						:customStyle="{ marginBottom: '20px' }"
						v-for="(item, index) in list"
						:key="index"
						:label="item.name"
						:name="item.id"
					></u-checkbox>
				</u-checkbox-group>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { addAccountItem, getDepotByUserId } from '@/apis'
export default {
	data() {
		return {
			name: '', // 账户名称
			bankName: '', // 银行名称
			bankNumber: '', // 银行卡号
			depotIds: '', // 所属门店，如："1,2,3"
			remark: '', // 备注

			isUpdate: false,
			show: false,
			list: [],
			checkboxValue1: []
		}
	},
	methods: {
		checkboxChange(e) {
			console.log(e)
		},
		close() {
			this.show = false
			this.checkboxValue1 = []
		},

		onClickSelect() {
			this.show = false
			console.log(this.checkboxValue1)
		},
		async getList() {
			const user = uni.getStorageSync('userInfo')
			const { data } = await getDepotByUserId({ userId: user.id })
			console.log(data)
			this.list = data.map((item) => ({
				name: item.name,
				id: item.id
			}))
		},
		async rightClick() {
			console.log(1)
			// 先判断是否为空
			if (!this.name) {
				this.toast('账号名称不能为空')
				return
			}
			if (!this.bankName) {
				this.toast('银行名称不能为空')
				return
			}
			if (!this.bankNumber) {
				this.toast('银行卡号不能为空')
				return
			}
			
			if (!this.checkboxValue1.length) {
				this.toast('请选择店铺')
				return
			}

			let depotIds = this.checkboxValue1.join(',')
			await addAccountItem({
				bankName: this.bankName,
				bankNumber: this.bankNumber,
				depotIds,
				name: this.name,
				remark: this.remark
			})

			uni.showToast({
				title: '操作成功',
				icon: 'none'
			})

			uni.navigateBack()
		},
		showShop() {
			this.show = true
		},
		toast(title) {
			uni.showToast({
				title,
				icon: 'none'
			})
		}
	},
	onLoad(options) {
		console.log('opt', options)
		this.isUpdate = +options.type === 2
		console.log('isUpdate', this.isUpdate)
		this.getList()
		
		
		if (this.isUpdate) {
			const obj = uni.getStorageSync('fixData')
			console.log(obj)
			this.name = obj.name
			this.bankName = obj.bankName
			this.bankNumber = obj.bankNumber
			this.remark = obj.remark
			// this.checkboxValue1 = obj.
		}
		
	}
}
</script>

<style lang="scss" scoped>
.box {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 0 40rpx;
	margin-bottom: 17rpx;
}

.main {
	padding: 20rpx;
}
</style>
