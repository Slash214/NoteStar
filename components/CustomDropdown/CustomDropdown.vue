<template>
	<view class="dropdown">
		<view class="dropdown-item" @click="toggleStoreVisible">
			<text style="padding-right: 5px">{{ curName }}</text>
			<u-icon name="arrow-down-fill" size="8" color="#c0c4cc" />
		</view>
		<view class="dropdown-item" @click="toggleTimeVisible">
			<text style="padding-right: 5px">{{ formattedTime }}</text>
			<u-icon name="arrow-down-fill" size="8" color="#c0c4cc" />
		</view>

		<u-popup :show="storeVisible" :round="10" mode="bottom" @close="toggleStoreVisible">
			<scroll-view scroll-y class="store">
				<view class="store-item flex flex-between flex-items-center" v-for="item in list" :key="item.id"
					@click="selectStore(item)">
					<text>{{ item.name }}</text>
					<u-icon v-if="item.select" name="checkbox-mark" size="16" color="#3775FE"></u-icon>
				</view>
			</scroll-view>
		</u-popup>

		<u-picker title="查询月份或者日期" @confirm="getTimeStatus" @cancel="toggleTimeVisible" :show="timeVisible"
			:columns="columns"></u-picker>

		<u-datetime-picker ref="datetimePicker" :formatter="formatter" :show="show" v-model="times"
			:mode="curIndex === 1 ? 'date' : 'year-month'" @confirm="getSelectTime"
			@cancel="toggleTimeSelect"></u-datetime-picker>
	</view>
</template>

<script>
	import {
		props
	} from "../../uni_modules/uview-ui/libs/mixin/mixin";
	import {
		getDepotByUserId
	} from "@/apis";

	export default {
		name: "CustomDropdown",
		props: {
			/**
			 * 控制是按“日”还是“月”来选择
			 * 1 = 日；2 = 月；如果不传，则默认值是 2
			 */
			currIndex: {
				type: Number,
				default: 2, // 默认按“月”选择
			},
		},
		data() {
			return {
				storeVisible: false,
				timeVisible: false,
				show: false,
				columns: [
					["日", "月"]
				],
				list: [],
				curIndex: 2,
				times: Date.now(),
				curName: "全部门店",
			};
		},
		computed: {
			formattedTime() {
				return this.curIndex === 1 ?
					`日 ${this.formatTime(this.times, "yyyy-MM-dd")}` :
					`月 ${this.formatTime(this.times, "yyyy-MM")}`;
			},
		},
		async created() {
			const user = uni.getStorageSync("userInfo");
			if (user) {
				const {
					data
				} = await getDepotByUserId({
					userId: user.id
				});
				this.list = [{
						name: "全部门店",
						select: true,
						id: 0,
						location: "全部",
					},
					...data.map((item) => ({
						name: item.name,
						select: false,
						id: item.id,
						location: item.location,
					})),
				];

			}
		},
		mounted() {
			this.$refs.datetimePicker.setFormatter(this.formatter);

			if (this.currIndex) {
				this.curIndex = this.currIndex
			}
		},
		methods: {
			formatter(type, value) {
				const formatMap = {
					year: `${value}年`,
					month: `${value}月`,
					day: `${value}日`,
				};
				return formatMap[type] || value;
			},
			toggleStoreVisible() {
				this.storeVisible = !this.storeVisible;
			},
			toggleTimeVisible() {
				this.timeVisible = !this.timeVisible;
			},
			toggleTimeSelect() {
				this.show = !this.show;
			},
			selectStore(item) {
				this.list.forEach((e) => {
					e.select = e.id === item.id;
				});
				this.toggleStoreVisible();
				this.curName = item.name;
				this.$emit("selectStore", item);
			},
			getSelectTime(val) {
				this.toggleTimeSelect();
				this.$emit("selectTime", val);
			},
			getTimeStatus(v) {
				this.curIndex = v.value[0] === "日" ? 1 : 2;
				this.toggleTimeVisible();
				this.toggleTimeSelect();
			},
			formatTime(timestamp, format) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDate();
				const formatMap = {
					"yyyy-MM-dd": `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`,
					"yyyy-MM": `${year}-${month.toString().padStart(2, "0")}`,
				};
				return formatMap[format];
			},
		},
	};
</script>

<style scoped lang="scss">
	.dropdown {
		position: relative;
		height: 82rpx;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 10px;
		border-radius: 5px;

		&-item {
			font-size: 28rpx;
			color: #606266;
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.store {
		width: 100%;
		height: 300px;
		box-sizing: border-box;

		.store-item {
			border-bottom: 1rpx solid #f2f2f2;
			width: 100%;
			padding: 26rpx 32rpx;
			font-size: 28rpx;
			line-height: 54rpx;
			color: #606266;
			text-align: justify;
		}
	}
</style>