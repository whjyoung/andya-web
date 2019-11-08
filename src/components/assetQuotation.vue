<!--资产行情-->
<template>
  <div id="assetQuotation">
    <div class="quotationTitle">
      <div class="line"></div>
      <div class="asset_title">资产行情</div>
    </div>
    <div class="hot">
      <div class="hot_top">
        <img src="@/assets/images/hot.png" alt /> 热门行情
      </div>
      <swiper :options="swiperOption" v-if="hotData.length>0">
        <swiper-slide v-for="data in hotData" :key="data.id">
          <div class="hotContent" v-for="item in data" :key="item.id">
            <div class="name">{{item.stockType}}</div>
            <div :class="{red:item.increase === 1,green:item.increase === -1}">{{item.lastTrade}}</div>
            <div :class="{red:item.increase === 1,green:item.increase === -1}">{{item.chg}}</div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="realCash">
      <img src="@/assets/images/cash.png" alt />质押物实时价值
    </div>
    <div class="effect">
      <div class="topLine">
        <span>质押公司</span>
        <span>贷款日期</span>
        <span>融资金额</span>
        <span>质押种类</span>
        <span>质押价值</span>
        <span>状态</span>
      </div>
      <!-- 轮播 -->
      <swiper :options="swiperlistOption" v-if="listData.length>0">
        <swiper-slide style="height:unset;" v-for="list in listData" :key="list.id">
          <div class="topData" v-for="item in list" :key="item.id">
            <span style="flex:0 0 18%;">{{item.name}}</span>
            <span style="flex:0 0 20%;">{{item.loanDate}}</span>
            <span style="flex:0 0 18%;">{{item.loanAmount | numFormat}}元</span>
            <span style="flex:0 0 15%;">{{item.stockType}}</span>
            <span style="flex:0 0 20%;">{{item.currentAmount | numFormat}}元</span>
            <span style="flex:1;">{{item.statusDesc}}</span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
import * as api from "@/common/api"; //引入接口
export default {
  name: "assetQuotation",
  data() {
    return {
      swiperOption: {
        //设置自动播放速度
        autoplay: {
          disableOnInteraction: false,
          delay: 5000
        },
        speed: 2000, //切换速度
        //开启无限循环
        loop: true
      },
      swiperlistOption: {
        //设置自动播放速度
        autoplay: {
          disableOnInteraction: false,
          delay: 5000
        },
        direction: "vertical",
        speed: 2000, //切换速度
        loop: true
      },
      hotData: [], //热门行情
      listData: [] //质押物实时价值
    };
  },
  filters: {
    // 过滤器 3位一逗号分隔 小数点 无小数点
    numFormat: function(value) {
      if (value.toString().indexOf(".") > 0) {// 有小数点
        var arr = value.toString().split(".");
        var t1 = arr[0].toString().split("");
        var t2 = arr[1].toString();
        var result = [],
          counter = 0;
        for (var i = t1.length - 1; i >= 0; i--) {
          counter++;
          result.unshift(t1[i]);
          if (counter % 3 == 0 && i != 0) {
            result.unshift(",");
          }
        }
        var t3 = result.join("");
        var t4 = t3 + "." + t2;
        return t4;
        console.log("t4", t4);
      } else {
        return value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      }
    }
  },
  mounted() {
    //请求热门行情
    api.getHotQuotes().then(res => {
      let data = [];
      let result = res.data;
      for (var i = 0; i < result.length; i += 4) {
        data.push(result.slice(i, i + 4));
      }
      this.hotData = data;
    })
    .catch(err => {
      this.$message.error(err);
    });
    // 请求质押物实时价值
    api.getStockList().then(res => {
      let data = [];
      let result = res.data;
      for (var i = 0; i < result.length; i += 6) {
        data.push(result.slice(i, i + 6));
      }
      this.listData = data;
    })
    .catch(err => {
      this.$message.error(err);
    });
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
#assetQuotation {
  height: 600px;
  background: #2d323b;
  .quotationTitle {
    .flex-row("", flex-end);
    .line {
      .line();
    }
    .asset_title {
      font-size: 16px;
      font-weight: bold;
      padding-top: 14px;
      width: 100px;
      .border-bottom(4px, #00a0e9);
      padding-bottom: 5px;
    }
  }
  .hot {
    .swiper-container {
      margin-left: 20px;
    }
    .swiper-slide {
      width: 100% !important;
      .flex-row(space-around, "");
    }
    .hot_top {
      font-size: 14px;
      display: flex;
      margin: 22px 0 16px 24px;
      img {
        margin-right: 5px;
      }
    }
    .hotContent {
      text-align: center;
      width: 84px;
      height: 96px;
      .flex-column(space-evenly, "");
      font-size: 14px;
      background: #373e4a;
      .name {
        font-weight: bold;
      }
      .red {
        color: #db3434;
      }
      .green {
        color: #4de35c;
      }
    }
  }
  .realCash {
    font-size: 14px;
    margin: 24px 0 10px 24px;
    img {
      margin-right: 5px;
    }
  }
  .effect {
    margin: 0 10px 0 20px;
    .topLine {
      .flex-row("", center);
      font-size: 12px;
      text-align: center;
      background: #373e4a;
      color: #dddddd;
      width: 100%;
      padding: 10px 0;
      font-family: "SimSun";
      span:first-child {
        flex: 0 0 18%;
      }
      span:nth-child(2) {
        flex: 0 0 20%;
      }
      span:nth-child(3) {
        flex: 0 0 18%;
      }
      span:nth-child(4) {
        flex: 0 0 15%;
      }
      span:nth-child(5) {
        flex: 0 0 20%;
      }
      span:last-child {
        flex: 1;
      }
    }
    .topData {
      .flex-row("", center);
      font-size: 12px;
      text-align: center;
      word-break: break-all;
      .border-bottom(1px, #363f4e);
      padding: 10px 0;
      font-family: "SimSun";
      span:first-child {
        .two-clamp();
      }
    }
    .swiper-container {
      height: 310px;
    }
    .swiper-slide {
      .flex-column(flex-start, "");
    }
  }
}
</style>