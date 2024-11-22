<template>
	<view :class="isFix ? 'fixed' : ''">
		<AppletHeader :autoBack="false" @leftClick="handleClick" title="经营概况" left-icon="account" right-icon=" "></AppletHeader>
		<view class="">
			<custom-dropdown @selectStore="selectStore" @selectTime="selectTime"></custom-dropdown>
			<view class="nav">
				<view class="set-title">
					<view class="flex flex-items-center" @click="show = !show">
						<text style="font-weight: 600;">关键数据</text>
						<view class="ml5">
							<u-icon :name="show ? eyeOpenIcon : eyeCloseIcon" color="#fff" size="24"></u-icon>
						</view>
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
					<view class="tip">
						<view class="flex" @click="salesVisible = true">
							<text class="ml5 mr10">{{salesName}}</text>
							<u-icon name="arrow-down-fill" size="14" color="#c0c4cc"></u-icon>
						</view>
						
						<view class="tip-text">
							<text @click="toggleCurrentDay(true)" :class="currSeven ? 'active' : ''">近7天</text>
							<text @click="toggleCurrentDay(false)" :class="!currSeven ? 'active ml10' : 'ml10'">近30天</text>
						</view>
					</view>
					<view class="chart-container">
						<!-- timeType = 3 是按月查询   1是按日期yyyy-mm-dd 查询 -->
							<block v-if="timeType === 1">
								<qiun-data-charts
								      type="area"
								      :opts="areaOptions"
									  :ontouch="true"
									  :onmovetip="true"
									  :tooltipShow="true"
								      :chartData="chartData"
								    />
							</block>
							
							<block v-if="timeType === 3">
								<qiun-data-charts type="line"
									:opts="lineOptions" 
									:chartData="monthChartData"
								/>
							</block>
					</view>
				</view>
				<view class="white mb20 commodity">
					<view class="flex flex-items-center">
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


		<user-popup :visible="modalVisible" @close="close"></user-popup>
		<u-picker @cancel="salesVisible = false" @confirm="onSalesConfirm" :show="salesVisible" keyName="label" :columns="columns"></u-picker>
	</view>
</template>

