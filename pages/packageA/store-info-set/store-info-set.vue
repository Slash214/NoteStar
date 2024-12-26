<template>
	<z-paging ref="paging" v-model="dataList" :default-page-size="20" @query="queryList" auto-show-back-to-top>
		<template slot="top">
			<AppletHeader @rightClick="rightClick" :title="objItem[type].title"></AppletHeader>
		</template>
		<u-loading-icon :show="loading" text="数据正在加载中..." vertical></u-loading-icon>
		<view class="container">
			<view class="flex select" @click="shopShow = true" v-if="type == 2">
				<text>{{ curShop.name }}</text>
				<u-icon name="arrow-down-fill" size="10"></u-icon>
			</view>

			<view class="list" v-for="(item, index) in dataList" :key="item.id">
				<u--text bold size="16" margin="0 0 10px 0" :text="item.title"></u--text>
				<view class="flex flex-between flex-items-center">
					<u--text :text="item.subtitle"></u--text>
					<view class="" @click="editorItem(item)">
						<u-icon name="more-dot-fill"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<u-action-sheet
			@select="onSelect"
			:closeOnClickOverlay="true"
			@close="toggleShow"
			:actions="list"
			cancelText="取消"
			:show="show"
		></u-action-sheet>

		<SelectShop :show="shopShow" @cancel="shopShow = false" @confirm="confirm"></SelectShop>

		<u-modal :show="delShow" @cancel="delShow = false" @confirm="onDeleteData" showCancelButton title="删除商品">
			<view style="text-align: center;">
				{{modalContent}}
			</view>
		</u-modal>
	</z-paging>
</template>

<script>
import { getDepotList, getUserByDepotId, deleteShopMang, deleteUserData } from '@/apis'
import { SelectShop } from '@/components/SelectShop/SelectShop.vue'
export default {
	components: {
		SelectShop
	},
	data() {
		return {
			delShow: false,
			modalContent: '',
			params: {
				province: true,
				city: true,
				area: true
			},

			// 1店铺  2员工
			type: 1,
			curShop: {
				name: '全部门店',
				id: 0
			},
			shopShow: false,
			objItem: {
				1: {
					title: '门店管理'
				},
				2: {
					title: '员工管理'
				}
			},
			list: [{ name: '编辑' }, { name: '删除' }],
			show: false,
			dataList: [],
			curObj: {}
		}
	},
	onLoad(options) {
		console.log(options)
		this.type = +options?.type || 1
		console.error('当前的type', this.type)
	},
	onShow() {
		this.$refs.paging.reload()
		uni.removeStorageSync('selectShop')
	},
	methods: {
		confirm(v) {
			console.log('选择的', v)
			this.curShop = v
			this.shopShow = false
			this.$refs.paging.reload()
		},
		rightClick() {
			uni.navigateTo({
				url: `/pages/packageA/add-store-info/add-store-info?type=${this.type}`
			})
		},
		async queryList(page, pageNo) {
			this.loading = true
			try {
				let params = {}

				if (this.type === 1) {
					params['apiName'] = 'depot'
				}

				if (this.type === 2) {
					params['depotId'] = this.curShop.id
				}

				const Fn = this.type === 1 ? getDepotList : getUserByDepotId
				const { data } = await Fn({
					currentPage: page,
					pageSize: pageNo,
					...params
				})

				let processedData = []
				if (this.type === 1) {
					let { rows, total } = data || {}
					this.total = total
					processedData = rows.map((item) => ({
						...item,
						title: item.name,
						subtitle: item.location
					}))
				} else {
					this.total = data.length
					processedData = data.map((item) => ({
						...item,
						title: item.userName,
						subtitle: item.roleName
					}))
				}
				console.log('processedData', processedData)
				this.$refs.paging.complete(processedData)
				this.loading = false
			} catch (e) {
				console.log('请求失败', e)
				this.$refs.paging.complete(false)
			}
		},
		toggleShow() {
			this.show = !this.show
		},
		onSelect(e) {
			console.log('选择的操作', e)

			if (e.name === '编辑') {
				console.log('去编辑', this.curObj)
				if (this.type === 2) {
					uni.navigateTo({
						url: `/pages/packageA/add-store-info/add-store-info?type=${this.type}&userId=${this.curObj.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/packageA/add-store-info/add-store-info?type=${this.type}&obj=${JSON.stringify(
							this.curObj
						)}`
					})
				}
			}

			if (e.name === '删除') {
				this.delShow = true
				if (this.type === 2) {
					this.modalContent = '确定要删除该员工吗？'
					// 员工
				} else {
					// 店铺
					this.modalContent = '确定要删除该门店吗？'
					// 
				}
			}
		},
		async onDeleteData() {
			console.log('确认删除')
			this.delShow = false
			if (this.type === 1) {
				await deleteShopMang({
					apiName: 'depot',
					id: this.curObj.id
				})
			} else {
				await deleteUserData({
					id: this.curObj.id
				})
			}
			
			uni.showToast({
				title: '操作成功',
				icon: 'none'
			})
			this.$refs.paging.reload()
		},
		editorItem(item) {
			console.log('编辑')
			this.curObj = item
			// 1是店铺的编辑  2是 员工的
			this.show = true
		}
	}
}
</script>

<style lang="scss" scoped>
.select {
	color: #606266;
	font-size: 28rpx;
	margin-bottom: 20px;
}
.list {
	margin-bottom: 17rpx;
	padding: 25rpx;
	border-radius: 20rpx;
	background-color: #fff;
}
</style>
