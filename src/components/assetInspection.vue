<!--仓库资产巡检-->
<template>
  <div class="inspection">
    <div class="inspection_title">
      <div class="line"></div>
      <div class="title">仓库资产巡检</div>
    </div>
    <!--基本信息-->
    <div class="information">
      <!-- 信息详情 -->
      <div class="left">
        <div class="l_desc">
        	仓库基本信息
        	<img src="@/assets/images/basicInfo.png" class="basicInfoImg" alt="仓库基本信息" title="仓库基本信息" />
        </div>
        <img src="@/assets/images/infor.png" alt />
        <div class="infor_text">
          <div>
            仓库名称：
            <span>{{basicInfo.storeName }}</span>
          </div>
          <div>
            仓库编号：
            <span>{{basicInfo.storeSerialNumber}}</span>
          </div>
          <div>
            地理位置：
            <span>{{basicInfo.storeLocation}}</span>
          </div>
          <div>
            质押监管面积：
            <span>{{basicInfo.storeArea}}平米</span>
          </div>
          <div>
            作业状态：
            <span>{{basicInfo.homework}}</span>
          </div>
        </div>
      </div>
      <!-- 仓库信息列表 -->
      <div class="right" v-if="listInfo.length>0">
        <div class="right_con" v-for="(item,index) in listInfo" :key="index">
          <div class="con_left">
            <div class="r_desc">区域{{item.areaStr}}实时照片/视频</div>
            <img src="@/assets/images/pinkPointBig.png" alt="粉点" title="粉点" />
            <iframe :src="item.url" allowfullscreen="true"></iframe>
          </div>
          <div class="infor_text">
            <div>
              质押物种类：
              <span>{{item.stockType}}</span>
            </div>
            <div>
              质押物总价值：
              <span>{{item.capitalAmount/10000}}万元</span>
            </div>
            <div>
              监控状态：
              <span>{{item.alarmStatus}}</span>
            </div>
            <div>
              仓库状态：
              <br />
              <span class="humidity">{{item.storeStatus}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/common/api"; //引入接口
export default {
  data() {
    return {
      basicInfo: {}, //资产巡检基本信息
      listInfo: [] //列表信息
    };
  },
  mounted() {
    //请求仓库资产巡检信息
    api.getStoreMsg().then(res => {
      this.basicInfo = res.data;
      this.listInfo = res.data.queryStoreAreaDtos;
      this.listInfo.forEach((item, index) => {
        let code = "A".charCodeAt(); //ascii码
        let codeStr = String.fromCharCode(code + parseInt(index));
        item.areaStr = codeStr;
      });
    })
    .catch(err => {
      this.$message.error(err);
    });
  }
};
</script>
<style lang="less" scoped>
@import "~@/styles/base.less";
.inspection {
  height: 510px;
  background: #2d323b;
  margin-top: 25px;
  .inspection_title{
    .flex-row('',flex-end);
    .line{
      .line();
    }
    .title {
      padding: 13px 0 6px 0;
      font-size: 16px;
      font-weight: bold;
      width: 112px;
      .border-bottom(4px,#00a0e9);
    }
  }
  .information {
    .flex-row('','');
    font-size: 14px;
    .left {
      margin-left: 21px;
      
      .l_desc {
        margin: 17px 0 13px 15px;
        position:relative;
        .basicInfoImg{
        	position: absolute;
        	top: 5px;
        	left: -12px;
        }
      }
      .infor_text {
        margin-top: 10px;
        div {
          margin-bottom: 12px;
          line-height: 14px;
          span:last-child {
            font-weight: bold;
          }
        }
      }
    }
    .right {
      margin: 17px 0 0 36px;
      .right_con {
      	margin-bottom:10px;
      	.con_left{//设置粉点
      		position:relative;
      		img{
      			position: absolute;
      			left: 0px;
      			top: 6px;
      		}
      	}
        .flex-row('');
        .r_desc {
          margin-bottom: 12px;
          margin-left: 15px;
        }
        iframe {
        	//盒子模型解决方案难以成立
        	/*box-sizing:content-box;*/
          width: 313px;
          height: 176px;
          html{
          	 #root{
	          	#app{
	          		height: 100%;
	          		width: 100%;
	          	}
	          }
          }
        }
        .infor_text {
          margin-left: 8px;
          margin-top: 5%;
          div {
            margin-bottom: 15px;
            .humidity{//温度 湿度
            	display: inline-block;
            	width: 45% !important;
            	padding: 10px 0 0 36px;
            	line-height: 20px;
            	overflow: hidden;
            }
            span:last-child {
              font-weight: bold;
            }
          }
        }
        
      }
    }
  }
}
</style>