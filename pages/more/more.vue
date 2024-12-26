<template>
  <view>
    <AppletHeader title="更多" left-icon=" " right-icon=" "></AppletHeader>
    <view class="container">
      <view class="card" v-for="item in list" :key="item.id">
        <text class="title">{{ item.title }}</text>
        <view class="card-content">
          <view
            class="card-item flex-column flex-center flex-items-center"
            v-for="el in item.children"
            :key="el.path"
            @click="navigate(el.path)"
          >
            <image :src="staticImageUrl + el.imgUrl" mode="widthFix"></image>
            <text>{{ el.title }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import { staticImageUrl } from '@/common/contanst.js'
export default {
  data() {
    return {
      staticImageUrl,
      list: [
        {
          id: 1,
          title: '库存',
          children: [
            {
              title: '库存查询',
              path: '/pages/packageE/stock-check/stock-check',
              imgUrl: '/more/kucunchaxun.png'
            }
          ]
        },
        {
          id: 2,
          title: '资金',
          children: [
            {
              title: '日常收支',
              path: '/pages/packageE/daily-summary/daily-summary',
              imgUrl: '/more/richangshouzhi.png'
            },
            {
              title: '资金流水',
              path: '/pages/packageE/cash-flow/cash-flow',
              imgUrl: '/more/zijinliushui.png'
            },
            {
              title: '账户',
              path: '/pages/packageE/account/account',
              imgUrl: '/more/zhanghu.png'
            }
          ]
        },
        {
          id: 3,
          title: '报表',
          children: [
            {
              title: '销售统计',
              path: '/pages/packageE/sales-statistics/sales-statistics',
              imgUrl: '/more/xiaoshoutongji.png'
            }
          ]
        }
      ]
    }
  },
  onLoad() {},
  onShow() {
    ['flowScreenData', 'selectList', 't2screenData', 'productScreenData'].forEach(key => uni.removeStorageSync(key))
  },
  methods: {
    navigate(path) {
      if (path) {
        uni.navigateTo({ url: path })
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.card {
  background: #fff;
  padding: 25rpx;
  border-radius: 20rpx;
  margin-bottom: 17rpx;
  width: 100%;

  .title {
    color: #000;
    font-weight: 700;
    font-size: 32rpx;
    margin-bottom: 30rpx;
  }

  .card-content {
    display: flex;
    flex-wrap: wrap;

    .card-item {
      width: 25%;
      text-align: center;

      text {
        font-size: 32rpx;
      }

      image {
        width: 70rpx;
      }
    }
  }
}
</style>

