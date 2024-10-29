<template>
	<view>
		<AppletHeader title="个人信息" right-icon=" "></AppletHeader>
		<view class="box">
			<u--form labelPosition="left" ref="uForm" labelWidth="100">
				<view style="padding: 20rpx;" v-for="item in list" :key="item.id">
					<u-form-item  :label="item.title" borderBottom >
						<u--input readonly placeholder="请输入" v-model="item.value" border="none"></u--input>
						<u-icon slot="right" :name="item.right"></u-icon>
					</u-form-item>
				</view>
			</u--form>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{ id: 1, title: '姓名', value: '1', right: 'arrow-right' },
				{ id: 2, title: '头像', value: '2', right: ' ' },
				{ id: 3, title: '登录账号', value: '3', right: ' ' },
				{ id: 4, title: '所属商户', value: 4, right: ' '},
				{ id: 5, title: '角色', value: '4', right: ' ' }
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.box {
	background-color: #fff;
	padding: 0 25rpx;
}
</style>
