<template>
	<view class="main">
		<!-- objItem[type].name -->
		<AppletHeader :title="objItem[type].statusArray[statusType].name" right-icon=" "></AppletHeader>
		<view :class="shopShow ? 'no-scroll container' : 'container'">
			<view class="white box">
				<!-- 门店列表选择 -->
				<view class="box-item">
					<view class="box-item-start">*门店</view>
					<view class="box-item-mid" @click="storeShow = true">{{ selectedStore.name }}</view>
					<view class="box-item-end" @click="storeShow = true">
						<u-icon name="arrow-down-fill" color="#c0c4cc" size="13"></u-icon>
					</view>
				</view>
			</view>
			<!-- 业务员列表选择 -->
			<!-- 时间选择 -->
			<view class="white box mt10">
				<view :class="item.id <= 2 ? 'box-item u-border-bottom' : 'box-item'" v-for="item in serviceList"
					:key="item.id">
					<view class="box-item-start">{{ item.title }}</view>
					<view class="box-item-mid" @click="serviceClick(item)">{{ item.value }}</view>
					<view class="box-item-end" @click="serviceClick(item)">
						<u-icon :name="item.icon" color="#c0c4cc" size="13"></u-icon>
					</view>
				</view>
			</view>

			<u-picker :closeOnClickOverlay="true" :show="storeShow" @confirm="getSelectStore"
				@cancel="storeShow = false" :columns="[storeList]" keyName="name" @close="storeShow = false"></u-picker>

			<u-picker :show="salesShow" @cancel="salesShow = false" @confirm="getSelectSales" :columns="[salesList]"
				keyName="name" :closeOnClickOverlay="true" @close="salesShow = false"></u-picker>

			<u-datetime-picker ref="datetimePicker" :show="timeShow" v-model="selectedTime.temp" mode="date"
				@confirm="confirmTime" @cancel="timeShow = false" :formatter="formatter" :closeOnClickOverlay="true"
				@close="timeShow = false"></u-datetime-picker>

			<view class="white box store mt10">
				<view class="flex flex-items-center" @click="selectProduct">
					<image mode="widthFix" style="width: 50rpx" :src="staticImageUrl + '/purchase/icon-select.png'">
					</image>
					<text class="ml10">选择商品</text>
				</view>
				<view class="flex flex-items-center" @click="scanToAdd">
					<image mode="widthFix" style="width: 50rpx" :src="staticImageUrl + '/purchase/icon-scan.png'">
					</image>
					<text class="ml10">扫码添加</text>
				</view>
			</view>

			<!-- 商品列表 -->
			<view class="white box mt10 product">
				<view class="product-title">
					<text class="slash" :style="{ backgroundColor: objItem[type].color }"></text>
					<text>{{ type === 1 ? '销售商品' : '进货商品' }}</text>
				</view>

				<view class="product-content">
					<u-swipe-action>
						<u-swipe-action-item :options="options" v-for="(item, index) of productList" :key="item.id"
							:index="index" :name="item.name" ref="items" @click="handleClickAction">
							<view class="swipe-action flex u-border-bottom" @click="handleClickItemSet(item)">
								<view class="image-box">
									<u--image width="60" mode="widthFix" :showLoading="true"
										:src="item.cover"></u--image>
								</view>
								<view class="ml10 swipe-action-content">
									<u--text bold :text="item.name"></u--text>
									<u--text color="#9D9EA0" size="13" :text="item.mbarCode"></u--text>
									<view class="mt10 flex flex-between flex-items-center">
										<view>
											￥{{ formatMoney(item.price) }}
											<text style="padding: 0 4px">x</text>
											{{ item.nums }}
										</view>
										<view>￥{{ formatMoney(item.total) }}</view>
									</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>

				<view class="mt10 product-end">
					<view class="flex flex-items-center">
						<text>合计 已选{{ totalQuantity }}，</text>
						<u--text bold mode="price" :text="totalPrice"></u--text>
					</view>
					<view v-if="type === 1" class="grossProfit flex flex-items-center">
						毛利润：￥{{ grossProfit }}
					</view>
				</view>
			</view>

			<view class="white box mt10">
				<view class="box-item u-border-bottom">
					<view class="box-item-start">整单折扣</view>
					<view class="box-item-mid">
						<u--input placeholder="请输入" v-model="reqData.discount" @change="onPriceChange(1)"
							border="none"></u--input>
					</view>
					<view class="box-item-end">%</view>
				</view>
				<view class="box-item u-border-bottom">
					<view class="box-item-start">优惠金额</view>
					<view class="box-item-mid">
						<u--input placeholder="请输入" v-model="reqData.discountMoney" @change="onPriceChange(2)"
							border="none"></u--input>
					</view>
				</view>
				<view class="box-item u-border-bottom">
					<view class="box-item-start">折后金额</view>
					<view class="box-item-mid">
						<u--input placeholder="请输入" v-model="reqData.discountLastMoney" @change="onPriceChange(3)"
							border="none"></u--input>
					</view>
				</view>
				<view class="box-item">
					<view class="box-item-start">运费</view>
					<view class="box-item-mid">
						<u--input placeholder="请输入" v-model="reqData.otherMoney" @change="onPriceChange(4)"
							border="none"></u--input>
					</view>
				</view>

				<view class="amount">
					<text>应收：￥{{ reqData.changeAmount }}</text>
					<text v-if="type === 1 && statusType === 1" class="btns" @click="applyMoneyAroundDown">
						{{ showMo ? '取消抹零' : '抹零' }}
					</text>
				</view>
				<view class="moneyAroundDown" v-if="type === 1 && statusType === 1">已抹零：{{ reqData.moneyAroundDown }}
				</view>
			</view>

			<view class="white box mt10" style="padding: 40rpx">
				<view class="mb10">备注</view>
				<u--textarea border="none" v-model="reqData.remark" placeholder="在这里输入备注"></u--textarea>

				<u-upload width="60" height="60" :fileList="fileList1" @afterRead="afterRead" @delete="deletePic"
					name="1" multiple :maxCount="6"></u-upload>
			</view>

			<!-- 商品详情弹窗 -->
			<u-popup bgColor="#F1F5F8" :show="shopShow" @close="shopShow = false" :round="10" closeable>
				<view class="modals">
					<view class="flex flex-items-center flex-between modal-header">
						<view class="">
							<u--image :showLoading="true" :src="curShopData.cover" width="60px"
								height="60px"></u--image>
						</view>
						<view class="modal-content-box">
							<u--text margin="0 0 15px 0" :text="curShopData.name" bold></u--text>
							<u--text color="#9D9EA0" :text="curShopData.mbarCode"></u--text>
						</view>

						<view class="stock">库存：{{ curShopData.stock }}</view>
					</view>

					<view class="modal-card">
						<view class="flex flex-items-center">
							<text class="w16">单价</text>
							<u--input border="none" v-model="curShopData.price" @change="onAlonePrice($event, 1)"
								placeholder="请输入内容"></u--input>
						</view>
						<view class="flex flex-items-center">
							<text class="w16">数量</text>
							<u-number-box v-model="curShopData.nums" @change="shopDataChange"></u-number-box>
						</view>
						<view class="flex flex-items-center">
							<text class="w16">总价</text>
							<u--input border="none" v-model="curShopData.total" @change="onAlonePrice($event, 2)"
								placeholder="请输入内容"></u--input>
						</view>
					</view>

					<view class="modal-card">
						<u--text text="备注" size="14"></u--text>
						<u--textarea border="none" v-model="curShopData.remarks" placeholder="请输入内容"></u--textarea>
					</view>

					<view class="abs-button">
						<view class="">
							<view class="money">￥{{ formatMoney(curShopData.total) }}</view>
							<view>种类： 1，数量{{ curShopData.nums }}</view>
						</view>
						<view class="btn flex flex-items-center flex-center" @click="fixOneShopData">确定</view>
					</view>
				</view>
			</u-popup>

			<view class="bottom">
				<view class="">
					<view style="padding-bottom: 10px">
						<text>{{objItem[type].statusArray[statusType].text}}:</text>
						<text style="color: #fa6400; font-size: 32rpx">￥{{ formatMoney(reqData.changeAmount) }}</text>
					</view>
					<view style="color: #9d9ea0">
						<text>{{objItem[type].statusArray[statusType].stext}}:</text>
						<text>￥{{
							statusType === 2 && transferOrderId ? subtractWithTwoDecimals(reqData.changeAmount, goodsUpdate.depositPaid || 0) : formatMoney(reqData.changeAmount)
						}}</text>
					</view>
				</view>

				<view :class="type === 1 ? 'btns xs' : 'btns dj'" @click="onDeposit"
					v-if="statusType === 2 && !transferOrderId">
					{{ type === 1 ? '收订金' : '付订金'}}
				</view>
				<view class="btns" @click="saveData" :style="{ backgroundColor: objItem[type].color }">保存</view>
			</view>


			<u-popup :safeAreaInsetBottom="false" :show="scanModal" @close="toggleScanModal" mode="center" round="15">
				<view class="scan-main">
					<view class="scan-header">
						<u--text text="未查询到商品" size="16" margin="0 0 8px 0" align="center" bold color="#111"></u--text>
						<u--text text="是否新增该商品?" size="14" align="center" color="#898989"></u--text>
					</view>

					<view class="scan-code">
						{{scanCode}}
					</view>

					<view class="scan-group">
						<view class="cancel" @click="toggleScanModal">取消</view>
						<view @click="addNewProduct">新增该商品</view>
					</view>
				</view>
			</u-popup>



			<u-popup :show="depositShow" @close="depositShow = false;" :closeOnClickOverlay="true">
				<view class="deposit">
					<view class="title">
						￥{{ formatMoney(reqData.changeAmount) }}
					</view>
					<view class="subtitle">
						订单总金额
					</view>

					<view class="depositPaid" v-if="goodsUpdate.depositPaid">
						已付订金￥{{formatMoney(goodsUpdate.depositPaid)}}，还需支付￥{{subtractWithTwoDecimals(reqData.changeAmount,goodsUpdate.depositPaid)}}
					</view>

					<view class="inputs">
						<u--text text="订金收款(￥)"></u--text>
						<u--input placeholder="0.00" border="bottom" v-model="curDepositValue"
							:customStyle="{fontSize: '40rpx'}" :placeholderStyle="{fontSize: '40rpx'}"></u--input>
					</view>

					<image @click="handleClickDeposit" class="money" mode="aspectFit"
						src="https://haoxianhui.com/hxh/2024/12/23/e64722f1608e48feabcf8687cb5df31c.png"></image>
					<view class="" @click="handleClickDeposit">
						现金收款
					</view>
				</view>
			</u-popup>
		</view>




	</view>
