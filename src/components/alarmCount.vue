<!--告警事情次数统计-->
<template>
  <div class="count">
    <div class="count_title">
      <div class="line"></div>
      <div class="c_title">告警事件次数统计</div>
    </div>
    <div id="myCount" :style="{width: '100%', height: '246px', top: '-10%'}"></div>
  </div>
</template>
<script>
import * as api from "@/common/api"; //引入接口
let moment = require("moment"); // 日期格式化插件
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie"); // 引入饼状图组件
require("echarts/lib/chart/line"); // 引入折线图组件
require("echarts/lib/component/legend"); //引入图例
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  props: {
    countFlag:{
      type:Number
    }
  },
  data() {
    return {
      alarmData: [], //告警事情次数统计
      xData: [] //x轴显示的内容
    };
  },
  watch:{
    countFlag:{
      handler(newVal, oldVal) {
        console.log("刷新告警次数");
        this.getCount();
        console.log(newVal,oldVal)
      },
      // 代表在wacth里声明了countFlag这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true,   //对象内部属性的监听，关键。
    }
  },
  mounted() {
    this.getCount();
  },
  methods: {
    getCount(){
      api.getAlarmNnumberStatistical().then(res => {
        let result = res.data;
        // 数据清空，否则重叠
        this.alarmData = [];
        this.xData = [];
        for (var i = 0; i < result.length; i++) {
          result[i].date = moment(result[i].date).format("YYYY-MM-DD"); //日期格式化
          this.xData.push(result[i].date); //日期
          this.alarmData.push(result[i].value); //次数
        }
        this.initData(); //渲染折线图数据
      })
      .catch(err => {
        this.$message.error(err);
      });
    },
    //初始化数据
    initData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("myCount"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item"
        },
        grid: {
          y2: 100
        },
        xAxis: {
          //x轴数据
          type: "category",
          data: this.xData,
          axisLabel: {
            //解决x轴数据太多显示不全
            interval: 2,
            rotate: 60,
            textStyle: {
              color: "#9EA3AB",
              fontSize: 11
            }
          },
          axisLine: {
            // lineStyle: {
            //   color: "#686868"
            // }
            show:false
          }
        },
        yAxis: {
          //y轴数据
          type: "value",
          //设置y轴网格线颜色
          splitLine: {
              show: true,
              lineStyle:{
                color: ['#686868'],
            }
      　　},
          /*改变y轴颜色*/
          axisLine: {
            show:false // 去掉y轴刻度
            // lineStyle: {
            //   color: "#686868"
            // }
          },
          axisLabel: {
            textStyle: {
              color: "#9EA3AB",
              fontSize: 11
            }
          }
        },
        series: [
          {
            data: this.alarmData,
            type: "line",
            smooth: true,//折线圆滑
            itemStyle: {
              normal: {
                color: "#00a0e9", //改变折线点的颜色
                borderWidth: 4,
                borderColor: '#00a0e9',
                lineStyle: {
                  color: "#fff", //改变折线颜色
                  width: 0.8 //折线粗线
                }
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
.count {
  height: 246px;
  margin-top: 26px;
  background: #2d323b;
  .count_title{
    .flex-row('',flex-end);
    .line{
      .line();
    }
    .c_title {
      padding: 14px 0 6px 0;
      font-size: 16px;
      font-weight: bold;
      width: 140px;
      .border-bottom(4px, #00a0e9);
    }
  }
}
</style>
