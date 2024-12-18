<template>
	<z-paging
		ref="paging"
		v-model="dataList"
		@query="queryList"
		:default-page-size="20"
		:auto="!isCache"
		auto-show-back-to-top
		safe-area-inset-bottom
		:refresher-enabled="false"
	>
		<view slot="top">
			<AppletHeader :title="type === 1 ? '销售' : '进货'" left-icon="arrow-left" right-icon="plus" @rightClick="rightClick"></AppletHeader>
			<nav-search-bar @search="getSearchValue" desc="单号/客户/商品/备注" :showRight="false"></nav-search-bar>
		</view>

		<view class="main">
			<!-- <view class="mb20"></view> -->
			<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
			<view class="list" v-for="(item, index) in dataList" :key="item.id">
				<view class="list-item">
					<view class="flex flex-between">
						<view class="image-box">
							<u--image
								radius="10"
								:showLoading="true"
								:src="item.cover"
								width="60px"
								height="60px"
							></u--image>
						</view>
						<view class="content">
							<u--text size="18" color="#000" :text="item.name"></u--text>
							<u--text color="#9D9EA0" margin="5px 0" :text="item.mbarCode"></u--text>
							<u--text margin="0 0 5px 0" :text="'库存：' + item.stock"></u--text>
							<u--text
								mode="price"
								:text="type === 1 ? item.commodityDecimal : item.purchaseDecimal"
							></u--text>
						</view>
					</view>
					<view class="list-item-number">
						<u-number-box
							:longPress="false"
							:min="0"
							integer
							bgColor="#ffe0cc"
							inputWidth="90"
							@change="handleClick(item, $event)"
							v-model="item.nums"
						></u-number-box>
					</view>
				</view>
			</view>
		</view>
		<template slot="bottom">
			<view class="fixed-content flex flex-between flex-items-center">
				<view class="flex flex-items-center">
					<view class="cart-box mr15">
						<u-icon name="shopping-cart" size="30" color="#FA6400"></u-icon>
						<u-badge absolute :offset="[0, -5]" max="99" :value="productCount.toFixed()"></u-badge>
					</view>
					<view class="">
						<u--text color="#FA6400" :text="totalPrice.toFixed(2)" mode="price"></u--text>
						<view class="mt5">种类{{ productKindCount }}，数量{{ productCount.toFixed() }}</view>
					</view>
				</view>

				<view
					:class="type === 1 ? 'fixed-button istype1' : 'fixed-button istype2'"
					@click="handleSelectionSuccess"
				>
					选好了
				</view>
			</view>
		</template>
	</z-paging>
</template>

<script>
import NavSearchBar from '@/components/NavSearchBar/NavSearchBar.vue'
import FixedBottom from '@/components/FixedBottom/FixedBottom.vue'
import { getMaterialList } from '@/apis/index.js'
import Big from 'big.js'
import { cloneDeep } from '@/utils'

