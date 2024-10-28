<template>
	<view>
		<AppletHeader title="新增员工" right-icon="保存"></AppletHeader>
		<view class="box">
			<u--form labelPosition="left" :model="model1" ref="uForm">
				<u-form-item label="员工名称" prop="userInfo.name" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.name" border="none"></u--input>
				</u-form-item>
				<u-form-item label="员工名称" prop="userInfo.name" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.name" border="none"></u--input>
				</u-form-item>
				<u-form-item label="手机号" prop="userInfo.name" borderBottom ref="item1">
					<u--input v-model="model1.userInfo.name" border="none"></u--input>
				</u-form-item>
			</u--form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
.box {
	background-color: #fff;
}
</style>