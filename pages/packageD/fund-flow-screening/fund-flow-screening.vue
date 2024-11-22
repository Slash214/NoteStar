<template>
	<view>
		<AppletHeader title="筛选" right-icon=" "></AppletHeader>
		<view class="container">
			<view class="block" v-for="item in dataList" :key="item.id">
				<u--text bold margin="0 0 10px 5px" size="16" :text="item.name"></u--text>
				<view class="grid">
					<view
						v-for="el of item.data"
						:key="el.id"
						@click="handleClick(item.id, el)"
						:class="el.select ? 'grid-item select-j' : 'grid-item'"
					>
						{{ el.name }}
					</view>
				</view>
			</view>
		</view>

		<view class="hxh-fixed-bottom">
			<view class="cancel" @click="onCancel">清空条件</view>
			<view class="comfirm" @click="onfirm">确定</view>
		</view>
	</view>
</template>

<script>
import { getAccountByDepotId, getUserByDepotId } from '@/apis'
export default {
	data() {
		return {
			dataList: [],
			depotId: 0
		}
	},
	onLoad() {
		this.getData()
	},

	methods: {
		handleClick(id, item) {
			console.log('id', id, item)
			let data = this.dataList.filter((item) => item.id === id)[0]?.data
			data.forEach((e) => {
				e.select = e.id === item.id
			})
		},
		onCancel() {
		   console.log('取消')
		   this.dataList.forEach(item => {
			   item.data.forEach(e => {
				   e.select = false
				   if (!e.id) e.select = true
			   })
		   })
		},
		onfirm() {
			// 账户
			const obj1 = this.dataList[0].data.filter(item => item.select)[0]
			// 业务员
			const obj2 = this.dataList[1].data.filter(item => item.select)[0]
			console.log(obj1, obj2)
			let obj = {
				accountId: obj1.id,
				salesMan: obj2.id
			}
			uni.setStorageSync('flowScreenData', obj)
			uni.navigateBack()
		},
		async getData() {
			const [r1, r2] = await Promise.all([
				getUserByDepotId({ depotId: this.depotId }),
				getAccountByDepotId({ depotId: this.depotId })
			])

			console.log(r1, r2)
			let array = r2.data.info.map((item) => ({
				...item,
				id: item.accountId,
				select: false,
				name: item.bankName
			}))

			let list = r1.data.map((item) => ({
				...item,
				name: item.userName,
				select: false
			}))

			array.unshift({ id: 0, select: true, name: '全部' })
			list.unshift({ id: 0, select: true, name: '全部' })

			this.dataList = [
				{ id: 1, data: array, name: '账户' },
				{ id: 2, data: list, name: '业务员' }
			]
			
			const cacheObj = uni.getStorageSync(`flowScreenData`)
			if (cacheObj) {
				// 业务员
				let sId = cacheObj.salesMan
				// 账户
				let aId = cacheObj.accountId
				
				this.dataList[0].data.forEach(e => {
					e.select = e.id === aId 
				})
				
				this.dataList[1].data.forEach(e => {
					e.select = e.id === sId 
				})
			}
		}
	}
}
</script>

<style scoped lang="scss">
.container {
	background-color: #fff;
	padding-bottom: 100px;
	.block {
		margin-bottom: 60rpx;
		.grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: 1fr;
			grid-column-gap: 20rpx;
			grid-row-gap: 20rpx;

			.grid-item {
				border-radius: 20rpx;
				background-color: #fff;
				border: 1px solid #ccc;
				height: 90rpx;
				text-align: center;
				line-height: 90rpx;
			}

			.select {
				background-color: #e9f0fd;
				color: #3775fe;
				border: 1px solid #3775fe;
			}

			.select-j {
				background-color: #fceee3;
				color: #fa6400;
				border: 1px solid #fa6400;
			}
		}
	}
}

.hxh-fixed-bottom {
	position: fixed;
	z-index: 1000;
	background-color: #fff;
	bottom: 0;
	width: 100%;
	height: 200rpx;
	display: flex;
	justify-content: space-between;
	padding: 25rpx;
	box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);

	.cancel {
		height: 90rpx;
		background: #fff;
		border-radius: 20rpx;
		border: 1px solid #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #000;
		width: 104px;
		margin-right: 10px;
	}

	.comfirm {
		flex: 1;
		height: 90rpx;
		background: linear-gradient(to right, #ffaf38, #fac575);
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-weight: 700;
	}
}
</style>
