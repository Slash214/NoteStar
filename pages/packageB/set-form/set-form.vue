<template>
	<view class="main">
		<AppletHeader :title="type === 1 ? '销售单' : '进货单'"></AppletHeader>
		<view class="container">
			<view class="white box">
				<view class="box-item">
					<view class="box-item-start">*门店</view>
					<view class="box-item-mid">店铺名称</view>
					<view class="box-item-end">
						<u-icon name="arrow-down-fill" color="#c0c4cc" size="13"></u-icon>
					</view>
				</view>
			</view>
			<view class="white box mt20">
				<view class="box-item" v-for="item in serviceList" :key="item.id">
					<view class="box-item-start">{{ item.title }}</view>
					<view class="box-item-mid">{{ item.value }}</view>
					<view class="box-item-end">
						<u-icon :name="item.icon" color="#c0c4cc" size="13"></u-icon>
					</view>
				</view>
			</view>
			<view class="white box store mt20">
				<view class="flex flex-items-center" @click="selectProduct">
					<image mode="widthFix" style="width: 50rpx" src="@/static/purchase/icon-select.png"></image>
					<text class="ml10">选择商品</text>
				</view>
				<view class="flex flex-items-center" @click="scanToAdd">
					<image mode="widthFix" style="width: 50rpx" src="@/static/purchase/icon-scan.png"></image>
					<text class="ml10">扫码添加</text>
				</view>
			</view>

			<view class="white box mt20">进货商品浏览</view>

			<view class="white box mt20">
				<view class="box-item" v-for="item in priceList" :key="item.id">
					<view class="box-item-start">{{ item.title }}</view>
					<view class="box-item-mid">{{ item.value }}</view>
					<view class="box-item-end">
						{{ item.end }}
					</view>
				</view>
			</view>

			<view class="white box mt20">
				<text>备注</text>
				<u--textarea v-model="value1" placeholder="请输入内容"></u--textarea>
			</view>
		</view>

		<fixed-bottom height="100px">
			<view class="bottom-content flex flex-items-center flex-between">
				<view class="">
					<view class="flex flex-items-center">
						<text>应付：</text>
						<u--text mode="price" text="784848" color="#FA6400"></u--text>
					</view>
					<view class="flex flex-items-center mt5">
						<text>本次实付：</text>
						<u--text mode="price" text="0" color="#ccc"></u--text>
					</view>
				</view>

				<view class="red-button">保存</view>
			</view>
		</fixed-bottom>
	</view>
</template>

<script>
import FixedBottom from '@/components/FixedBottom/FixedBottom.vue'
import { getDepotByUserId, getUserByDepotId, getAccountByDepotId } from '@/apis'
export default {
	components: {
		FixedBottom
	},
	data() {
		return {
			type: 1,
			serviceList: [
				{ id: 1, title: '*供应商', value: '', icon: 'arrow-down-fill' },
				{ id: 2, title: '时间', value: '', icon: 'arrow-down-fill' },
				{ id: 3, title: '*业务员', value: '', icon: 'arrow-down-fill' }
			],
			priceList: [
				{ id: 1, title: '整单折扣', value: '0', end: '%' },
				{ id: 2, title: '优惠金额', value: '0', end: '' },
				{ id: 3, title: '折后金额', value: '0', end: '' },
				{ id: 4, title: '运费', value: '0', end: '' }
			]
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
		},
		selectProduct() {
			console.log('选择商品')
			uni.navigateTo({
				url: '/pages/packageC/add-stock/add-stock'
			})
		},
		scanToAdd() {
			console.log('扫码添加')
		}
	}
}
</script>

<style scoped lang="scss">
.main {
	padding-bottom: 120px;
}

.white {
	background-color: #fff;
	border-radius: 20rpx;
}

.box {
	padding: 0 40rpx;
	width: 100%;
	font-size: 28rpx;
	&-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #303133;
		&-start {
			width: 100px;
		}
		&-mid {
			flex: 1;
		}
		&-end {
		}
	}
}

.bottom-content {
	padding: 32rpx;

	.red-button {
		width: 180rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		background: linear-gradient(to right, #fa6400, #f79151);
		border-radius: 20rpx;
		color: #fff;
		font-weight: 700;
	}
}

.store {
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
	position: relative;
	font-weight: 600;
	&::after {
		position: absolute;
		content: ' ';
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 1rpx;
		height: 30rpx;
		background-color: #ccc;
	}
}
</style>
