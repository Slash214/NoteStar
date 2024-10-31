<template>
	<view>
		<u-navbar placeholder :autoBack="true" bgColor="rgba(255,255,255,0)">
			<view class="nav-content" slot="center">
				<text @click="currIndex = 1" :class="currIndex === 1 ? 'active' : ''">收入</text>
				<text @click="currIndex = 2" :class="currIndex === 2 ? 'active' : ''">支出</text>
			</view>
		</u-navbar>

		<view class="container">
			<view class="box">
				<u--form labelPosition="left" labelWidth="100" :labelStyle="{ fontSize: '14px', lineHeight: 2 }">
					<u-form-item label="门店" required borderBottom @click="handleClick(item)">
						<view class="flex flex-between">
							<text>店铺名称</text>
							<u-icon name="arrow-down-fill" size="14" color="#c0c4cc"></u-icon>
						</view>
					</u-form-item>
				</u--form>
			</view>

			<view class="box">
				<u--form labelPosition="left" labelWidth="100" :labelStyle="{ fontSize: '14px', lineHeight: 2 }">
					<u-form-item v-for="item of formList" :key="item.id" :required="item.required" :label="item.title" prop="item.id" borderBottom @click="handleClick(item)">
						<u--input v-if="!item.right" prefixIcon="￥" placeholder="0.00" v-model="item.value" border="none"></u--input>
						<view class="flex flex-between" v-else>
							<text :class="item.select ? 'select' : 'no-select'">{{ item.value }}</text>
							<u-icon :name="item.right" size="14" color="#c0c4cc"></u-icon>
						</view>
					</u-form-item>
				</u--form>
			</view>

			<view class="box remark">
				<u--text text="备注" margin="10px"></u--text>
				<u--textarea border="none" v-model="remark" placeholder="请输入内容"></u--textarea>
			</view>
		</view>

		<view class="fixed-bottom">
			<view class="dailyInOut" @click="saveData">保存</view>
		</view>

		<u-picker :show="showPerson" @cancel="showPerson = false" @confirm="confirmPerson" keyName="userName" :columns="[person]"></u-picker>
		<u-picker :show="showType" @cancel="showType = false" @confirm="confirmType" keyName="label" :columns="[list]"></u-picker>
		<select-time :show="showTime" @cancel="showTime = false" @confirm="confirmTime"></select-time>
	</view>
</template>

<script>
import { getUserByDepotId } from '@/apis'
import { timestampToDate } from '@/utils'
import SelectTime from '@/components/SelectTime/SelectTime.vue'
export default {
	components: {
		SelectTime
	},
	data() {
		return {
			// 1 收入   2是 支出
			currIndex: 1,
			remark: '',
			curTemp: '',
			formList: [
				{ id: 1, title: '收入金额', required: true, value: '', right: '', select: false },
				{ id: 2, title: '账户', required: true, value: '现金', right: 'arrow-down-fill', select: true },
				{ id: 3, title: '收入类型', required: true, value: '请选择收入类型', right: 'arrow-down-fill', select: false },
				{ id: 4, title: '时间', required: false, value: '', right: 'arrow-down-fill', select: false },
				{ id: 5, title: '业务员', required: true, value: '', right: 'arrow-down-fill', select: false }
			],
			// 收入类型show 控制
			showType: false,
			// 选择时间的
			showTime: false,
			// 选择业务员
			showPerson: false,
			list: [
				{ id: 1, label: '投资款' },
				{ id: 2, label: '合作分红' },
				{ id: 3, label: '代销提成' },
				{ id: 4, label: '其他收入' }
			],
			person: []
		}
	},
	onLoad() {
		const time = timestampToDate(Date.now())
		console.log(time)
		this.formList[3].value = time
		this.formList[3].select = true
		this.getData()
	},
	methods: {
		confirmTime(e) {
			this.showTime = false
			console.log(e)
			this.formList[3].value = e.time
		},
		// 确认选择收入类型
		confirmType(e) {
			console.log(e.value[0])
			let obj = e.value[0]
			this.showType = false
			this.formList[2].value = obj.label
			this.formList[2].select = true
		},
		async getData() {
			const { data } = await getUserByDepotId({
				depotId: 1
			})
			this.person = data
			console.log(data)
		},
		handleClick(item) {
			console.log(item)
			if (item.id === 3) {
				this.showType = true
			}

			if (item.id === 4) {
				this.showTime = true
			}
			
			if (item.id === 5) {
				this.showPerson = true
			}
		},
		saveData() {
			console.log('保存数据')
		}
	}
}
</script>

<style lang="scss" scoped>
.nav-content {
	display: flex;
	align-items: center;
	font-size: 36rpx;
	font-weight: 600;

	text {
		color: #93969d;
		position: relative;
		margin: 0 10px;
	}

	.active {
		color: #333;
		&::after {
			content: '';
			position: absolute;
			bottom: -3rpx;
			left: 5rpx;
			width: 85%;
			height: 8rpx;
			border-radius: 40rpx;
			background: linear-gradient(to right, #f2b759, #e5f0f6);
			border-top-left-radius: 20px;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;
			border-bottom-left-radius: 20px;
			background-image: linear-gradient(to right, rgb(242, 183, 89), rgb(229, 240, 246));
		}
	}
}

.container {
	.box {
		border-radius: 20rpx;
		background: #fff;
		padding: 0 40rpx;
		margin-bottom: 17rpx;

		.select {
			color: #333;
		}

		.no-select {
			color: #c0c4cc;
		}
	}

	.remark {
		padding: 20rpx;
	}
}

.dailyInOut {
	width: 95%;
	margin: auto;
	height: 90rpx;
	background: linear-gradient(to right, #ffaf38, #fac575);
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-weight: 700;
}
</style>
