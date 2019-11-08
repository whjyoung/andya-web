<!--告警事件类型统计-->
<template>
  <div class="type">
    <div class="type_title">
      <img src="@/assets/images/type.png" alt />
      告警事件类型统计
    </div>
    <div id="typeChart" :style="{width: '100%', height: '295px',top: '-10%'}"></div>
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
      alarmTypeData: [], //告警事件类型统计数据
      legendData: [] // 图例数据
    };
  },
  mounted() {
    api.getAlarmTypeStatistical().then(res => {
      this.alarmTypeData = res.data; // 权人统计数据
      let data = this.alarmTypeData;
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
    //初始化数据
    initData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("typeChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#516EFF", "#FFD54F", "#FF4E8F", "#5FFF91",'#FF4F4A','#2f4554', '#61a0a8', 
        '#d48265', '#91c7ae','#749f83','#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        tooltip: {
          trigger: "item",
          // backgroundColor:"#fff",
          // textStyle:{
          //   color:"#000"
          // },
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          // 图例
          orient: "horizontal",
          x: "center",
          bottom: "bottom",
          icon: "circle",
          //   data: [
          //     "设备故障",
          //     "非法闯入",
          //     "非法移动质押物",
          //     "资产价格低于预警告值"
          //   ]
          data: this.legendData,
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["35%", "55%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter(v) {
                  let text = v.name;
                  return text.length < 4
                    ? text
                    : `${text.slice(0, 4)}\n${text.slice(4)}`;
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            // data: [
            //   { value: 14, name: "设备故障" },
            //   { value: 20, name: "非法闯入" },
            //   { value: 24, name: "非法移动质押物" },
            //   { value: 42, name: "资产价格低于预警告值" }
            // ]
            data: this.alarmTypeData
          }
        ]
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
.type {
  height: 295px;
  padding: 0 20px;
  margin-top: 58px;
  .type_title {
    .flex-row('',center);
    font-size: 14px;
    img {
      margin-right: 5px;
    }
  }
}
</style>