</template>

<script>
	// type === 1 为销售， 2为进货
	// 销售销售显示抹0 进货不显示
	// 销售销售显示毛利润 进货不显示
	import {
		staticImageUrl,
		IMAGE_OSS_URL,
		UPLOAD_FILE_URL
	} from '@/common/contanst'
	import Big from 'big.js'
	import {
		debounce,
		timestampToDate,
		formatTimestamp,
		formatMoney,
		formatProductData,
		subtractWithTwoDecimals
	} from '@/utils'
	import {
		getDepotByUserId,
		getUserByDepotId,
		getAccountByDepotId,
		addDepotHeadAndDetail,
		genbuildNumber,
		updateDepotHeadAndDetail,
		getMaterialList,
		conversionData
	} from '@/apis'

	export default {
		data() {
			return {
				fileList1: [],
				UPLOAD_FILE_URL,

				subtractWithTwoDecimals,
				IMAGE_OSS_URL,
				curDepositValue: "",
				depositShow: false,
				scanModal: false,
				scanCode: '',
				showMo: false,
				staticImageUrl,
				formatMoney,
				// 是否是更新状态 默认不是
				isUpdate: false,
				type: 1,
				orderNumber: '',
				objItem: {
					1: {
						name: '销售单',
						statusArray: {
							1: {
								name: '销售单',
								type: '出库',
								subType: '零售',
								orderType: 1,
								text: '应付',
								stext: '本次实付'
							},
							2: {
								name: '销售预订单',
								type: '出库',
								subType: '销售预订',
								orderType: 5,
								text: '应收',
								stext: '本次应收'
							},
							3: {
								name: '销售退货单',
								type: '入库',
								subType: '销售退货',
								orderType: 1,
								text: '应付',
								stext: '本次实付'
							},
						},
						showAmount: true,
						showgross: true,
						color: '#5FCADD',
						type: '出库',
						subType: '零售',
						orderType: 1,
					},
					2: {
						name: '进货单',
						orderType: 0,
						statusArray: {
							1: {
								name: '进货单',
								type: '入库',
								subType: '采购',
								orderType: 0,
								text: '应收',
								stext: '本次实收'
							},
							2: {
								name: '进货预订单',
								type: '入库',
								subType: '进货预订',
								orderType: 4,
								text: '应付',
								stext: '本次实付'
							},
							3: {
								name: '进货退货单',
								type: '出库',
								subType: '进货退货',
								orderType: 0,
								text: '应收',
								stext: '本次实收'
							},
						},
						showAmount: false,
						showgross: false,
						color: '#fa6400',
						type: '入库',
						subType: '采购',
					},
				},


				// 当前的类型
				statusType: 1,

				// 当前选择的门店
				selectedStore: {},
				// 当前选择的业务员
				selectedSalesperson: {},
				// 当前选择的时间
				selectedTime: {
					temp: Date.now(),
					time: ''
				},
				storeShow: false,
				salesShow: false,
				timeShow: false,
				shopShow: false,
				storeList: [],
				salesList: [],

				serviceList: [{
						id: 1,
						title: '*客户',
						value: '零售客户',
						icon: ''
					},
					{
						id: 2,
						title: '时间',
						value: '',
						icon: 'arrow-down-fill'
					},
					{
						id: 3,
						title: '*业务员',
						value: '',
						icon: 'arrow-down-fill'
					}
				],

				// 商品
				loadIndex: 0,
				batchSize: 20,
				productList: [],

				options: [{
					text: '删除',
					style: {
						backgroundColor: '#f56c6c'
					}
				}],

				reqData: {
					remark: '',
					discount: 100, // 整单折扣
					discountMoney: 0, // 优惠金额
					discountLastMoney: 0, // 折后金额
					otherMoney: 0, // 运费,
					moneyAroundDown: 0, // 摸0金额
					changeAmount: 0 // 实付
				},

				originalAmount: 0,

				// 更新的
				goodsUpdate: {},
				// 当前商品
				curShopData: {},

				isServerLoading: false,

				statusName: '',

				transferOrderId: 0,
				transferOrderShopCartList: [],
				canFirst: true,

				// 预订金
				depositDeducted: 0,

				token: '',
			}
		},
		onReady() {
			this.$refs.datetimePicker.setFormatter(this.formatter)
		},
		onLoad(options) {

			this.token = uni.getStorageSync('token')
			// 获取type 类型
			this.type = +options?.type || 1
			this.statusType = +options?.status || 1
			this.getData()

			if (options?.isUpdate === '1') {
				this.isUpdate = true
				this.transferOrderId = +options?.id
				let obj = uni.getStorageSync('goodsUpdate')
				console.log('更新状态', obj)
				this.depositDeducted = obj.depositPaid
				this.goodsUpdate = obj
				this.orderNumber = obj.number
				this.selectedTime.temp = new Date(obj.operTime).getTime()
				this.selectedTime.time = obj.operTime
				this.reqData.remark = obj.remark
				this.reqData.discount = obj.discount
				this.reqData.discountLastMoney = obj.discountLastMoney
				this.reqData.discountMoney = obj.discountMoney
				this.reqData.moneyAroundDown = obj.moneyAroundDown || 0
				this.reqData.otherMoney = obj.otherMoney
				this.reqData.changeAmount = obj.changeAmount
				
				if (obj.fileName) {
					let newArr = obj.fileName.split(',')
					this.fileList1 = newArr.map(item => ({
						status: 'success',
						message: '',
						url: item
					}))
				}
			}
		},
		onShow() {
			// 加载缓存的列表数据
			this.loadIndex = 0
			this.productList = []
			let cacheData = uni.getStorageSync('selectList')
			if (cacheData) {
				console.log('cacheData', cacheData)
				let list = cacheData.map((item) => {
					let price = this.type === 1 ? item.commodityDecimal : item.purchaseDecimal
					let bPrice = new Big(price)
					let bNums = new Big(item.nums)
					let total = bPrice.times(bNums).toFixed(2) // 计算 total，并保留两位小数
					return {
						...item,
						price,
						bPrice,
						bNums,
						total
					}
				})
				this.loadBatchData(list)
				console.log('this', this.productList)


			}

			// 是否转换
			const transData = uni.getStorageSync('transferOrderList')
			if (transData) {
				console.log('分钟', transData)
				this.transferOrderShopCartList = transData.map(item => {
					let price = this.type === 1 ? item.commodityDecimal : item.purchaseDecimal
					let bPrice = new Big(price)
					let bNums = new Big(item.nums)
					let total = bPrice.times(bNums).toFixed(2) // 计算 total，并保留两位小数
					return {
						depotId: item.depotId,
						id: item.id,
						barCode: item.mbarCode,
						operNumber: item.nums,
						unitPrice: price,
						allPrice: total,
						pendingTransferCount: item.nums //未交易的数量（预订使用）
					}
				})

				console.error('transferOrderShopCartList', this.transferOrderShopCartList)
			}


			const scanData = uni.getStorageSync('addScanData') || null
			if (scanData) {
				console.log('scanData', scanData)
				this.updateProductAlone([scanData])
				uni.setStorageSync('selectList', this.productList)

				setTimeout(() => {
					uni.removeStorageSync('addScanData')
				}, 500)
			}
		},
		computed: {
			// 商品总数量
			totalQuantity() {
				return this.productList
					.reduce((accumulator, currentItem) => {
						return accumulator.plus(currentItem.bNums)
					}, new Big(0))
					.toFixed(0)
			},
			totalPrice() {
				return this.productList
					.reduce((accumulator, currentItem) => {
						return accumulator.plus(new Big(currentItem.total))
					}, new Big(0))
					.toFixed(2)
			},
			// 计算毛利润
			grossProfit() {
				return this.productList
					.reduce((accumulator, currentItem) => {
						const bCommodityDecimal = currentItem.bPrice // 已经是 Big 对象
						const bCostPrice = new Big(currentItem.costPrice) // 需要创建 Big 对象
						const bNums = currentItem.bNums // 已经是 Big 对象
						const itemProfit = bCommodityDecimal.minus(bCostPrice).times(bNums)
						return accumulator.plus(itemProfit)
					}, new Big(0))
					.toFixed(2)
			}
		},
		methods: {
			// 压缩图片(需要真机/模拟器环境) - uni.compressImage
			compressImage(srcPath, quality = 80) {
				return new Promise((resolve, reject) => {
					uni.compressImage({
						src: srcPath,
						quality, // 压缩质量(0-100)，数值越小，压缩率越高
						success: (res) => {
							// res.tempFilePath 为压缩后的路径
							resolve(res.tempFilePath)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					// const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]

					// 1. 压缩
					let compressedUrl
					try {
						compressedUrl = await this.compressImage(lists[i].url)
					} catch (err) {
						console.error('图片压缩失败，直接使用原图上传:', err)
						compressedUrl = lists[i].url
					}

					// 2. 上传
					const result = await this.uploadFilePromise(compressedUrl)
					this[`fileList${event.name}`].splice(
						fileListLen,
						1,
						Object.assign(item, {
							status: 'success',
							message: '',
							url: result
						})
					)
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: UPLOAD_FILE_URL, // 仅为示例，非真实的接口地址
						filePath: url,
						header: {
							'X-Access-Token': this.token,
							'content-type': 'application/json'
						},
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							console.log(res)
							const result = JSON.parse(res.data)
							let url = result.data ? `${IMAGE_OSS_URL}/${result.data}` : ""
							resolve(url)
						}
					})
				})
			},

			onDeposit() {
				console.log('商品没有选择')

				if (!this.productList.length) {
					uni.showToast({
						title: '还没有选择商品',
						icon: 'none'
					})
					return
				}

				this.depositShow = true
			},
			handleClickDeposit() {
				console.log('现金支付')

				// 触发保存的
				this.depositShow = false

				this.saveData()
			},
			addNewProduct() {
				let code = this.scanCode
				this.toggleScanModal()
				uni.navigateTo({
					url: `/pages/packageD/set-product/set-product?code=${code}`
				})
			},
			toggleScanModal() {
				this.scanModal = !this.scanModal
			},
			calculateAmounts() {
				const totalPrice = new Big(this.totalPrice || 0)
				const discountRate = new Big(this.reqData.discount || 0).div(100)

				// 计算折后金额和优惠金额
				this.reqData.discountLastMoney = totalPrice.times(discountRate).toFixed(2) // 折后金额
				this.reqData.discountMoney = totalPrice.minus(this.reqData.discountLastMoney).toFixed(2) // 优惠金额

				// 计算应收金额
				this.reqData.changeAmount = new Big(this.reqData.discountLastMoney)
					.plus(new Big(this.reqData.otherMoney || 0))
					.toFixed(2)

				// 如果需要更新抹零金额
				// if (this.showMo) {
				// 	this.applyMoneyAroundDown()
				// }
			},

			// 删除商品
			handleClickAction(e) {
				console.log('删除商品', e)
				this.productList = this.productList.filter((item) => item.name !== e.name)

				const obj = this.productList.filter((item) => item.name === e.name)[0]

				// 同时删除缓存可能去转换的
				if (this.statusType === 2 && this.transferOrderId) {
					this.transferOrderShopCartList = this.transferOrderShopCartList.filter((item) => item.id !== obj.id)
					console.error('删除', this.transferOrderShopCartList)
					uni.setStorageSync('transferOrderList', this.transferOrderShopCartList)
				}

				this.$refs.items.forEach((item) => item.closeHandler(true))
				this.onPriceChange(0)

				uni.setStorageSync('selectList', this.productList)

			},
			onPriceChange(fieldType) {
				// fieldType: 0 - totalPrice 变化，1 - 整单折扣，2 - 优惠金额，3 - 折后金额，4 - 运费

				const totalPrice = new Big(this.totalPrice || 0)

				if (totalPrice.eq(0)) {
					// 如果 totalPrice 为 0，不进行计算
					this.reqData.discountMoney = '0.00'
					this.reqData.discountLastMoney = '0.00'
					this.reqData.changeAmount = '0.00'
					return
				}

				// 将输入值转换为非负数
				if (fieldType === 1) {
					this.reqData.discount = Math.max(0, parseFloat(this.reqData.discount) || 0)
				} else if (fieldType === 2) {
					this.reqData.discountMoney = Math.max(0, parseFloat(this.reqData.discountMoney) || 0)
				} else if (fieldType === 3) {
					this.reqData.discountLastMoney = Math.max(0, parseFloat(this.reqData.discountLastMoney) || 0)
				} else if (fieldType === 4) {
					this.reqData.otherMoney = Math.max(0, parseFloat(this.reqData.otherMoney) || 0)
				}

				if (fieldType === 1 || fieldType === 0) {
					// 整单折扣改变
					const discountRate = new Big(this.reqData.discount).div(100)
					const discountLastMoney = totalPrice.times(discountRate)
					const discountMoney = totalPrice.minus(discountLastMoney)

					this.reqData.discountMoney = discountMoney.toFixed(2)
					this.reqData.discountLastMoney = discountLastMoney.toFixed(2)
				} else if (fieldType === 2) {
					// 优惠金额改变
					const discountMoney = new Big(this.reqData.discountMoney)
					const discountLastMoney = totalPrice.minus(discountMoney)
					const discountRate = discountLastMoney.div(totalPrice).times(100)

					this.reqData.discount = discountRate.toFixed(2)
					this.reqData.discountLastMoney = discountLastMoney.toFixed(2)
				} else if (fieldType === 3) {
					// 折后金额改变
					const discountLastMoney = new Big(this.reqData.discountLastMoney)
					const discountMoney = totalPrice.minus(discountLastMoney)
					const discountRate = discountLastMoney.div(totalPrice).times(100)

					this.reqData.discount = discountRate.toFixed(2)
					this.reqData.discountMoney = discountMoney.toFixed(2)
				} else if (fieldType === 4) {
					// 运费改变，不需要更新其他字段
				}

				// 最终计算应收金额
				const otherMoney = new Big(this.reqData.otherMoney || 0)
				const discountLastMoney = new Big(this.reqData.discountLastMoney || 0)
				const changeAmount = discountLastMoney.plus(otherMoney)

				this.reqData.changeAmount = changeAmount.toFixed(2)
			},
			applyMoneyAroundDown() {
				if (!this.originalAmount) {
					// 存储原始金额（未抹零状态下的金额）
					this.originalAmount = this.reqData.changeAmount || '0'
				}

				if (this.showMo) {
					// 取消抹零，恢复原始金额
					this.reqData.changeAmount = this.originalAmount // 恢复原始金额
					this.reqData.moneyAroundDown = '0.00' // 清空抹零金额
					uni.showToast({
						title: '取消抹零',
						icon: 'none'
					})
				} else {
					// 执行抹零操作
					const changeAmount = new Big(this.reqData.changeAmount || 0)
					const roundedAmount = changeAmount.round(0, 0) // 向下取整
					const moneyAroundDown = changeAmount.minus(roundedAmount)

					// 更新抹零后的金额数据
					this.reqData.moneyAroundDown = moneyAroundDown.toFixed(2) // 记录抹零金额
					this.reqData.changeAmount = roundedAmount.toFixed(2) // 更新应收金额为整数

					uni.showToast({
						title: '已抹零',
						icon: 'none'
					})
				}

				// 切换抹零状态
				this.showMo = !this.showMo
			},
			loadBatchData(list) {
				const start = this.loadIndex * this.batchSize
				const end = start + this.batchSize
				const batchData = list.slice(start, end)
				// 合并数据
				this.productList = this.productList.concat(batchData)
				this.length = this.productList.length
				// 判断是否还有更多数据需要加载
				if (end < list.length) {
					this.loadIndex++
					// 每隔一秒加载下一批数据
					setTimeout(() => {
						this.loadBatchData(list)
					}, 1000)
				} else {
					this.calculateAmounts();
				}
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				return value
			},
			// 获取请求接口数据
			async getData() {
				const user = uni.getStorageSync('userInfo')
				
				const {  data } = await getDepotByUserId({ userId: user.id})
				
				console.log(data)
				const newId = this.isUpdate ? this.goodsUpdate.depotId : data[0]?.id || 1
				
				const [r1, r2] = await Promise.all([
					getUserByDepotId({
						depotId: newId
					}),
					getAccountByDepotId({
						depotId: newId
					})
				])
				console.log('请求的数据', r1, r2, data)

				this.storeList = data.map((item) => ({
					id: item.id,
					name: item.name,
					location: item.location
				}))

				this.salesList = r1.data.map((item) => ({
					...item,
					name: item.userName
				}))

                let objArr = this.salesList.filter(i => i.id === user.id)

				this.selectedSalesperson = objArr?.length ? objArr[0] : this.salesList[0]
				this.selectedStore = this.storeList[0]

				this.serviceList[1].value = timestampToDate(this.selectedTime.temp)
				this.selectedTime.time = this.serviceList[1].value
				this.serviceList[2].value = this.selectedSalesperson.name
				
				if (this.isUpdate) {
					console.log('更新状态')
					const obj = this.storeList.filter(el => el.id === this.goodsUpdate.depotId)[0]
					this.selectedStore = obj
					
					const obj2 = this.salesList.filter(el => el.id === this.goodsUpdate.salesMan)[0]
					this.selectedSalesperson = obj2
					this.serviceList[2].value = obj2.name
				}
			},

			// 获取当前选择的店铺
			getSelectStore(e) {
				console.log(e)
				let obj = e.value[0]
				this.storeShow = false
				this.selectedStore = obj
			},
			// 获取当前选择的业务员
			getSelectSales(e) {
				let obj = e.value[0]
				this.salesShow = false
				this.selectedSalesperson = obj
				this.serviceList[2].value = obj.name
			},

			// 选择时间
			confirmTime(e) {
				this.timeShow = false
				this.selectedTime.temp = e.value
				this.serviceList[1].value = timestampToDate(e.value)
				this.selectedTime.time = this.serviceList[1].value
				console.error('选择的时间', this.selectedTime)
			},
			serviceClick(item) {
				console.log(item)
				if (item.id === 3) {
					this.salesShow = true
				}
				if (item.id === 2) {
					this.timeShow = true
				}
			},

			async saveData() {

				console.error('图片', this.fileList1)

				if (!this.selectedTime.time) {
					uni.showToast({
						title: '请选择时间',
						icon: 'none'
					})
					return
				}

				if (!this.productList.length) {
					uni.showToast({
						title: '商品不能为空',
						icon: 'none'
					})
					return
				}
				
				
				let fileNameArray = ""
				if (this.fileList1.length) {
					let array = this.fileList1.map(item => item.url)
					fileNameArray = array.join(',')
				}

				// 防止重复点击：按钮禁用逻辑
				if (this.isServerLoading) return;

				try {
					this.isServerLoading = true; // 禁用按钮
					uni.showLoading({
						title: '正在保存中...',
					});

					// 如果是新增操作，生成订单号


					if (!this.isUpdate) {

						let reqType = this.objItem[this.type].orderType
						if (this.statusType === 2) {
							reqType = this.type === 1 ? 5 : 4
						}

						if (this.statusType === 3) {
							reqType = this.type === 1 ? 1 : 0
						}

						const resNumData = await genbuildNumber({
							type: reqType,
						});

						this.orderNumber = resNumData?.data?.defaultNumber || null;
					}

					console.log('商品列表', this.productList);

					const newForm = {
						...this.reqData
					};
					let originalTotalPrice = this.totalPrice;
					if (this.type === 2) {
						delete newForm.moneyAroundDown;
					} else {
						newForm.grossProfit = this.grossProfit;
					}

					let type = this.objItem[this.type].statusArray[this.statusType].type
					let subType = this.objItem[this.type].statusArray[this.statusType].subType

					const params = {
						type,
						subType,
						depotId: this.selectedStore.id,
						organId: 60, // 客户id，写死
						operTime: formatTimestamp(this.selectedTime.temp, false),
						salesMan: this.selectedSalesperson.id,
						number: this.orderNumber,
						defaultNumber: this.orderNumber,
						fileName: fileNameArray,
						...newForm,
						totalPrice: this.reqData.changeAmount,
						accountId: 1,
						originalTotalPrice,
					};

					if (this.statusType === 2) {
						params['depositPaid'] = this.curDepositValue || 0

					}

					if (this.isUpdate) {
						params.id = this.goodsUpdate.id;
					}

					const shopCartInfoList = this.productList.map((item) => ({
						depotId: this.selectedStore.id,
						id: item.id,
						name: item.name,
						standard: null,
						stock: item.stock,
						unit: item.unit || '',
						barCode: item.mbarCode,
						operNumber: item.nums,
						unitPrice: item.price,
						allPrice: item.total,
						remark: item.remark || '',
					}));


					let FN = '',
						result = {}

					if (this.transferOrderId) {
						FN = conversionData

						const res = await genbuildNumber({
							type: this.objItem[this.type].orderType,
						});

						let orderNumber = res?.data?.defaultNumber || null;
						const newShopCartInfoList = shopCartInfoList.filter(shopItem => {
							// 如果在 transferOrderShopCartList 找到了相同 id，则过滤掉
							return !this.transferOrderShopCartList.some(transferItem => transferItem.id ===
								shopItem.id);
						});

						let type = this.objItem[this.type].statusArray[1].type
						let subType = this.objItem[this.type].statusArray[1].subType
						let newPrice = subtractWithTwoDecimals(this.reqData.changeAmount, this.goodsUpdate.depositPaid)
						let orderInfo = {
							...params,
							...newForm,
							type,
							subType,
							shopCartInfoList: newShopCartInfoList,
							changeAmount: newPrice,
							depositDeducted: this.goodsUpdate.depositPaid || 0,
							number: orderNumber,
							defaultNumber: orderNumber,
						}

						if (this.type === 2) {
							delete orderInfo.moneyAroundDown;
						} else {
							orderInfo.grossProfit = this.grossProfit;
						}


						let newList = this.transferOrderShopCartList.map(item => ({
							...item,
							depotId: this.selectedStore.id
						}))

						result = await conversionData({
							orderInfo,
							transferOrderId: this.transferOrderId,
							transferOrderShopCartList: newList
						})

					} else {
						FN = !this.isUpdate ?
							addDepotHeadAndDetail :
							updateDepotHeadAndDetail;

						// 新增销售预订单情况
						//                   if (this.statusType === 2 && this.type === 1) {
						// 	// const res = await genbuildNumber({
						// 	// 	type: this.type === 1 ? 5 : 4,
						// 	// });
						// 	// let number = res?.data?.defaultNumber || null;
						// 	params['type'] = '出库'
						// 	params['subType'] = '销售预订'
						// 	// params.number = number
						// 	// params.defaultNumber = number
						// }

						let urlObj = {}
						if (this.isUpdate) {
							urlObj = {
								1: '/depotHead/updateDepotHeadAndDetail',
								2: '/depotHead/updateAdvanceOrder',
								3: '/depotHead/updateDepotHeadAndDetail'
							}
						} else {
							urlObj = {
								1: '/depotHead/addDepotHeadAndDetail',
								2: '/depotHead/addAdvanceOrder',
								3: '/depotHead/addDepotHeadAndDetail'
							}
						}

						result = await FN({
							...params,
							shopCartInfoList,
						}, urlObj[this.statusType]);
					}


					const {
						data,
						message,
						code
					} = result

					if (code === 0) {
						uni.showToast({
							title: '操作成功',
							icon: 'success',
						});

						// 清理缓存数据
						uni.removeStorageSync('selectList');
						uni.removeStorageSync('goodsUpdate');
						uni.removeStorageSync('transferOrderList')

						// isT 表示是否已经转换成功  1 没有 2 成功
						let isT = this.transferOrderId && this.statusType === 2 ? 2 : 1

						// 跳转到结果页面
						uni.reLaunch({
							url: `/pages/packageC/shop-result/shop-result?type=${this.type}&orderNum=${this.orderNumber}&total=${this.reqData.changeAmount}&status=${this.statusType}&isT=${isT}`,
						});
					} else {
						// 服务器返回错误处理
						uni.showToast({
							title: message || '操作失败，请重试',
							icon: 'none',
						});
					}
				} catch (error) {
					console.error('保存数据时出错:', error);
					uni.showToast({
						title: error.message || '操作失败，请重试',
						icon: 'none',
					});
				} finally {
					// 无论成功或失败都释放锁定状态
					this.isServerLoading = false;
					uni.hideLoading();
				}
			},

			handleClickItemSet(item) {
				console.log('点击出现商品详情', item)
				// 深拷贝对象
				this.curShopData = {
					...item
				}
				this.shopShow = true
			},

			// 单个商品数量改变
			shopDataChange(e) {
				const value = e.value
				this.curShopData.nums = value.toString()
				try {
					this.curShopData.bNums = new Big(value || '0')
					// 重新计算总价
					const total = this.curShopData.bPrice.times(this.curShopData.bNums)
					this.curShopData.total = total.toFixed(2)
				} catch (error) {
					console.error('数量输入错误:', error)
					this.curShopData.total = '0.00'
				}
			},

			onAlonePrice(e, type) {
				console.log(e, type)

				if (type === 1) {
					this.curShopData.bPrice = new Big(e || '0')
					// 重新计算总价
					const total = this.curShopData.bPrice.times(this.curShopData.bNums)
					this.curShopData.total = total.toFixed(2)
				}

				if (type === 2) {
					const bTotal = new Big(e || '0')
					// 计算新的单价
					if (!this.curShopData.bNums.eq(0)) {
						this.curShopData.bPrice = bTotal.div(this.curShopData.bNums)
						this.curShopData.price = this.curShopData.bPrice.toFixed(2)
					} else {
						this.curShopData.price = '0.00'
					}
				}
			},

			fixOneShopData() {
				console.log('修改单个商品')
				// this.productList
				const index = this.productList.findIndex((item) => item.id === this.curShopData.id)
				if (index !== -1) {
					this.productList.splice(index, 1, this.curShopData)
				}
				uni.setStorageSync('selectList', this.productList)
				this.shopShow = false
				
				// console.error('当前的商品列表', this.productList)
				this.onPriceChange(0)
			},

			// 选择商品
			selectProduct() {
				
				// 新增门店逻辑 进货、进货预订、销售退货看到所有商品。
				let id = this.selectedStore.id
				if (this.type === 2 && this.statusType <= 2) {
					id = 0
				}
				
				if (this.type === 1 && this.statusType === 3) {
					id = 0
				}
				
				uni.navigateTo({
					url: `/pages/packageC/add-stock/add-stock?type=${this.type}&storeId=${id}`
				})
			},
			async selectDataAndPush() {
				uni.showLoading({
					title: '查询中'
				})
				const {
					data
				} = await getMaterialList({
					currentPage: 1,
					pageSize: 100,
					search: {
						materialParam: this.scanCode
					}
				})

				let {
					rows,
					total = 0
				} = data || {}

				if (!total) {
					// this.scanCode = res.result
					this.toggleScanModal()
				} else {
					// 存在就去添加到商品的缓存里面
					console.error(rows)

					let array = this.productList.filter(item => item.mbarCode === this.scanCode)

					if (array.length) {
						this.productList.forEach(item => {
							if (item.mbarCode === this.scanCode) {
								console.error(item)
								const currentNums = parseInt(item.nums, 10);
								item.bNums = item.bNums.plus(1);
								item.nums = (currentNums + 1).toString()
								item.total = item.bPrice.times(item.bNums).toFixed(2)
							}
						})
						console.log('this.productList', this.productList)
						this.onPriceChange(0)
					} else {
						this.updateProductAlone(rows)
					}
					uni.setStorageSync('selectList', this.productList)
				}


				uni.hideLoading()
			},
			updateProductAlone(rows) {
				const useCommodity = this.type === 1
				this.productList.push(...rows.map(item => {
					const imgName = item.imgName || '';
					const imgList = imgName.split(',');
					const cover = imgList[0] || '';
					let price = useCommodity ? item.commodityDecimal : item
						.purchaseDecimal
					const bPrice = new Big(price || 0)
					const bNums = new Big(1)
					const total = bPrice.times(bNums).toFixed(2)
					return {
						...item,
						bPrice,
						bNums,
						total,
						price,
						imgList,
						cover,
						nums: 1
					}

				}))
				this.onPriceChange(0)
				console.error(this.productList)
			},
			// 扫码添加
			scanToAdd() {
				uni.scanCode({
					scanType: ['barCode'],
					enableFlash: true,
					success: async (res) => {
						console.log(res)
						// 去数据库查询商品
						this.scanCode = res.result
						this.selectDataAndPush()
					},
					fail: (err) => {
						console.error('err不存在商品', err)
						uni.showToast({
							title: '识别不到商品',
							icon: 'none'
						})
					},

				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.deposit {
		height: 600rpx;
		width: 100%;
		padding: 40rpx;
		background-color: #F1F4F9;
		display: flex;
		align-items: center;
		flex-direction: column;

		.title {
			color: #7C7775;
			font-size: 44rpx;
			font-weight: 700;
		}

		.subtitle {
			margin-top: 30rpx;
			color: #827D7A;
			font-size: 30rpx;
		}

		.depositPaid {
			margin-top: 30rpx;
			font-size: 30rpx;
		}

		.inputs {
			width: 100%;
			height: 80px;
			border-radius: 10rpx;
			background-color: #fff;
			padding: 20rpx;
			margin-top: 20px;
		}

		.money {
			display: block;
			margin: 20px 0 8px 0;
			width: 200rpx;
		}
	}

	.scan-main {
		width: 300px;
		padding: 30rpx;

		.scan-code {
			background-color: #F1F4F9;
			width: 100%;
			color: #999CA1;
			border-radius: 18rpx;
			height: 40px;
			line-height: 40px;
			text-align: center;
			margin: 10px 0;
		}

		.scan-group {
			display: flex;
			align-items: center;
			height: 40px;

			.cancel {
				color: #111;
			}

			view {
				width: 50%;
				text-align: center;
				color: #5fcadd;
			}
		}
	}

	.no-scroll {
		overflow: hidden;
		height: 50vh;
	}

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

			&-end {}
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

	.product {
		padding: 40rpx !important;

		&-title {
			font-weight: 700;
			font-size: 30rpx;
			display: flex;
			align-items: center;

			.slash {
				width: 6rpx;
				height: 30rpx;
				display: block;
				background-color: #fa6400;
				margin-right: 15rpx;
			}
		}

		&-content {
			.swipe-action {
				padding: 40rpx 0;

				.image-box {
					width: 60px;
					height: 60px;
					overflow: hidden;
					background-color: #cdd7dc;
					border-radius: 10rpx;

					image {
						width: 100%;
					}
				}

				&-content {
					flex: 1;
				}
			}
		}

		&-end {
			display: flex;
			justify-content: flex-end;
			flex-direction: column;
			align-items: flex-end;
		}
	}

	.amount {
		display: flex;
		align-items: flex-end;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 10px;
		margin-top: 10rpx;

		.btns {
			width: 120rpx;
			margin-left: 20rpx;
			border: 1px solid #5fcadd;
			color: #5fcadd;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.moneyAroundDown {
		text-align: right;
		color: #737373;
		padding: 15px 0;
	}

	.grossProfit {
		margin-top: 10px;
		font-size: 30rpx;
		color: #9d9ea0;
		font-weight: 600;
	}

	.modals {
		padding: 30rpx 30rpx 0 30rpx;
		height: 70vh;
		width: 100%;
		position: relative;

		.abs-button {
			position: absolute;
			z-index: 1000;
			background-color: #fff;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 200rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 25rpx;
			box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);

			.money {
				color: #fa6400;
				font-weight: 700;
				font-size: 36rpx;
				margin-bottom: 15px;
			}

			.btn {
				width: 180rpx;
				height: 90rpx;
				background: linear-gradient(to right, #fa6400, #f79151);
				border-radius: 20rpx;
				color: #fff;
				font-weight: 700;
			}
		}

		.modal-card {
			border-radius: 20rpx;
			background: #fff;
			padding: 40rpx 40rpx 20rpx 40rpx;
			margin-bottom: 17rpx;

			view {
				margin-bottom: 20px;
			}

			.w16 {
				width: 140rpx;
			}
		}

		.modal-header {
			width: 100%;
			margin-bottom: 17rpx;
		}

		.modal-content-box {
			flex: 1;
			margin: 0 10px;
		}

		.stock {
			color: #9d9ea0;
			display: flex;
			align-items: flex-end;
			height: 55px;
		}
	}

	.bottom {
		position: fixed;
		z-index: 1000;
		background-color: #fff;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		padding: 25rpx;
		box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);

		.btns {
			width: 180rpx;
			height: 90rpx;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-weight: 700;
		}

		.dj {
			margin-right: -30px;
			border: 1rpx solid #fa6400;
			color: #fa6400;
		}

		.xs {
			margin-right: -30px;
			border: 1rpx solid #5FCADD;
			color: #5FCADD;
		}
	}
</style>