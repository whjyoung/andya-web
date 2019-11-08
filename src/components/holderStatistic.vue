<!--质押权人统计-->
<template>
  <div class="holder">
    <div class="holder_top">
      <div class="line"></div>
      <div class="holder_title">质押权人统计</div>
    </div>
    <div id="myChart" :style="{width: '100%', height: '300px', top:'-10%'}"></div>
  </div>
</template>
<script>
import * as api from "@/common/api"; //引入接口
let echarts = require("echarts/lib/echarts");
// 引入饼状图组件
require("echarts/lib/chart/pie");
require("echarts/lib/component/legend"); //引入图例
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  data() {
    return {
      holderData: [], //质押权人统计数据
      legendData: [] //图例数据
    };
  },
  mounted() {
    //获取质押权人统计数据
    api.getPledgeStatistical().then(res => {
      this.holderData = res.data; // 权人统计数据
      let data = this.holderData;
      for (var i = 0; i < data.length; i++) {
        //图例数据
        this.legendData.push(data[i].name);
      }
      this.initData(); //渲染饼图
    })
    .catch(err => {
      this.$message.error(err);
    });
  },
  methods: {
    //初始化echarts数据
    initData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#516EFF", "#FFD54F", "#FF4E8F", "#5FFF91",'#FF4F4A','#2f4554', '#61a0a8', 
        '#d48265', '#91c7ae','#749f83','#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          // 图例
          orient: "horizontal",
          bottom: "bottom",
          icon: "circle",
          // data: ["江苏银行", "中国银行", "上海银行", "浦发银行"]
          data: this.legendData,
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            // name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.holderData,
            // data: [
            //   { value: 12.0, name: "江苏银行" },
            //   { value: 9.0, name: "中国银行" },
            //   { value: 21.0, name: "上海银行" },
            //   { value: 58.0, name: "浦发银行" }
            // ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
.holder {
  margin-top: 24px;
  height: 326px;
  background: #2d323b;
  .holder_top{
    .flex-row('',flex-end);
    .line{
      .line();
    }
    .holder_title {
      padding: 14px 0 6px 0;
      font-size: 16px;
      font-weight: bold;
      width: 131px;
      .border-bottom(4px,#00a0e9);
    }
  }
}
</style>