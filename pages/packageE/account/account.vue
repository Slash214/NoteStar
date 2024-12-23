<template>
	<CustomView ref="pagIng" :getData="getAccountByDepotId" :transformData="transformData" :params="{ depotId: this.curSelShop.id }">
		<template v-slot:top>
			<AppletHeader title="普通账户" right-icon="plus" @rightClick="rightClick"></AppletHeader>
		</template>
		
		<view class="address" @click="addresShow = true">
			<text>{{curSelShop.name}}</text>
			<u-icon name="arrow-down-fill" size="16" color="#9d9ea0"></u-icon>
		</view>
		
		<SelectShop :show="addresShow" @confirm="getSelAddress" @cancel="addresShow = false"></SelectShop>

		<template v-slot:content="{ dataList }">
			<view class="container">
				<view class="flex flex-items-center mb10 box">
					<text>账户合计：</text>
					<u--text mode="price" :text="total" color="#9D9EA0"></u--text>
				</view>

				<view class="list mb10" v-for="(item, index) of dataList" :key="index">
					<u--text :text="item.name" bold color="#000" margin="0 0 10px 0"></u--text>
					<view class="flex flex-items-center flex-between">
						<view class="flex flex-items-center">
							<text style="color: #737373">余额：</text>
							<u--text color="#737373" mode="price" :text="item.amount"></u--text>
						</view>
						<u-icon @click="showMore(item)" name="more-dot-fill" size="18" color="#000"></u-icon>
					</view>
				</view>
			</view>
		</template>
		
		<SelectShop></SelectShop>
		
		<u-modal @cancel="modalShow = false" @confirm="onDelConfirm" :show="modalShow" showCancelButton title="删除" content='确定要删除吗？'></u-modal>
		<u-action-sheet :actions="list" cancelText="取消" @select="onSheetSelect" @close="show = false" :title="title" :show="show"></u-action-sheet>
	</CustomView>
</template>

<script>
import CustomView from '@/components/CustomView/CustomView.vue'
import SelectShop from '@/components/SelectShop/SelectShop.vue'
import { getAccountByDepotId, deleteAccountItem } from '@/apis'
export default {
	components: {
		CustomView,
		SelectShop
	},
	data() {
		return {
			addresShow: false, 
			getAccountByDepotId,
			total: 0,
			show: false,
			list: [
				{ name: "编辑", id: 1 },
				{ name: "删除", id: 2 },
			],
			modalShow: false,
			curSelObj: {},
			pagIng: null,
			
			curSelShop: {
				id: 0,
				name: '全部门店'
			}
		}
	},
	onLoad() {
		
	},
	onShow() {
		this.$refs.pagIng.reload()
	},
	methods: {
		getSelAddress(item) {

			this.curSelShop = item
			this.addresShow = false
			this.$refs.pagIng.reload()
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
			await deleteAccountItem({ id: this.curSelObj.accountId })
			uni.showToast({
				title: '删除成功',
				icon: 'none'
			})
			this.$refs.pagIng.reload()
		},
		rightClick() {
			uni.navigateTo({
				url: '/pages/packageE/add-account/add-account?type=1'
			})
		},
		transformData(data) {
			console.log('data', data)
			const { totalAmout, info } = data || {}
			this.total = totalAmout
			return info
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

.address {
	padding: 30rpx 30rpx 0 30rpx;
	font-size: 30rpx;
	color: #9d9ea0;
	display: flex;
	align-items: center;
	text {
		padding-right: 10rpx;
	}
}

.list {
	background-color: #fff;
	padding: 25rpx;
	border-radius: 20rpx;
}
</style>
