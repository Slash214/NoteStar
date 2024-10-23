<template>
	<view :class="isFix ? 'fixed' : ''">
		<AppletHeader :isLeftClick="true" @click="handleClick" title="经营情况" left-icon="account" right-icon=" "></AppletHeader>
		<view class="">
			<custom-dropdown></custom-dropdown>
			<view class="nav">
				<view class="set-title">
					<view class="flex flex-items-center" @click="show = !show">
						<text>关键数据</text>
						<u-icon :name="show ? 'eye-fill' : 'eye-off'" color="#fff" size="24"></u-icon>
						<view class="time">
							更新于
							{{ lastTime }}
						</view>
					</view>
				</view>
				<view class="key-data">
					<view class="key-data-item" v-for="item in reportData" :key="item.id">
						<u--text :text="item.title" size="12" color="#ABC4FA"></u--text>
						<view class="price">
							{{ hiddenContent(formatMoney(item.num)) }}
						</view>

						<u--text :text="'昨日 ' + hiddenContent(item.value)" size="12" color="#ABC4FA"></u--text>
					</view>
				</view>
			</view>

			<view class="main">
				<view class="white mb20 echart">
					<u--text bold text="销售趋势" size="17" color="#000"></u--text>
				</view>
				<view class="white mb20 commodity">
					<view class="flex">
						<u--text bold text="商品热销" size="17" color="#000"></u--text>
						<u--text @click="gotoBestSellers" suffixIcon="arrow-right" align="right" text="查看更多" size="13" color="#A0A0A0"></u--text>
					</view>
					<view v-if="!hotList.length">
						<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
					</view>
					<view class="hot">
						<view class="hot-item mb20 flex flex-items-center flex-between" v-for="(item, index) of hotList" :key="index">
							<text class="index">{{ index + 1 }}</text>
							<u--image :showLoading="true" :src="item.imgName" width="60px" height="60px"></u--image>
							<u--text margin="0 5px 0 10px" :text="item.materialName"></u--text>
							<text class="sum">{{ item.sum }}</text>
						</view>
					</view>
				</view>
				<view class="white">
					<view class="flex">
						<u--text bold text="员工业绩" size="17" color="#000"></u--text>
						<u--text @click="gotoEmployeePer" suffixIcon="arrow-right" align="right" text="查看更多" size="13" color="#A0A0A0"></u--text>
					</view>
					<view v-if="!pelpop.length">
						<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
					</view>
					<view class="employee">
						<view class="flex employee-item" v-for="(item, index) in pelpop" :key="index">
							<text class="employee-item-index">{{ index + 1 }}</text>
							<view class="employee-item-content">
								<view class="flex">
									<u--text :text="item.salesManStr"></u--text>
									<u--text align="right" :text="item.salesRevenue" mode="price"></u--text>
								</view>
								<view class="mt10 flex flex-items-center">
									<u-line-progress height="8" :showText="false" style="flex: 1" :percentage="item.progress" activeColor="#E5B840"></u-line-progress>
									<text class="progress-text ml5">{{ item.progress }}%</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-popup :show="modalVisible" bgColor="#F1F5F8" mode="left" width="90%" @close="close" @open="open">
			<view class="modal">
				<view class="flex flex-items-center">
					<u-avatar size="46" :text="userInfo.username.charAt(0) || ''"></u-avatar>
					<u--text size="18" :text="userInfo.username" margin=" 0 0 0 20px"></u--text>
				</view>

				<view class="modal-content">
					<view v-for="(item, index) in popupList" :class="index === 2 ? 'item' : 'item u-border-bottom'" :key="item.id">
						<u--text size="14" bold :text="item.text"></u--text>
						<text class="icon-text">{{ item.right }}</text>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import CustomDropdown from '@/components/CustomDropdown/CustomDropdown.vue'
