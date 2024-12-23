<template>
	<view>
		<AppletHeader title="商品库存" right-icon=" "></AppletHeader>
		<view class="main">
			<view class="select" @click="show = true">
				<text class="mr5">{{curStore.name}}</text>
				<u-icon color='#999' name="arrow-down-fill" size="8"></u-icon>
			</view>
			
			
			<select-shop @cancel="show = false"  @confirm="onConfirm" :show="show"></select-shop>
			
			<view class="box u-border-bottom">
				<view class="flex flex-items-center">
					<view class="image-box">
						<image :src="objItem.materialInfo.imgName" mode="aspectFit"></image>
					</view>
					<view class="ml20">
						<u--text bold :text="objItem.materialInfo.name"></u--text>
						<u--text
							margin="10px 0 0 0"
							color="#999"
							:text="'条形码:' + objItem.materialInfo.barCode"
						></u--text>
					</view>
				</view>
			</view>
			<view class="card flex flex-between flex-items-center">
				<view class="card-item" v-for="item in list" :key="item.id">
					<text>{{ item.name }}</text>
					<text class="mt5">{{ item.value }}</text>
				</view>
			</view>

			<view class="container">
				<view class="tab">
					<view
						v-for="item in tabItem"
						:key="item.id"
						:class="curId === item.id ? 'active tab-item' : 'tab-item'"
						@click="handleTab(item)"
					>
						{{ item.name }}
					</view>
				</view>

				<view class="content">
					<block v-if="curId === 1">
						<view class="material-item" v-for="item in distributionList" :key="item.materialId">
							<u--text margin="0 0 10px 0" :text="item.depotName" bold></u--text>
							<u--text :text="'总库存: ' + item.currentNumber"></u--text>
						</view>
					</block>
					<block v-else>
						<view class="flows" v-for="item in stockFlowsVoList" :key="item.materialId" @click="handleClickDetails(item)">
							<u--text
								color="#9D9EA0"
								:text="formatDateToChinese(item.createTime)"
								margin="0 0 10px 8px"
							></u--text>
							<view class="flows-item">
								<view class="flex flex-between flex-items-center title">
									<text>{{ item.name }}</text>
									<text>{{ item.changeNum }}</text>
								</view>

								<view class="flex flex-between flex-items-center">
									<view class="">
										<u--text color="#737373" margin="0 0 5px 0" :text="item.number"></u--text>
										<u--text color="#737373" :text="item.supplierName"></u--text>
									</view>

									<u--text align="right" :text="'结余' + item.currentNum"></u--text>
								</view>
							</view>
						</view>
						
						<view class="flows">
							<u--text
								color="#9D9EA0"
								text="期初"
								margin="0 0 10px 8px"
							></u--text>
							<view class="flows-item">
								<view class="flex flex-between flex-items-center title">
									<text>存始库存</text>
									<text>0</text>
								</view>

							</view>
						</view>
					
					    <view class="flex flex-items-center flex-center" v-if="!stockFlowsVoList.length">
					    	没有更多了
					    </view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getStockDetail } from '@/apis'
import { formatDateToChinese } from '../../../utils'
import SelectShop from '@/components/SelectShop/SelectShop.vue'

export default {
	components: {
		SelectShop
	},
	data() {
		return {
			show: false,
			curStore: { id: 0, name: '全部门店'},
			formatDateToChinese,
			depotId: '',
			page: 1,
			materialId: 0,
			objItem: {},
			list: [],
			tabItem: [
				{ name: '库存分布', id: 1 },
				{ name: '库存流水', id: 2 }
			],
			curId: 1,

			// 库存分布列表
			distributionList: [],

			// 库存流水
			stockFlowsVoList: []
		}
	},
	onLoad(options) {
		let { id } = options || {}

		this.materialId = id
		console.log(options)
		this.getData()
	},
	onReachBottom() {
		console.log('加载更多')
	},
	methods: {
		handleClickDetails(item) {
			console.log(item)
			let number = item.number
			uni.navigateTo({
				url: `/pages/packageB/sales-order-detail/sales-order-detail?type=2&number=${number}&status=1&id=""`
			})
		},
		onConfirm(e) {
			console.log(e)
			this.curStore = e
			this.depotId = e.id
			this.show = false
			this.getData()
		},
		handleTab(item) {
			this.curId = item.id
		},
		async getData() {
			const { data } = await getStockDetail({
				currentPage: this.page,
				pageSize: 10,
				depotId: this.depotId,
				materialId: this.materialId
			})

			this.objItem = data || {}
			console.log(data)

			let { stockDistributionVoList, stockFlowsVoList } = data || {}

			this.distributionList = [...this.distributionList, ...stockDistributionVoList]
			this.stockFlowsVoList = stockFlowsVoList
			this.list = [
				{ id: 1, name: '库存', value: data.totalStock },
				{ id: 2, name: '成本价（￥）', value: data.costPrice },
				{ id: 3, name: '库存总金额（￥）', value: data.totalCostPrice }
			]
		}
	}
}
</script>

<style scoped lang="scss">
.select {
	height: 41px;
	padding-left: 25rpx;
    display: flex;
	align-items: center;
}	
	
.box {
	background: #fff;
	padding: 25rpx;
	display: flex;
	flex-direction: column;
	.image-box {
		background-color: #cdd7dc;
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		overflow: hidden;
		image {
			width: 100%;
			height: 60px;
		}
	}
}

.card {
	background-color: #fff;
	padding: 25rpx;
	margin-bottom: 30rpx;
	&-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: 30rpx;
	}
}

.tab {
	display: flex;
	margin-bottom: 20px;
	&-item {
		font-size: 36rpx;
		font-weight: 600;
		color: #93969d;
		margin-right: 40rpx;
	}

	.active {
		color: #141414;
		position: relative;
		&::after {
			content: '';
			position: absolute;
			bottom: -3rpx;
			left: 5rpx;
			width: 85%;
			height: 8rpx;
			border-radius: 40rpx;
			background: linear-gradient(to right, #5fcadd, #e5f0f6);
			border-top-left-radius: 20px;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;
			border-bottom-left-radius: 20px;
			background-image: linear-gradient(to right, rgb(95, 202, 221), rgb(229, 240, 246));
			background-position-x: initial;
			background-position-y: initial;
			background-size: initial;
			background-repeat-x: initial;
			background-repeat-y: initial;
			background-attachment: initial;
			background-origin: initial;
			background-clip: initial;
			background-color: initial;
		}
	}
}

.content {
	.material-item {
		width: 100%;
		margin-bottom: 17rpx;
		padding: 25rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}
}

.flows {
	&-item {
		width: 100%;
		margin-bottom: 17rpx;
		padding: 25rpx;
		border-radius: 20rpx;
		background-color: #fff;
		.title {
			font-weight: 700;
			color: #141414;
			font-size: 32rpx;
			margin-bottom: 15px;
		}
	}
}
</style>
