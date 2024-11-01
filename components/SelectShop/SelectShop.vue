<template>
	<view>
		<u-picker @cancel="cancel"  @close="" @confirm="confirm" closeOnClickOverlay :show="show" keyName="name" :columns="columns"></u-picker>
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
			columns: []
		}
	},
	methods: {
		confirm(e) {
			console.log(e)
			let item = e.value[0]
			this.$emit('confirm', item)
		},
		cancel(e) {
			this.$emit('cancel', true)
			console.log(e)
		}
	},
	async created() {
		const user = uni.getStorageSync('userInfo')
		const { data } = await getDepotByUserId({ userId: user.id })
		let list = data.map((item) => ({
			id: item.id,
			name: item.name
		}))
		if (this.all) {
			list.unshift({ name: '全部门店', id: 0,})
		}
		console.log('list', list)
		this.columns = [list]
	},
}
</script>

<style lang="scss"></style>
