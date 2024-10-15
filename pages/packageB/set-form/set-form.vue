<template>
	<view class="main">
		<AppletHeader :title="type === 1 ? '销售单' : '进货单'"></AppletHeader>
		<view class="container">
			<view class="white box">
				<u-form-item label="门店" :required="true" label-width="93" borderBottom>
					<u--input style="width: 100%" v-model="value" disabled disabledColor="#ffffff" placeholder="请选择性别" border="none"></u--input>
					<u-icon slot="right" name="arrow-down-fill"></u-icon>
				</u-form-item>
			</view>

			<view class="white box mt20">
				<u-form-item label="供应商" :required="true" label-width="180">
					<text>零散供应商</text>
				</u-form-item>
				<u-form-item label="时间" label-width="180" borderBottom>
					<view class="hxh-input-row" @click="openPicker">
						<text :style="{ flex: 1, color: form.operTime ? '' : '#898991' }">
							{{ form.operTime ? form.operTime : '请选择时间' }}
						</text>
						<u-icon name="arrow-right" color="#ccc"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="业务员" :required="true" label-width="180" borderBottom>
					<view class="hxh-input-row">
						<u-input type="select" :select-open="selectShow" v-model="form.selectedStaff.name" placeholder="请选择业务员" @click="openSelect('staff')"></u-input>
					</view>
				</u-form-item>
			</view>
		</view>
	</view>
</template>

<script>
import { getDepotByUserId, getUserByDepotId, getAccountByDepotId } from '@/apis'
export default {
	data() {
		return {
			type: 1
		}
	},
	onLoad(options) {
		this.type = +options?.type || 1
		console.log('参数', options)
		this.getData()
	},
	methods: {
		async getData() {
			const user = uni.getStorageSync('userInfo')
			const [r1, r2, r3] = await Promise.all([getDepotByUserId({ userId: user.id }), getUserByDepotId({ depotId: 1 }), getAccountByDepotId({ depotId: 1 })])

			console.log('请求的数据', r1, r2, r3)
		}
	}
}
</script>

<style scoped lang="scss">
.white {
	background-color: #fff;
	border-radius: 20rpx;
}

.box {
	padding: 0 40rpx;
	width: 100%;
}
</style>