import { getBusinessOverview } from '@/apis'
import { formatMoney } from '@/utils/index.js'
export default {
	components: {
		CustomDropdown
	},
	data() {
		return {
			isFix: false,
			modalVisible: false,
			formatMoney,
			show: true,
			lastTime: '',
			popupList: [
				{ id: 1, text: '店铺管理', right: '门店 | 员工 >' },
				{ id: 1, text: '消息中心', right: '>' },
				{ id: 1, text: '退出登录', right: '' }
			],
			reportData: [
				{ id: 1, title: '销售额(￥)', num: '', value: '' },
				{ id: 2, title: '笔数', num: '', value: '' },
				{ id: 3, title: '毛利(￥)', num: '', value: '' },
				{ id: 4, title: '资金收入(￥)', num: '', value: '' }
			],
			hotList: [],
			pelpop: [],
			userInfo: {
				username: '王'
			}
		}
	},
	onLoad() {
		this.userInfo = uni.getStorageSync('userInfo')
		this.getData()
	},
	methods: {
		open() {
			this.isFix = true
		},
		close() {
			this.isFix = false
			this.modalVisible = false
		},
		handleClick() {
			console.log('点击右边')
			this.modalVisible = true
		},
		gotoBestSellers() {
			console.log('去商品热销')
		},
		
		
		
		gotoEmployeePer() {
			console.log('员工业绩')
			uni.navigateTo({
				url: '/pages/packageA/employee-per/employee-per'
			})
		},
		hiddenContent(val) {
			if (this.show) return val
			else return '****'
		},
		async getData() {
			const { data } = await getBusinessOverview({
				timeType: 1,
				time: '2024-10-14',
				depotId: '',
				salesTrendsType1: 1,
				salesTrendsType2: 1
			})

			let { keyData, hotSellingGoods, employeePerformance } = data || {}

			this.reportData[0].num = keyData.nowCapitalIncome || 0
			this.reportData[0].value = keyData.preCapitalIncome || 0
			this.reportData[1].num = keyData.nowSalesCount || 0
			this.reportData[1].value = keyData.preSalesCount || 0
			this.reportData[2].num = keyData.nowGrossProfit || 0
			this.reportData[2].value = keyData.preGrossProfit || 0
			this.reportData[3].num = keyData.nowSalesRevenue || 0
			this.reportData[3].value = keyData.preSalesRevenue || 0
			this.lastTime = keyData.lastCreateTime
			console.log('data', data)

			this.pelpop = employeePerformance.map((item) => ({
				...item,
				progress: Math.floor(item.salesProportion * 100)
			}))
			this.hotList = hotSellingGoods
		},
		leftClick() {
			console.log('点击我的')
		}
	}
}
</script>

<style lang="scss" scoped>
.nav {
	height: 600rpx;
	background-color: #1d73ff;
	-webkit-clip-path: ellipse(100% 68% at 50% 30%);
	clip-path: ellipse(100% 68% at 50% 30%);
	color: #fff;
	padding: 40rpx 60rpx;
	.set-title {
		margin-bottom: 20px;
		.time {
			color: #abc4fa;
			font-size: 24rpx;
			margin-left: 10px;
		}
	}

	.key-data {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 1fr;
		grid-column-gap: 40rpx;
		grid-row-gap: 50rpx;
		&-item {
			.price {
				color: #fff;
				font-size: 38rpx;
				font-weight: 600;
				margin: 10rpx 0;
			}
		}
	}
}

.modal {
	padding: 200rpx 30rpx;
	width: 580rpx;
	&-content {
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 40px;
		.item {
			color: #606266;
			padding: 26rpx 32rpx;
			display: flex;
			align-items: center;
			line-height: 2;
			justify-content: space-between;
			.icon-text {
				font-size: 26rpx;
				color: #ccc;
			}
		}
	}
}

.main {
	margin-top: -160rpx;
	padding: 25rpx;
	position: relative;
	z-index: 1;
	.white {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 25rpx;
	}
	.echart {
	}

	.employee {
		margin-top: 20px;
		&-item {
			margin-bottom: 20px;
			&-index {
				font-weight: 700;
				font-size: 18px;
				margin-right: 20px;
			}
			&-content {
				flex: 1;
				.progress-text {
					color: #9d9ea0;
				}
			}
		}
	}

	.hot {
		margin-top: 20px;
		&-item {
			width: 100%;
			.index {
				font-weight: 700;
				margin-right: 20px;
				font-size: 18px;
				text-align: center;
				display: block;
				&:first-child {
					color: #d75546;
				}
			}
			.sum {
				display: block;
				margin-left: 10px;
				color: #575757;
			}
		}
	}
}
</style>