export default {
	components: {
		NavSearchBar,
		FixedBottom
	},
	data() {
		return {
			dataList: [],
			keyword: '',
			depotId: 1,
			loading: true,
			selectList: [],
			isCache: false,
			cachePage: 1,
			typeArray: {
				1: { text: '销售', desc: '名称/条形码/简拼' },
				2: { text: '进货', desc: '单号/客户/商品/备注' }
			},
			type: 1
		}
	},
	async onLoad(options) {
		console.log(options)
		this.type = +options?.type || 1
		this.depotId = +options?.storeId || 1
		const storedList = uni.getStorageSync('selectList')
		if (storedList) {
			this.isCache = true
			const page = uni.getStorageSync('currPage') || 1
			this.currPage = +page
			this.selectList = storedList.map((item) => {
				return {
					...item,
					purchaseDecimal: new Big(item.purchaseDecimal),
					commodityDecimal: new Big(item.commodityDecimal),
					nums: new Big(item.nums) // 将字符串转换回 Big 对象
				}
			})
			const selectMap = new Map()
			this.selectList.forEach((el) => {
				selectMap.set(el.id, el)
			})
			const result = await this.$refs.paging.refreshToPage(this.currPage)
			this.dataList = result.totalList.map((item) => {
				if (selectMap.has(item.id)) {
					// 获取选中的 item
					const selectedItem = selectMap.get(item.id)
					// 更新需要同步的属性
					return {
						...item,
						nums: selectedItem.nums
						// 如果有其他属性需要同步，可以在这里添加
					}
				}
				return item
			})
		} else {
			this.selectList = []
		}
	},
	computed: {
		productCount() {
			return this.selectList.reduce((sum, item) => sum.plus(item.nums), new Big(0))
		},
		totalPrice() {
			return this.selectList.reduce(
				(sum, item) =>
					sum.plus(item.nums.times(this.type === 1 ? item.commodityDecimal : item.purchaseDecimal)),
				new Big(0)
			)
		},
		productKindCount() {
			return this.selectList.length
		}
	},
	methods: {
		rightClick() {
			// 1是销售的  2 是进货的
			let type = 1
			uni.navigateTo({
				url: '/pages/packageD/set-product/set-product'
			})
		},
		getSearchValue(v) {
			this.loading = true
			console.log('value', v)
			this.keyword = v
			this.$refs.paging.reload()
		},
		formatData(data) {
			return data.map(item => {
				const imgList = item?.imgName?.split(',') || [] 
				const cover = imgList[0] || '' 
				return {
					nums: new Big(0),
					id: item.id,
					name: item.name,
					// imgName: item.imgName,
					imgList,
					cover,
					purchaseDecimal: new Big(item.purchaseDecimal),
					stock: item.stock,
					mbarCode: item.mbarCode,
					meId: item.meId,
					commodityDecimal: new Big(item.commodityDecimal),
					costPrice: item.costPrice
				}
			})
		},
		handleSelectionSuccess() {
			console.log(this.selectList)
			// let goodsInfo = {
			// 	productKindCount: this.productKindCount,
			// 	total: this.productCount.toFixed(),
			// 	totalPrice: this.totalPrice.toFixed()
			// }
			// uni.setStorageSync('goodsInfo', goodsInfo)
			// 缓存选择列表 处理big类型
			this.saveSelectList()
			uni.setStorageSync('currPage', this.cachePage)
			uni.navigateBack()
		},
		saveSelectList() {
			// 深拷贝 selectList，以免修改原始数据
			const listToStore = this.selectList.map((item) => {
				return {
					...item,
					purchaseDecimal: item.purchaseDecimal.toString(),
					commodityDecimal: item.commodityDecimal.toString(),
					nums: item.nums.toString() // 将 Big 对象转换为字符串
				}
			})
			uni.setStorageSync('selectList', listToStore)
		},
		async queryList(pageNo, pageSize) {
			this.cachePage = pageNo
			try {
				// this.cachePage ? pageNo + this.cachePage - 1 : pageNo
				
				let ordertype = this.type === 1 ? '销售' : '进货'
				
				let search = {
					materialParam: this.keyword,
					depotId: this.depotId,
					ordertype
				}
				
				console.error('请求参数', search)
				const { data } = await getMaterialList({
					currentPage: pageNo,
					pageSize,
					search
				})
				let { rows, totalStockCount, total } = data || {}
				let array = this.formatData(rows)
				this.$refs.paging.complete(array)
				this.loading = false
			} catch (e) {
				console.log('请求失败', e)
				this.$refs.paging.complete(false)
			}
		},
		handleClick(item, e) {
			// 获取新值并转换为 Big 类型
			let newValue = e.value
			let bigValue = new Big(newValue)

			item.nums = bigValue
			let index = this.selectList.findIndex((i) => i.id === item.id)

			if (bigValue.gt(0)) {
				if (index === -1) {
					let clonedItem = cloneDeep(item)
					this.selectList.push({ ...clonedItem })
				} else {
					this.selectList[index].nums = bigValue
				}
			} else {
				if (index !== -1) {
					this.selectList.splice(index, 1)
				}
			}
		}
	}
}
</script>

<style scoped lang="scss">
.list {
	&-item {
		padding: 20rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #e4e7ed;

		&-number {
			display: flex;
			justify-content: flex-end;
		}

		.content {
			margin-left: 20px;
			flex: 1;
		}
	}
}

.minus {
	width: 22px;
	height: 22px;
	border-width: 1px;
	border-color: #e6e6e6;
	border-style: solid;
	border-top-left-radius: 100px;
	border-top-right-radius: 100px;
	border-bottom-left-radius: 100px;
	border-bottom-right-radius: 100px;
	@include flex;
	justify-content: center;
	align-items: center;
}

.input {
	padding: 0 10px;
}

.plus {
	width: 22px;
	height: 22px;
	background-color: #ff0000;
	border-radius: 50%;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: center;
	align-items: center;
}

.main {
}

.fixed-content {
	padding: 32rpx;
	background-color: #fff;
	.fixed-button {
		width: 180rpx;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		border-radius: 20rpx;
		color: #fff;
		font-weight: 700;
	}

	.istype1 {
		background: linear-gradient(to right, #5fcadd, #6adae8);
	}

	.istype2 {
		background: linear-gradient(to right, #fa6400, #f79151);
	}

	.cart-box {
		position: relative;
		font-size: 28rpx;
	}
}
</style>
