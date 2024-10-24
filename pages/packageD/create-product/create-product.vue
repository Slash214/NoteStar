<template>
	<view>
		<AppletHeader title="新增商品" right-icon="保存" @rightClick="handleRightClick"></AppletHeader>
		<view class="container">
			<view class="box">
				<u--form labelPosition="left" labelWidth="80">
					<u-form-item required label="商品名称" borderBottom>
						<u--input v-model="name" border="none" placeholder="请输入"></u--input>
					</u-form-item>
					<u-form-item label="门店" borderBottom>
						<u--input v-model="name" border="none"></u--input>
					</u-form-item>
					<u-form-item label="商品图片" borderBottom>
						<u--input v-model="name" border="none"></u--input>
					</u-form-item>
				</u--form>
			</view>

			<view class="box"></view>

			<view class="box">
				<u--form labelPosition="left" labelWidth="60">
					<u-form-item label="进货价" borderBottom>
						<u--input prefixIcon="$" v-model="name" border="none" placeholder="0.00"></u--input>
					</u-form-item>
					<u-form-item label="零售价" borderBottom>
						<u--input prefixIcon="$" v-model="name" placeholder="0.00" border="none"></u--input>
					</u-form-item>
					<u-form-item label="批发价" borderBottom>
						<u--input prefixIcon="$" v-model="name" border="none" placeholder="0.00"></u--input>
					</u-form-item>
				</u--form>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		handleRightClick() {
			console.log('保存')
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	.box {
		border-radius: 20rpx;
		background: #fff;
		padding: 0 40rpx;
		margin-bottom: 17rpx;
		line-height: 2;
	}
}
</style>
