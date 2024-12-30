<template>
	<view>
		<AppletHeader title="其他收入单详情" right-icon="more-dot-fill" @rightClick="rightClick"></AppletHeader>
		<view class="container">
			<view class="box">
				<view class="flex mb10 flex-between flex-items-center">
					<text>{{ objItem.name || '' }}</text>
					<text>{{ formatDateToChinese(objItem.createTime, false) || '' }}</text>
				</view>
				<view class="flex">
					<text class="w200">收款金额：</text>
					<view class="times">
						<u--text color="#FFAF38" mode="price" :text="objItem.totalAmount"></u--text>
						<text class="slash">|</text>
						<text>现金</text>
					</view>
				</view>
			</view>

			<view class="box">
				<view class="list" v-for="item in list" :key="item.id">
					<text class="text">{{ item.text }}</text>
					<text class="value">{{ item.value }}</text>
				</view>
			</view>

			<view class="box min-h">
				<text class="remark">备注: {{objItem.remark}}</text>

				<view class="image-list">
					<view class="img" v-for="(url,key) in imgList" :key="key">
						<u--image :showLoading="true" width="60px" height="60px" radius="10" :src="url"
							></u--image>
					</view>
				</view>
			</view>
		</view>

		<u-modal showCancelButton @confirm="onModalconfirm" @cancel="modalShow = false" :show="modalShow" title="温馨提示"
			content="确定作废当前单据吗？作废后不可恢复"></u-modal>
		<u-action-sheet @close="show = false" @select="onSelect" :actions="select" cancelText="取消"
			:show="show"></u-action-sheet>

		<fixed-bottom height="100px">
			<view class="button" @click="editorData">
				<u-icon name="edit-pen" size="24"></u-icon>
				<text class="ml5">修改</text>
			</view>
		</fixed-bottom>
	</view>
</template>

<script>
	import {
		getDetailByNumber,
		deleteInOutItem
	} from '@/apis'
	import {
		formatDateToChinese
	} from '@/utils'
	export default {
		data() {
			return {
				show: false,
				modalShow: false,
				number: 0,
				objItem: {},
				list: [],
				formatDateToChinese,
				imgList: [],
				select: [{
						name: '历史记录',
						id: 1
					},
					{
						name: '作废',
						id: 2
					}
				]
			}
		},
		onLoad(options) {
			this.number = options?.number
			this.getData()
		},
		methods: {
			async onModalconfirm() {
				this.modalShow = false
				console.log('确定删除')
				const {
					data
				} = await deleteInOutItem({
					id: this.objItem.id
				})
				uni.showToast({
					title: '操作成功',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 300)
			},
			editorData() {
				uni.setStorageSync('recordCollectionData', this.objItem)
				
				uni.navigateTo({
					url: `/pages/packageE/record-collection/record-collection?isUpdate=2`
				})
			},
			onSelect(e) {
				console.log(e)
				if (e.id === 2) {
					// 弹窗提示
					this.modalShow = true
				}
			},
			rightClick() {
				this.show = true
			},
			async getData() {
				const {
					data
				} = await getDetailByNumber({
					number: this.number
				})

				this.objItem = data

				if (data.imgName) {
					this.imgList = data.imgName.split(',')
					console.log('图片', this.imgList)
				}

				this.list = [{
						id: 1,
						text: '单据编号：',
						value: data.number
					},
					{
						id: 2,
						text: '门店：',
						value: data.depotName
					},
					{
						id: 3,
						text: '业务员：',
						value: data.salesManStr
					},
					{
						id: 4,
						text: '制作人：',
						value: data.creatorStr
					},
					{
						id: 5,
						text: '制单时间：',
						value: data.createTime
					}
				]
				console.log('data', data)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.button {
		height: 90rpx;
		width: 260rpx;
		background: #fff;
		border-radius: 20rpx;
		border: 1px solid #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #000;
		margin: 10px auto;
	}

	.min-h {
		min-height: 200rpx;
		// height: 200rpx;
	}

	.w200 {
		width: 200rpx;
	}

	.image-list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;
		
		.img {
			margin: 0 8px 8px 0;
		}
	}

	.box {
		border-radius: 20rpx;
		background: #fff;
		padding: 25rpx;
		display: flex;
		flex-direction: column;
		margin-bottom: 17rpx;

		.times {
			display: flex;
			justify-content: flex-end;

			.slash {
				padding: 0 10rpx;
				color: #ccc;
			}
		}

		.list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 70rpx;

			.text {
				width: 200rpx;
			}

			.value {
				flex: 1;
			}
		}
	}
</style>