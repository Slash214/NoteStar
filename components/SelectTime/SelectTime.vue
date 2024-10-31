<template>
	<u-datetime-picker
		:minDate="minDate"
		:maxDate="maxDate"
		ref="datetimePicker"
		:formatter="formatter"
		@confirm="confirm"
		@cancel="cancel"
		:show="show"
		v-model="value1"
		mode="date"
	></u-datetime-picker>
</template>

<script>
import { timestampToDate } from '@/utils'
export default {
	name: 'SelectTime',
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			value1: Date.now() // 可以添加默认值，根据需要设置
		}
	},
	computed: {
		// 计算最小日期（过去20年）
		minDate() {
			const currentTimestamp = Date.now()
			return currentTimestamp - 20 * 365 * 24 * 60 * 60 * 1000
		},
		// 计算最大日期（未来10年）
		maxDate() {
			const currentTimestamp = Date.now()
			return currentTimestamp + 10 * 365 * 24 * 60 * 60 * 1000
		}
	},
	mounted() {
		// 确保组件加载完成后能正确设置日期格式
		this.$refs.datetimePicker.setFormatter(this.formatter)
	},
	methods: {
		formatter(type, value) {
			if (type === 'year') {
				return `${value}年`
			}
			if (type === 'month') {
				return `${value}月`
			}
			if (type === 'day') {
				return `${value}日`
			}
			return value
		},
		cancel() {
			this.$emit('cancel')
		},
		confirm(e) {
			// console.log(e.value)
			let obj = {
				temp: e.value,
				time: timestampToDate(e.value)
			}
			// console.log('obj', obj)
			this.$emit('confirm', obj) // 可以传递选择的值到父组件
		}
	}
}
</script>

<style lang="scss"></style>
