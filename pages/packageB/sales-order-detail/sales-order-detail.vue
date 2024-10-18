<template>
	<view>
		<AppletHeader title="销售单详情"></AppletHeader>
		<view class="container">
			<view class="white box">
				<view class="flex flex-between flex-items-center">
					<text>{{ name }}</text>
					<text>{{ time }}</text>
				</view>
				<u-divider :dot="true"></u-divider>
				<view class="flex flex-items-center" v-for="item in list" :key="item.id">
					<text class="mr15">{{ item.text }}：</text>
					<text>{{ item.desc }}</text>
				</view>
			</view>

			<view class="white product mt10">
				<view class="title mb20">
					<text class="line"></text>
					<text>销售商品</text>
				</view>
			
			    <view class="flex mb20" v-for="item in productList" :key="item.id">
			     	<view class="imagebox">
			     		<image :src="item.imgName" mode="aspectFit"></image>
			     	</view>
					<view class="content">
						<u--text :text="item.name"></u--text>
						<u--text :text="item.barCode"></u--text>
						<view class="flex">
							<view class="flex">
								<u--text mode="price" :text="item.unitPrice"></u--text>
								<text>x{{item.operNumber}}</text>
							</view>
							<u--text align="right" mode="price" :text="item.allPrice"></u--text>
						</view>
					</view>
			    </view>
			</view>

			<view class="white box mt10">
				<view class="flex flex-items-center" v-for="item in bootomList" :key="item.id">
					<text class="mr15 mb5">{{ item.text }}：</text>
					<u--text :mode="item.id !== 1 ? 'price' : 'text'" :text="item.desc"></u--text>
				</view>
			</view>

			<view class="white remark mt10">
				<u--text text="备注"></u--text>
				<u--text :text="remark"></u--text>
			</view>
		</view>
	</view>
</template>

<script>
import { formatDateToChinese } from '@/utils'
import { getDetailByNumbe } from '@/apis'
export default {
	data() {
		return {
			number: '',
			list: [],
			bootomList: [],
			name: '',
			time: '',
			remark: '',
			productList: []
		}
	},
	onLoad(options) {
		console.log('是多少', options)
		this.number = options?.number || ''
		this.getData()
	},
	methods: {
		async getData() {
			const { data } = await getDetailByNumbe({
				number: this.number
			})

			let {
				number,
				depotName,
				creatorName,
				salesName,
				operTime,
				discount,
				discountLastMoney,
				otherMoney,
				changeAmount,
				totalPrice,
				createTime,
				organName,
				remark,
				fileName,
				depotHeadMaterialVoList
			} = data || {}

			this.list = [
				{ id: 1, text: '单据编号', desc: number },
				{ id: 2, text: '门店', desc: depotName },
				{ id: 3, text: '业务员', desc: salesName },
				{ id: 4, text: '制单人', desc: creatorName },
				{ id: 5, text: '制单时间', desc: formatDateToChinese(operTime) }
			]

			this.name = organName
			this.time = formatDateToChinese(createTime)
			this.remark = remark
			this.bootomList = [
				{ id: 1, text: '整单折扣', desc: discount },
				{ id: 2, text: '折后金额', desc: discountLastMoney },
				{ id: 3, text: '运费', desc: otherMoney },
				{ id: 4, text: '本单应收', desc: totalPrice },
				{ id: 5, text: '本单已收', desc: changeAmount }
			]
			this.productList = depotHeadMaterialVoList
			console.log('数据', data)
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	.white {
		background-color: #fff;
		padding: 25rpx;
		border-radius: 20rpx;
	}

	.product {
		.title {
			font-weight: 700;
			height: 60rpx;
			.line {
				width: 6rpx;
				height: 30rpx;
				background-color: #5fcadd;
				margin-right: 15rpx;
			}
		}
		
		.imagebox {
			width: 60px;
			height: 60px;
			border-radius: 20rpx;
			margin-right: 10px;
			background-color: #CDD7DC;
			overflow: hidden;
		}
		.content {
			flex: 1;
		}
	}

	.box {
		text-align: justify;
		text {
			line-height: 2;
			color: #575757;
			font-size: 28rpx;
			&:first-child {
				width: 160rpx;
				font-weight: 600;
			}
		}
	}

	.remark {
		height: 300rpx;
	}
}
</style>
