<template>
	<view>
		<u-picker @cancel="cancel"  @close="cancel" @confirm="confirm" closeOnClickOverlay :show="show" keyName="name" :columns="columns"></u-picker>
	</view>
</template>

<script>
import { getDepotByUserId } from '@/apis'
export default {
	name: 'SelectShop',
	props: {
		show: {
			type: Boolean,
			default: false
		},
		all: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			columns: [],
			array: [],
			length: 0
		}
	},
	methods: {
		confirm(e) {
			let item = e.value[0]
			if (item.id === 0) {
				let ids = this.array.map(item => item.id).join(',')
				this.$emit('getAllId', ids)
			}
			
			this.$emit('confirm', item)
		},
		cancel(e) {
			this.$emit('cancel', true)
		}
	},
	async created() {
		const user = uni.getStorageSync('userInfo')
		const { data } = await getDepotByUserId({ userId: user.id })
		let list = data.map((item) => ({
			id: item.id,
			name: item.name
		}))
		this.array = JSON.parse(JSON.stringify(list))
		if (this.all) {
			list.unshift({ name: '全部门店', id: 0,})
		}
		console.log('list', list)
		this.columns = [list]
	},
}
</script>

<style lang="scss"></style>
