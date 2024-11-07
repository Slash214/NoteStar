<template>
	<CustomView ref="pagIng" :getData="getAccountByDepotId" :transformData="transformData" :params="{ depotId: this.depotId }">
		<template v-slot:top>
			<AppletHeader title="普通账户" right-icon="plus" @rightClick="rightClick"></AppletHeader>
		</template>

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
		
		<u-modal @cancel="modalShow = false" @confirm="onDelConfirm" :show="modalShow" showCancelButton title="删除" content='确定要删除吗？'></u-modal>
		<u-action-sheet :actions="list" cancelText="取消" @select="onSheetSelect" @close="show = false" :title="title" :show="show"></u-action-sheet>
	</CustomView>
</template>

<script>
import CustomView from '@/components/CustomView/CustomView.vue'
import { getAccountByDepotId, deleteAccountItem } from '@/apis'
export default {
	components: {
		CustomView
	},
	data() {
		return {
			getAccountByDepotId,
			total: 0,
			depotId: 0,
			show: false,
			list: [
				{ name: "编辑", id: 1 },
				{ name: "删除", id: 2 },
			],
			modalShow: false,
			curSelObj: {},
			pagIng: null,
		}
	},
	onLoad() {
		
	},
	onShow() {
		this.$refs.pagIng.reload()
	},
	methods: {
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

.list {
	background-color: #fff;
	padding: 25rpx;
	border-radius: 20rpx;
}
</style>
