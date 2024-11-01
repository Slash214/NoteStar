<template>
	<view>
		<AppletHeader title="新增普通账号" @rightClick="rightClick" right-icon="保存" right-icon-size="14"></AppletHeader>
		<view class="box">
			<u--form labelWidth="93" :labelStyle="{fontSize: '28rpx', lineHeight: 2}">
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
					<u--input placeholder="请输入" border="none" v-model="depotIds"></u--input>
				</u-form-item>
				<u-form-item label="备注">
					<u--input placeholder="请输入" border="none" v-model="remark"></u--input>
				</u-form-item>
			</u--form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '', // 账户名称
				bankName: '', // 银行名称
				bankNumber: '', // 银行卡号
				depotIds: '', // 所属门店，如："1,2,3"
				remark: '', // 备注
			};
		},
		methods: {
			rightClick() {
				console.log(1)
			}
		},
		onLoad() {
			
		},
	}
</script>

<style lang="scss" scoped>
	.box {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 0 40rpx;
		margin-bottom: 17rpx;
	}
</style>