<script>
import CustomDropdown from '@/components/CustomDropdown/CustomDropdown.vue'
import UserPopup from '@/components/UserPopup/UserPopup.vue'
import { getBusinessOverview } from '@/apis'
import { formatMoney, formatTimestamp, timestampToDate } from '@/utils/index.js'
export default {
	components: {
		CustomDropdown,
		UserPopup
	},
	data() {
		return {
			eyeOpenIcon: 'https://haoxianhui.com/hxh/2024/11/22/acb0e5cdaa8643f58d8ecc8c1f452036.png',
			eyeCloseIcon: 'https://haoxianhui.com/hxh/2024/11/22/be34236133d44cb28f58a828d5659408.png',
			columns: [[{ label: '销售额', value: 1 },
				{ label: '销售笔数', value: 2 },
				{ label: '销售毛利', value: 3 },
				{ label: '资金收入', value: 4 }]],
			salesVisible: false,
			currSeven: true, 
			isFix: false,
			modalVisible: false,
			formatMoney,
			show: true,
			lastTime: '',
			time: '',
			timeType: 1,
			salesTrendsType1: 1,
			// 店铺ID 默认是0 表示全部
			depotId: 0,
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
			// userInfo: {
			// 	username: '王'
			// },
			chartData: {},
			monthChartData: {},
			lineOptions: {
				dataLabel: false,  //是否显示图表区域内数据点上方的数据文案
				dataPointShape:false, //是否显示数据点的图形标识
				color: ['#F06822', '#336EEE'],
				xAxis: {
					labelCount: 7, // 数据点文字（刻度点）单屏幕限制显示的数量
				},
				extra:{
					line:{
						type:'curve', // 可选值："straight"尖角折线模式,"curve"曲线圆滑模式,"step"时序图模式
					},
				}
			},
			areaOptions: {
				dataLabel: false,  //是否显示图表区域内数据点上方的数据文案
				dataPointShape:false, //是否显示数据点的图形标识
				legend: { // 图例配置
					show: false // 不显示
				},
				xAxis: {
					labelCount: 7, // 数据点文字（刻度点）单屏幕限制显示的数量
				},
				extra:{ 
					area:{
						type:'curve', // 可选值："straight"尖角折线模式,"curve"曲线圆滑模式,"step"时序图模式
						gradient:true, // 是否开启区域图渐变色
					},
				}
			},
		}
	},
	onLoad() {
		this.time = timestampToDate(Date.now())
		// this.userInfo = uni.getStorageSync('userInfo')
		this.getData()
	},
	onShow() {
		uni.removeStorageSync('screenData')
		uni.removeStorageSync('goodsUpdate')
		uni.removeStorageSync('selectList')
		uni.removeStorageSync('goodsInfo')
	},
	onReady() {
	},
	computed: {
		salesName() {
		    let item = this.columns[0].filter(item => item.value === this.salesTrendsType1)[0];
			console.log('item', item)
		    return item ? item.label : ''; // 如果找不到，返回空字符串或其他默认值
		}
	},
	methods: {
		onSalesConfirm(e) {
			console.log(e.value[0].value)
			let id = e.value[0].value
			this.salesTrendsType1 = id 
			this.salesVisible = false
			this.getData()
		},
		toggleCurrentDay(val) {
			this.currSeven = val
			this.getData()
		},
		selectStore(e) {
			this.isFix = true
			console.log(e)
			this.depotId = e.id
			this.getData()
		},
		selectTime(e) {
			console.log(e)
			if (e.mode === 'date') {
				this.time = timestampToDate(e.value)
				this.timeType = 1
			} else {
				this.time = timestampToDate(e.value, 2)
				this.timeType = 3
			}

			this.getData()
		},

		open() {
			this.isFix = true
		},
		close() {
			this.isFix = false
			this.modalVisible = false
		},
		handleClick() {
			this.modalVisible = true
		},
		gotoBestSellers() {
			uni.navigateTo({
				url: '/pages/packageA/hot-selling/hot-selling'
			})
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
				timeType: this.timeType,
				time: this.time,
				depotId: this.depotId || '',
				salesTrendsType1: this.salesTrendsType1,
				salesTrendsType2: this.currSeven ? 1 : 2
			})

			let { keyData, hotSellingGoods, employeePerformance, salesTrends } = data || {}

			this.reportData[0].num = keyData.nowCapitalIncome || 0
			this.reportData[0].value = keyData.preCapitalIncome || 0
			this.reportData[1].num = keyData.nowSalesCount || 0
			this.reportData[1].value = keyData.preSalesCount || 0
			this.reportData[2].num = keyData.nowGrossProfit || 0
			this.reportData[2].value = keyData.preGrossProfit || 0
			this.reportData[3].num = keyData.nowSalesRevenue || 0
			this.reportData[3].value = keyData.preSalesRevenue || 0
			this.lastTime = keyData.lastCreateTime || formatTimestamp(Date.now())
			console.log('data', data)

			this.pelpop = employeePerformance.map((item) => ({
				...item,
				progress: Math.floor(item.salesProportion * 100)
			}))
			this.hotList = hotSellingGoods
			
			// salesTrends
			//  = []
			
			if (this.timeType === 1) {
				let eacherData = this.currSeven ? salesTrends[0] : salesTrends[1]
				
				let categories = eacherData?.map(item => item.x.slice(-2))
				let series = eacherData?.map(item => item.y)
				let res = {
				    categories,
				    series: [
				      {
				        name: "",
				        data: series
				      },
				    ]
				  };
				this.chartData = JSON.parse(JSON.stringify(res));
			}
			
			
			
			if (this.timeType === 3) {
				// 处理月维度图表数据
				let monthChartData = {
					categories: [],
					series: [{
						legendShape: 'circle',
						name: '上月',
						data: []
					}, {
						legendShape: 'circle',
						name: '本月',
						data: []
					}]
				}
				// 填充categories数组 01 - 31
				monthChartData.categories = Array.from({ length: 31 }, (_, index) => {
				    const day = index + 1;
				    return day < 10 ? '0' + day : String(day);
				});
				// 填充上月数据
				monthChartData.series[0].data = Array.from({ length: 31 }, (_, index) => {
				    const dataItem = data.salesTrends[1][index];
				    return dataItem ? dataItem.y : 0; // 如果数据存在则使用y值，否则补充0
				});
				// 填充本月数据
				monthChartData.series[1].data = Array.from({ length: 31 }, (_, index) => {
				    const dataItem = data.salesTrends[0][index];
				    return dataItem ? dataItem.y : 0; // 如果数据存在则使用y值，否则补充0
				});
				this.monthChartData = monthChartData;
			}
			
			
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

// .modal {
// 	padding: 200rpx 30rpx;
// 	width: 580rpx;
// 	&-content {
// 		background-color: #fff;
// 		border-radius: 10rpx;
// 		margin-top: 40px;
// 		.item {
// 			color: #606266;
// 			padding: 26rpx 32rpx;
// 			display: flex;
// 			align-items: center;
// 			line-height: 2;
// 			justify-content: space-between;
// 			.icon-text {
// 				font-size: 26rpx;
// 				color: #ccc;
// 			}
// 		}
// 	}
// }

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
		.tip {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 20px auto;
			&-text {
				color: #93969D;
			}
			.active {
				color: #1D73FF;
			}
		}
	}
	
	.chart-container {
		width: 100%;
		height: 400rpx;
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
