<template>
	<view>
		<u-navbar placeholder :autoBack="true" bgColor="rgba(255,255,255,0)">
			<view class="nav-content" slot="center">
				<text @click="currIndex = 1" :class="currIndex === 1 ? 'active' : ''">收入</text>
				<text @click="currIndex = 2" :class="currIndex === 2 ? 'active' : ''">支出</text>
			</view>
		</u-navbar>

		<view class="container">
			<view class="box">
				<u--form labelPosition="left" labelWidth="100">
					<u-form-item v-for="item of formList" :key="item.id" 
					:required="item.required" :label="item.title" prop="item.id" borderBottom @click="handleClick(item)">
						<u--input  :readonly="item.right" v-model="item.value" :suffixIcon="item.right" border="none"></u--input>
					</u-form-item>
				</u--form>
			</view>

			<view class="box remark">
				<u--text text="备注" margin="10px"></u--text>
				<u--textarea border="none" v-model="remark" placeholder="请输入内容"></u--textarea>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 1 收入   2是 支出
			currIndex: 1,
			remark: '',
			formList: [
				{ id: 1, title: '收入金额', required: true, value: '', right: '' },
				{ id: 2, title: '账户', required: true, value: '', right: 'arrow-down-fill' },
				{ id: 3, title: '收入类型', required: true, value: '', right: 'arrow-down-fill' },
				{ id: 4, title: '时间', required: false, value: '', right: 'arrow-down-fill' },
				{ id: 5, title: '业务员', required: true, value: '', right: 'arrow-down-fill' }
			]
		}
	},
	onLoad() {},
	methods: {
		handleClick(item) {
			console.log(item)
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
	}
	
	.remark {
		padding: 20rpx;
	}
}
</style>
