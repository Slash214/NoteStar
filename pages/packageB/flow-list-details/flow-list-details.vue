<template>
	<view>
		<AppletHeader title="流水详情" right-icon=" "></AppletHeader>
		<view class="container">
			<view class="box">
				<view class="center">
					<text class="type"> {{objItem.type}}</text>
					<text class="money"> {{objItem.money}}</text>
				</view>

				<view class="mid">
					<view>
						<text class="label">类型:</text>
						<text> {{objItem.type}}</text>
					</view>
					<view>
						<text class="label">账户:</text>
						<text>{{objItem.accountName || '默认账户'}}</text>
					</view>
				</view>

				<view class="bottom">
					<view class="flex">
						<text class="label">业务单号:</text>
						<view class="flex flex-between" style="flex: 1;" @click="gotoDetails(objItem.number)">
							<text>{{objItem.number}}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
					<view>
						<text class="label">操作时间:</text>
						<text>{{objItem.createTimeStr}}</text>
					</view>
					<view>
						<text class="label">门店:</text>
						<text>{{objItem.salesManStr || '全部门店'}}</text>
					</view>
					<view>
						<text class="label">业务员:</text>
						<text>{{objItem.supplierName || ''}}</text>
					</view>
					<view>
						<text class="label">备注:</text>
						<text>{{objItem.remark || '无'}}</text>
					</view>
					<view>
						<text class="label">介绍费:</text>
						<text>现金</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				objItem: {}
			}
		},
		onLoad(options) {
			console.log(options)
			let obj = options.obj
			this.objItem = JSON.parse(obj)
			console.log(this.objItem)
		},
		methods: {
			gotoDetails(number) {
				if (this.objItem.type.includes('销售') || this.objItem.type.includes('进货')) {
					let type = this.objItem.type.includes('销售') ? 1 : 2
					let status = this.objItem.type.includes('订金') ? 2 : 1
					uni.navigateTo({
						url: `/pages/packageB/sales-order-detail/sales-order-detail?type=${type}&number=${number}&status=${status}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/packageE/daily-details/daily-details?number=${number}`
					})
				}
			}

		}
	}
</script>

<style scoped lang="scss">
	.box {
		border-radius: 20rpx;
		background: #fff;
		padding: 25rpx;

		.center {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.type {
				color: #000;
				font-weight: 600;
				font-size: 32rpx;
			}

			.money {
				color: #FFAF38;
				font-size: 54rpx;
				font-weight: 600;
				margin-top: 30rpx;
			}
		}

		.mid {
			margin-top: 30px;

			view {
				margin-bottom: 20rpx;

				.label {
					width: 200rpx;
					text-align: justify;
				}
			}
		}

		.bottom {
			margin-top: 30px;

			view {
				margin-bottom: 24rpx;
				line-height: 1.5;

				.label {
					width: 200rpx;
					text-align: justify;
				}
			}
		}
	}
</style>