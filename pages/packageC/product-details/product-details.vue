<template>
	<view>
		<AppletHeader title="商品详情" right-icon="edit"></AppletHeader>
		<view class="container">
			<view class="box">
				<u--text bold size="18" :text="objItem.name"></u--text>
				<view class="mt10 mb10">
					<text>条形码：</text>
					<text>{{ objItem.mbarCode }}</text>
				</view>
				<view class="">
					<u--image :showLoading="true" :src="objItem.imgName" width="60px" height="60px"></u--image>
				</view>
			</view>
			<u--text margin="10px 0" bold text="价格和库存"></u--text>
			<view class="box">
				<view class="box-item">
					<text>进货价：</text>
					<u--text mode="price" :text="objItem.purchaseDecimal"></u--text>
				</view>
				<view class="box-item">
					<text>零售价：</text>
					<u--text mode="price" :text="objItem.commodityDecimal"></u--text>
				</view>
				<view class="box-item">
					<text>批发价：</text>
					<u--text mode="price" :text="objItem.wholesaleDecimal"></u--text>
				</view>
				<view class="box-item">
					<text>当前库存：</text>
					<view style="flex: 1">{{ objItem.stockInfoList && objItem.stockInfoList.length }}个仓库，共{{ objItem.stock || 0 }}件</view>
				</view>
			</view>
			<u--text margin="10px 0" bold text="其他信息"></u--text>
			<view class="box remark">
				<u--text text="备注:"></u--text>
			</view>
		</view>

		<view class="fixed-bottom flex flex-items-center flex-center" @click="onOpenOrder">
			<view class="button">开单</view>
		</view>
	</view>
</template>

<script>
import { getMaterById } from '@/apis'
export default {
	data() {
		return {
			id: 0,
			objItem: {}
		}
	},
	onLoad(options) {
		const { id } = options
		this.id = id
		this.getData()
	},
	methods: {
		async getData() {
			const { data } = await getMaterById({ id: this.id })
			console.log(data)
			this.objItem = data
		},
		onOpenOrder() {
			console.log('开单')
		}
	}
}
</script>

<style scoped lang="scss">
.box {
	border-radius: 20rpx;
	background: #fff;
	padding: 25rpx;
	margin-bottom: 17rpx;

	&-item {
		display: flex;
		height: 70rpx;
		align-items: center;
		justify-content: space-between;
		text {
			width: 200rpx;
		}
	}
}

.remark {
	height: 280rpx;
}

.button {
	width: 240rpx;
	height: 90rpx;
	background: linear-gradient(to right, #5fcadd, #6adae8);
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-weight: 700;
}
</style>
