<template>
	<view>
		<AppletHeader title="选择门店" right-icon="确定" @rightClick="saveData" right-icon-size="15"></AppletHeader>
		<view class="container">
			<view class="box flex" v-for="item of shopList" :key="item.id" @click="onSelect(item)">
				<u-icon :name="item.checked ? checkedImage : checkImage" size="22"></u-icon>
				<text class="label">{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { getDepotByUserId } from '@/apis'
export default {
	data() {
		return {
			shopList: [],
			copyShopList: [],
			activeList: [],
			activeColor: '#5AC6DA',
			checkImage: 'https://haoxianhui.com/hxh/2024/11/25/67525300bcf34dcb9147178bdf047417.png',
			checkedImage: 'https://haoxianhui.com/hxh/2024/11/25/e7e65f5fcfdf4c54b302a6d1c461414a.png'
		}
	},
	methods: {
		saveData() {
			this.activeList = this.shopList.filter((item) => item.checked).map((item) => ({ 
				name: item.name,
				id: item.id
			})).filter(e => e.id)
			console.log('选择的', this.activeList)
			uni.setStorageSync('selectShop', this.activeList)
			uni.navigateBack()
		},
		onSelect(item) {
			console.log(item)
			item.checked = !item.checked
			if (item.id === 0) {
				this.shopList.forEach((e) => {
					e.checked = item.checked
				})
			} else {
				// 点击了单个的
				console.log('')
				this.shopList[0].checked = false
			}
		}
	},
	async onLoad() {
		const user = uni.getStorageSync('userInfo')

		console.log('user')

		const { data } = await getDepotByUserId({ userId: user.id })
		let list = data.map((item) => ({
			id: item.id,
			name: item.name,
			checked: false
		}))
		this.copyShopList = JSON.parse(JSON.stringify(list))
		list.unshift({ name: '全部门店', id: 0, checked: false })
		this.shopList = list
		console.log('list', list)
		
		
		// 判断有没有缓存
		const cache = uni.getStorageSync('selectShop')
		if (cache) {
			console.error('cache', cache)
			cache.forEach(item => {
				this.shopList.forEach(e => {
					if (item.id === e.id) {
						e.checked = true
					}
				})
			})
		}
		
	},

}
</script>

<style scoped lang="scss">
.container {
	background-color: #fff;
	padding-bottom: 40px;
	.box {
		width: 100%;
		align-items: center;
		padding: 20px 15px;
		font-size: 28rpx;
		color: #141414;

		.label {
			padding-left: 10px;
		}
	}
}
</style>
