<template>

	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top
		:refresher-enabled="false">
		<template v-slot:top>
			<AppletHeader title="普通账户" right-icon="plus" @rightClick="rightClick"></AppletHeader>
		</template>



		<view class="address" @click="addresShow = true">
			<text>{{curSelShop.name}}</text>
			<u-icon name="arrow-down-fill" size="16" color="#9d9ea0"></u-icon>
		</view>

		<SelectShop :show="addresShow" @confirm="getSelAddress" @cancel="addresShow = false"></SelectShop>

		<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>

		<view class="container">
			<view class="flex flex-items-center mb10 box">
				<text>账户合计：</text>
				<text class="total">￥{{formatMoney(total)}}</text>
			</view>

			<view class="list mb10" v-for="(item, index) of dataList" :key="index">
				<u--text :text="item.name" bold color="#000" margin="0 0 10px 0"></u--text>
				<view class="flex flex-items-center flex-between">
					<view class="flex flex-items-center">
						<text style="color: #737373">余额：</text>
						<text class="money">￥{{formatMoney(item.amount)}}</text>
					</view>
					<u-icon @click="showMore(item)" name="more-dot-fill" size="18" color="#000"></u-icon>
				</view>
			</view>
		</view>


		<u-modal @cancel="modalShow = false" @confirm="onDelConfirm" :show="modalShow" showCancelButton title="删除"
			content='确定要删除吗？'></u-modal>
		<u-action-sheet :actions="list" cancelText="取消" @select="onSheetSelect" @close="show = false" :title="title"
			:show="show"></u-action-sheet>
	</z-paging>
</template>

<script>
	import SelectShop from '@/components/SelectShop/SelectShop.vue'
	import { formatMoney } from '@/utils'
	import {
		getAccountByDepotId,
		deleteAccountItem
	} from '@/apis'
	export default {
		components: {
			SelectShop
		},
		data() {
			return {
				formatMoney,
				addresShow: false,
				getAccountByDepotId,
				total: 0,
				show: false,
				list: [{
						name: "编辑",
						id: 1
					},
					{
						name: "删除",
						id: 2
					},
				],
				modalShow: false,
				curSelObj: {},
				pagIng: null,

				curSelShop: {
					id: 0,
					name: '全部门店'
				},
				dataList: []
			}
		},
		onLoad() {},
		onShow() {
			this.$refs.paging.reload()
		},
		methods: {
			getSelAddress(item) {
				this.curSelShop = item
				this.addresShow = false
				this.$refs.paging.reload()
			},
			showMore(item) {
				console.log(item)
				this.curSelObj = item
				this.show = true
			},
			onSheetSelect(e) {
				console.log(e)
				if (e.id === 2) {
					// 删除
					this.modalShow = true
				} else {
					// 去编辑
					uni.setStorageSync('fixData', this.curSelObj)
					uni.navigateTo({
						url: '/pages/packageE/add-account/add-account?type=2'
					})
				}
			},
			async onDelConfirm() {
				this.modalShow = false
				await deleteAccountItem({
					id: this.curSelObj.accountId
				})
				uni.showToast({
					title: '删除成功',
					icon: 'none'
				})
				this.$refs.paging.reload()
			},
			rightClick() {
				uni.navigateTo({
					url: '/pages/packageE/add-account/add-account?type=1'
				})
			},
			async queryList(page, pageNo) {
				this.loading = true
				try {
					const {
						data
					} = await getAccountByDepotId({
						currentPage: page,
						pageSize: pageNo,
						depotId: this.curSelShop.id
					})
					const {
						totalAmout,
						info
					} = data || {}

					this.total = totalAmout
					this.$refs.paging.complete(info)
					this.loading = false
				} catch (e) {
					console.log('请求失败', e)
					this.$refs.paging.complete(false)
				}
			}
		}
	}
</script>

<style lang="scss">
	.box {
		width: 100%;
		height: 75rpx;
		background-color: #fafbfd;
		border-radius: 10rpx;
		padding: 0 30rpx;
		color: #9d9ea0;
	}
	
	.total {
		color: #9D9EA0;
	}

	.address {
		padding: 30rpx 30rpx 0 30rpx;
		font-size: 30rpx;
		color: #9d9ea0;
		display: flex;
		align-items: center;

		text {
			padding-right: 10rpx;
		}
		
		.money {
			color: #737373;
		}
	}

	.list {
		background-color: #fff;
		padding: 25rpx;
		border-radius: 20rpx;
	}
</style>