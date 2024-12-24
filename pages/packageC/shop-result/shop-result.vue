<template>
	<view>
		<AppletHeader :autoBack="false" @leftClick="rightClick" :title="statusType === 3 ? '退单成功' : '开单成功'" right-icon="完成" @rightClick="rightClick"
			:right-icon-size="16"></AppletHeader>
		<view class="container">
			<view class="box">
				<view class="top">
					<u--text bold :text="type === 1 ? '销售单' : '进货单'"></u--text>
					<u--text @click="lookDetails" text="查看详情" color="" align="right"></u--text>
				</view>
				<view class="flex middle">
					<u-icon size="24" color="#FA6400" name="account-fill"></u-icon>
					<text>零散供应商</text>
				</view>
				<view class="flex">
					<text>合计金额：</text>
					<u--text mode="price" :text="total"></u--text>
				</view>

				<view class="group-button">
					<view :class="type === 1 ? 'xs-b btns' : 'jh-b btns'" v-if="statusType === 2 && !isT"
						@click="handleClickDep">
						{{ type === 1 ? '转销售' : '转进货'}}
					</view>
					<view :class="type === 1 ? 'xs btns' : 'jh btns'" @click="handleClick">再来一单</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDetailByNumbe
	} from '@/apis/index.js'
	import Big from 'big.js'
	import {
		formatImageArray
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				// 1 销售单  2 进货单
				type: 1,
				orderNumber: "",
				total: 0,
				statusType: 1,
				isT: false,
				cacheData: {}
			}
		},
		onLoad(options) {
			console.log(options)
			this.type = +options?.type || 1
			this.orderNumber = options.orderNum
			this.total = options.total || 0
			this.statusType = +options.status || 1
			this.isT = +options?.isT == 2
		},
		methods: {
			handleClick() {
				console.log('再来一单')
				uni.navigateTo({
					url: `/pages/packageB/set-form/set-form?type=${this.type}`
				})
			},
			lookDetails() {
				console.log('查看详情')
				uni.navigateTo({
					url: `/pages/packageB/sales-order-detail/sales-order-detail?type=${this.type}&number=${this.orderNumber}&status=${this.statusType}`
				})
			},
			rightClick() {
				console.log('完成')

				let url = this.type === 1 ? '/pages/sales/sales' : '/pages/purchase/purchase'
				uni.switchTab({
					url
				})
			},

			// 可以定义一个工具函数，用来将字符串/数值安全转换为 Big 类型
			toBig(value) {
				// 如果你不想要默认 0，可以去掉 || 0
				return new Big(value || 0);
			},

			// 把原始商品信息转成带 Big 对象的结构
			transformToBig(item) {
				return {
					id: item.materialId,
					cover: item.cover,
					imgList: item.imgList,
					mbarCode: item.barCode,
					name: item.name,
					stock: item.stock,
					purchaseDecimal: this.toBig(item.purchaseDecimal),
					commodityDecimal: this.toBig(item.commodityDecimal),
					nums: this.toBig(item.operNumber),
					costPrice: item.costPrice,
					meId: item.meId,
					total: item.allPrice
				};
			},
			// 把带 Big 对象的结构，转成字符串（便于存储）
			bigToString(item) {
				return {
					...item,
					purchaseDecimal: item.purchaseDecimal.toString(),
					commodityDecimal: item.commodityDecimal.toString(),
					nums: item.nums.toString()
				};
			},

			async handleClickDep() {
				uni.showLoading({
					title: '正在查询数据'
				})
				const {
					data
				} = await getDetailByNumbe({
					number: this.orderNumber
				})
				// 1. 先处理图片信息
				const productList = formatImageArray(data.depotHeadMaterialVoList);

				// 2. 拷贝并删除不需要的字段
				const updateData = {
					...data
				};
				delete updateData.depotHeadMaterialVoList;

				// 3. 将每个 item 转换成带 Big 对象的结构
				const selectList = productList.map(this.transformToBig);

				// 4. 转成最终需要存储的字符串结构
				const listToStore = selectList.map(this.bigToString);

				// 5. 分别存储
				uni.setStorageSync('goodsUpdate', updateData);
				uni.setStorageSync('selectList', listToStore);
				uni.setStorageSync('transferOrderList', listToStore);

				// 测试输出
				console.log('selectList(带 Big)：', selectList);
				console.log('listToStore(转成 string)：', listToStore);


				let id = data.id
				uni.hideLoading()
				uni.navigateTo({
					url: `/pages/packageB/set-form/set-form?type=${this.type}&isUpdate=1&id=${id}&status=${this.statusType}`
				})

			},
		}
	}
</script>

<style scoped lang="scss">
	.flex {
		display: flex;
		align-items: center;
	}

	.group-button {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.box {
		border-radius: 20rpx;
		background: #fff;
		padding: 25rpx;
		margin-bottom: 60rpx;
		font-size: 32rpx;

		.top {
			align-items: center;
			display: flex;
		}

		.middle {
			margin: 30rpx 0;
		}

		.btns {
			height: 90rpx;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-weight: 700;
			width: 280rpx;
			margin: 30rpx auto auto auto;
		}

		.xs {
			background: linear-gradient(to right, #5fcadd, #6adae8);
		}

		.jh {
			background: linear-gradient(to right, #fa6400, #f79151);
		}

		.xs-b {
			background-color: #fff;
			color: #5fcadd;
			border: 1rpx solid #5fcadd;
		}

		.jh-b {
			background-color: #fff;
			color: #fa6400;
			border: 1rpx solid #fa6400;
		}
	}
</style>