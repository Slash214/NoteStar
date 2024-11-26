<template>
	<view class="page">
		<AppletHeader title="筛选" right-icon=" "></AppletHeader>
		<view class="main">
			<text class="title">排序条件</text>
			<view class="list-box">
				<view v-for="item in list" :key="item.id" :class="item.select ? 'active' : ''" @click="onSelect(item)">
					{{item.name}}
				</view>

			</view>
			<text class="title">无库存商品</text>
			<view class="list-box">
				<view v-for="item in list1" :key="item.id" :class="item.select ? 'active' : ''"
					@click="onSelectShop(item)">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="clear" @click="clearAll">
				清空条件
			</view>
			<view class="sure" @click="handleClik">
				确定
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						id: 1,
						select: true,
						name: '升序'
					},
					{
						id: 2,
						select: false,
						name: '降序'
					},
				],
				list1: [{
						id: 1,
						select: true,
						name: '不显示'
					},
					{
						id: 2,
						select: false,
						name: '显示'
					},
				]
			}
		},
		onLoad() {
		   const obj = uni.getStorageSync('stockData') || null
		   if (obj) {
			   console.log(obj)
			   
			   if (obj.enabled) {
				   this.list1[0].select = false
				   this.list1[1].select = true
			   } else {
				   this.list1[1].select = false
				   this.list1[0].select = true
			   }
			   
			   
			   this.list.forEach(e => {
				   e.select = e.id === obj.sortRule
			   })
			   
		   }
		},
		methods: {
			onSelect(item) {
				this.list.forEach(e => {
					e.select = false
					if (e.id === item.id) {
						e.select = true
					}
				})
			},
			clearAll() {
				this.list.forEach(e => e.select = false)
				this.list1.forEach(e => e.select = false)
				
				this.list[0].select = true
				this.list1[0].select = true
			},
			onSelectShop(item) {
				this.list1.forEach(e => {
					e.select = false
					if (e.id === item.id) {
						e.select = true
					}
				})
			},
			handleClik() {
				let obj = this.list.filter(item => item.select)[0]
				let obj2 = this.list1.filter(item => item.select)[0]
				console.log(obj, obj2)
				
				let sortRule = obj.id === 1 ? 1 : 2 
				let enabled = obj2.id === 1 ? false : true
				let i = { sortRule, enabled }
				uni.setStorageSync('stockData', i)
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">

	.main {
		width: 100vw;
		height: 100vh;
		background-color: #fff;
		overflow: hidden;
		padding: 30rpx;

		.title {
			display: inline-block;
			font-weight: 700;
			margin-left: 15rpx;
			margin-bottom: 20rpx;
		}

		.list-box {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 20rpx;

			view {
				flex: 0 0 calc(33.33% - 20rpx);
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				width: 180rpx;
				height: 90rpx;
				background: #fff;
				border-radius: 20rpx;
				border: 1px solid #ccc;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #000;
			}

			.active {
				background-color: #FEF6E9;
				color: #FFAF38;
				border: 1px solid #FFAF38;
			}
		}
	}

	.bottom {
		position: fixed;
		z-index: 1000;
		background-color: #fff;
		bottom: 0;
		width: 100%;
		height: 200rpx;
		display: flex;
		justify-content: space-between;
		padding: 25rpx 25rpx 0;
		box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);

		.clear {
			width: 104px;
			margin-right: 10px;
			height: 90rpx;
			background: #fff;
			border-radius: 20rpx;
			border: 1px solid #ccc;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #000;
		}


		.sure {
			flex: 1;
			width: 180rpx;
			height: 90rpx;
			background: linear-gradient(to right, #FFAF38, #FAC575);
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-weight: 700;
		}
	}
</style>