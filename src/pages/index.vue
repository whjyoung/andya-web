<template>
  <div class="index">
    <el-container>
      <!-- 头部title -->
      <el-header>
        <div class="hLeft">
          <img src="@/assets/images/logo.png" alt />
          <img src="@/assets/images/line.png" alt />
          <span class="h_title">动产质押监控大数据平台</span>
        </div>
        <div class="hRight">
          <span>{{currentTime}}</span>
        </div>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="6">
            <!-- 资产行情 -->
            <asset-Quoation></asset-Quoation>
            <!-- 质押权人统计饼图 -->
            <holder-Statistic></holder-Statistic>
          </el-col>
          <el-col :span="12">
            <!-- 资产数量显示 -->
            <asset-Quantity></asset-Quantity>
            <!-- 仓库资产巡检 -->
            <asset-Inspection></asset-Inspection>
            <!-- 告警事情次数统计 -->
            <alarm-Count :countFlag="countFlag"></alarm-Count>
          </el-col>
          <el-col :span="6" class="right">
            <!-- 质押告警 -->
            <pledge-Warning></pledge-Warning>
            <!-- 告警事件详情 -->
            <warning-Detail :detailFlag="detailFlag"></warning-Detail>
            <!-- 告警事件类型统计 -->
            <alarmtype-Statistic></alarmtype-Statistic>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
let moment = require("moment"); // 日期格式化插件
import assetQuoation from "../components/assetQuotation";
import assetInspection from "../components/assetInspection";
import assetQuantity from "../components/assetQuantity";
import pledgeWarning from "../components/pledgeWarning";
import warningDetail from "../components/warningDetail";
import holderStatistic from "../components/holderStatistic";
import alarmCount from "../components/alarmCount";
import alarmTypeStatistic from "../components/alarmTypeStatistic";
import * as api from "@/common/api"; //引入接口
export default {
  name: "index",
  components: {
    "asset-Quoation": assetQuoation,
    "asset-Inspection": assetInspection,
    "asset-Quantity": assetQuantity,
    "pledge-Warning": pledgeWarning,
    "warning-Detail": warningDetail,
    "holder-Statistic": holderStatistic,
    "alarm-Count": alarmCount,
    "alarmtype-Statistic": alarmTypeStatistic
  },
  data() {
    return {
      timer: "", //定时器定时变量
      currentTime: "", //获取当前时间
      websocket: null, //我们的连接
      lockReconnect: false, //心跳检测，是否真正连接
      timeout: 60 * 1000, //一分钟一次  单位：ms
      timeoutObj: null, //心跳倒计时
      serverTimeoutObj: null, //倒计时
      timeoutnum: null, //断开重连倒计时
      xList: [], //得到msg反馈，给折线图数据x轴
      yList: [], //得到msg反馈，给折线图数据y轴
      warningList:[], // 得到msg反馈，得到告警事件详情数据
      countFlag:0, //次数未改变
      detailFlag:0 // 详情未改变
    };
  },
  created() {
    //设置顶部的定时器：年月日时分秒
    this.timer = setInterval(this.getTime, 1000);
    //websocket实现消息推送
    if ("WebSocket" in window) {
      this.websocket = new WebSocket("ws://120.204.202.161:8080/api/ws");
      this.initWebSocket();
    } else {
      this.$message.error("当前浏览器 Not support websocket");
    }
  },
  methods: {
    getTime() {
      // 获取当前系统时间
      this.currentTime = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
    },
    initWebSocket() {
      // 初始化websocket
      //连接websocket
      this.websocket.onopen = this.setOnopenOpen;
      //收到消息回调
      this.websocket.onmessage = this.setOnmessageMessage;
      //send回服务
      this.websocket.onsend = this.setOnsendSend;
      //错误
      this.websocket.onerror = this.setOnerrorError;
      //关闭
      this.websocket.onclose = this.setOncloseClose;
    },
    setOnmessageMessage(e) {
      //接收推送消息后实时刷新次数与告警详情
      this.countFlag++; // 告警次数改变
      this.detailFlag++; // 告警详情改变
      //弹出推送过来的消息
      this.$message.error({
        message: e.data,
        duration: 5000,
        center: false
      });
      //心跳重置
      this.reset();
    },
    setOnopenOpen() {
      //开启socket
      //开启心跳
      this.start();
      //在开启连接时会发送消息过去
    },
    setOnsendSend(Data) {
      //发给服务器
      if (Data == null) {
        console.log("数据为空");
      } else {
        this.websocket.send(Data);
      }
    },
    setOnerrorError(e) {
      //socket发生错误
      //重连
      this.reconnect();
    },
    setOncloseClose() {
      //关闭socket连接
      //重连
      this.reconnect();
    },
    reconnect() {
      //重连
      var that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function() {
        //新连接
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
    },
    reset() {
      //重置心跳
      var that = this;
      //清除时间
      clearInterval(that.timeoutObj);
      clearInterval(that.serverTimeoutObj);
      //重启心跳
      that.start();
    },
    start() {
      //开启心跳
      var self = this;
      self.timeoutObj && clearInterval(self.timeoutObj);
      self.serverTimeoutObj && clearInterval(self.serverTimeoutObj);
      self.timeoutObj = setInterval(function() {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websocket.readyState == 1) {
          //如果连接正常
          self.websocket.send("heartCheck");
        } else {
          //否则重连
          self.reconnect();
        }
      }, self.timeout);
    }
  },
  beforeDestroy() {
    //销毁心跳
    clearInterval(self.timeoutObj);
    clearInterval(self.serverTimeoutObj);
    //销毁定时器
    clearInterval(this.timer);
    //销毁websocket
    this.websocket.close();
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
.index {
  .el-main {
    margin-top: 14px;
    padding: 0 34px 34px 34px;
    .el-row {
      .flex-row(space-between);
      .el-col-6 {
        width: 430px;
        height: 950px;
      }
      .el-col-12 {
        width: 948px;
        margin: 0 20px;
        height: 950px;
      }
      .right {
        background: #2d323b;
      }
    }
  }
  .el-header {
    height: 82px !important;
    width: 100%;
    padding: 0 34px;
    .flex-row(space-between);
    .border-bottom(1px, #0085cc);
    .hLeft {
      .flex-row("", flex-end);
      img {
        margin-right: 16px;
      }
      .h_title {
        font-size: 36px;
        color: #95c11f;
        font-weight: bold;
      }
    }
    .hRight {
      font-size: 24px;
      color: #4d699d;
    }
  }
}
</style>
