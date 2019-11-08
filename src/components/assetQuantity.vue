<!--资产数量显示值-->
<template>
  <div class="quantity">
    <div class="top_bar">
      <span>仓库在押物</span>
      <span>{{storeData.stockAmount}}吨 {{storeData.stockType }}</span>
    </div>
    <div class="top_bar">
      <span>出质人在贷总额</span>
      <span>{{storeData.loanAmount}}万元</span>
    </div>
    <div class="top_bar">
      <span>质押物总价值</span>
      <span>{{storeData.currentAmount}}万元</span>
    </div>
  </div>
</template>
<script>
import * as api from "@/common/api"; //引入接口
export default {
  data() {
    return {
      storeData: {} //仓库数量
    };
  },
  mounted() {
    //仓库质押物数据统计
    api.getStoreStatistical().then(res => {
      this.storeData = res.data;
    })
    .catch(err => {
      this.$message.error(err);
    });
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
.quantity {
  text-align: center;
  background: #2d323b;
  height: 142px;
  .flex-row(space-around);
  .top_bar {
    .flex-column('','');
    span:first-child {
      font-size: 14px;
      color: #828384;
      margin-bottom: 22px;
    }
    span:last-child{
    	text-align: left;
    	font-weight: bold;
      font-size: 24px;
      color: #ffffff;
    }
  }
}
</style>