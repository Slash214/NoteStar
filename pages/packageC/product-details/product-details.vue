<template>
	<view>
		<AppletHeader title="商品详情" right-icon="edit-pen" :right-icon-size="24" @rightClick="rightClick"></AppletHeader>
		<view class="container">
			<view class="box">
				<u--text bold size="18" :text="objItem.name"></u--text>
				<view class="mt10 mb10">
					<text>条形码：</text>
					<text>{{ objItem.mbarCode }}</text>
				</view>
				<view class="imgList">
					<view class="img-item" v-for="(item, key) in imgList" :key="key">
						<u--image :src="item" :showLoading="true" width="60px" height="60px"></u--image>
					</view>
				</view>
			</view>
			<u--text margin="10px 0" bold text="价格和库存"></u--text>
			<view class="box">
				<view class="box-item">
					<text>进货价：</text>
					<view>￥{{ formatMoney(objItem.purchaseDecimal) }} / 件</view>
				</view>
				<view class="box-item">
					<text>零售价：</text>
					<view>￥{{ formatMoney(objItem.commodityDecimal) }} / 件</view>
				</view>
				<view class="box-item">
					<text>批发价：</text>
					<view>￥{{ formatMoney(objItem.wholesaleDecimal) }} / 件</view>
				</view>
				<view class="box-item flex-between">
					<view class="flex">
						<text>当前库存：</text>
						<view @click="gotoList" style="flex: 1">{{ objItem.stockInfoList && objItem.stockInfoList.length }}个仓库，共{{ objItem.stock || 0 }}件</view>
					</view>
					<view @click="gotoList">
						<u-icon name="arrow-right"></u-icon>
					</view>
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
import { formatMoney } from '@/utils'
export default {
	data() {
		return {
			id: 0,
			objItem: {},
			formatMoney,
			imgList: []
		}
	},
	onLoad(options) {
		const { id } = options
		this.id = id
		this.getData()
	},
	methods: {
		rightClick() {
			console.log('编辑商品')
			const { stockInfoList, ...newObject } = this.objItem
			uni.setStorageSync('editData', newObject)
			uni.navigateTo({
				url: '/pages/packageD/set-product/set-product?isUpdate=true'
			})
		},
		async getData() {
			const { data } = await getMaterById({ id: this.id })
			console.log(data)
			this.imgList = data.imgName.split(',') || []
			this.objItem = data
		},
		gotoList() {
			console.log('列表', this.objItem.stockInfoList)
			let data = this.objItem.stockInfoList || []
			uni.setStorageSync('shopList', data)
			uni.navigateTo({
				url: '/pages/packageD/shop-stock/shop-stock'
			})
		},
		onOpenOrder() {
			uni.navigateTo({
				url: '/pages/packageB/set-form/set-form?type=1'
			})
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
		text {
			width: 200rpx;
		}
	}
}

.remark {
	height: 280rpx;
}

.imgList {
	display: flex;
	flex-wrap: wrap;
	.img-item {
		width: 60px;
		height: 60px;
		border-radius: 15rpx;
		overflow: hidden;
		margin: 0 8px 8px 0;
	}
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
