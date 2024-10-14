<template>
	<view>
		<AppletHeader title="资金流水"></AppletHeader>
		<view class="main">
			<view class="nav flex flex-between">
				<view class="">
					<u--text margin="0 0 0 5px" size="12" text="收入"></u--text>
					<u--text margin="5px 0" bold size="20" mode="price" text="78000"></u--text>
					<u--text margin="0 0 0 5px" size="12" text="共15笔记"></u--text>
				</view>

				<view class="">
					<u--text margin="0 0 0 5px" size="12" text="支出"></u--text>
					<u--text margin="5px 0" bold size="20" mode="price" text="178000"></u--text>
					<u--text margin="0 0 0 5px" size="12" text="共15笔记"></u--text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getCapitalFlow } from '@/apis'
export default {
	data() {
		return {}
	},
	methods: {}
}
</script>

<style scoped lang="scss">
.main {
	.nav {
		height: 300rpx;
		background-color: #ffaf38;
		-webkit-clip-path: ellipse(100% 68% at 50% 30%);
		clip-path: ellipse(100% 68% at 50% 30%);
		padding: 40rpx 80rpx;
	}
}
</style>
