<!--告警事件详情-->
<template>
  <div class="warnDetail">
    <div class="d_title">
      <img src="@/assets/images/detail.png" alt />
      告警事件详情
    </div>
    <div class="detail_title">
      <span style="flex:0 0 20%;">时间</span>
      <span style="flex:0 0 18%;">告警类型</span>
      <span style="flex:0 0 20%;">出质人</span>
      <!-- <span style="flex:0 0 15%;">动产编号</span> -->
      <span style="flex:0 0 20%;">仓库编号</span>
      <span style="flex:1">状态</span>
    </div>
    <div class="detail_con" v-for="(item,index) in detailList" :key="index">
      <span style="flex:0 0 20%;">{{item.date}}</span>
      <span style="flex:0 0 18%;">{{item.alarmTypeDesc}}</span>
      <span style="flex:0 0 20%;">{{item.companyName}}</span>
      <!-- <span style="flex:0 0 15%;">{{item.chattelNumber}}</span> -->
      <span style="flex:0 0 20%;">{{item.storeSerialNumber}}</span>
      <span style="flex:1">{{item.done}}</span>
    </div>
  </div>
</template>
<script>
import * as api from "@/common/api"; //引入接口
export default {
  props: {
    detailFlag:{
      type:Number
    }
  },
  data() {
    return {
      detailList: [], //详情列表
      changeList:[] //改变后的列表
    };
  },
  watch:{ // 监听数据是否改变
    detailFlag:{
      handler(newVal, oldVal) {
        console.log("刷新详情");
        this.getWarningDetail();
        console.log(newVal,oldVal)
      },
      // 代表在wacth里声明了detailFlag这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true,   //对象内部属性的监听，关键。
    }
  },
  mounted() {
    //获取告警详情
    this.getWarningDetail();
  },
  methods: {
    getWarningDetail() {
      api.getAlarmList().then(res => {
        this.detailList = res.data.slice(0, 4);
      })
      .catch(err => {
        this.$message.error(err);
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
.warnDetail {
  padding: 0 17px 0 20px;
  margin-top: 56px;
  .d_title {
    font-size: 14px;
    .flex-row("", center);
    margin: 0 0 18px 0;
    img {
      margin-right: 5px;
    }
  }
  .detail_title {
    .flex-row(space-around, center);
    font-size: 12px;
    width: 100%;
    text-align: center;
    background: #373e4a;
    color: #dddddd;
    font-family: "SimSun";
    padding: 10px 0;
  }
  .detail_con {
    .flex-row(space-around, center);
    font-size: 12px;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    .border-bottom(1px, #363f4e);
    font-family: "SimSun";
    span:nth-child(3) {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      -webkit-box-orient: vertical;
    }
  }
}
</style>