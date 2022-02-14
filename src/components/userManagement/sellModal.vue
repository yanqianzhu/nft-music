<template>
<div >
  <el-dialog custom-class="sellsuc" v-model="visibleSell" title="" width="800px">
    <div class="sell-suc-box">
      <img src="../../assets/images/sellSuccess.png" />
      <div>
        <p>作品发布出售成功！</p>
        <p>请关注您的作品出售情况</p>
        <div @click="visibleSell = false">好的</div>
      </div>
    </div>
  </el-dialog>
  <el-dialog v-model="visible" title="出售" width="470px" :close-on-click-modal="false">
      <div class="sell-dialog-container dialog">
        <p class="title">
          <span>选择出售版本</span>
        </p>
        <el-select size="small" style="width: 100%;" v-model="batchId" placeholder="请选择出售版本">
          <el-option
            v-for="(item, index) in userBatchList"
            :key="item.id"
            :label="item.title"
            :value="index"
            
          >
            <span>{{ item.title }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.holdCount }}个</span>
          </el-option>
        </el-select>
        <p class="title" style="margin-top: 42px;">设置价格</p>
        <div class="flex-middle-between" v-if="sellBarchItem !== null">
          <span> 出售数量 </span>
          <el-input
            size="small"
            v-model.number="num"
            maxlength="10"
            :max="sellBarchItem.holdCount"
            :placeholder="'最大出售' + sellBarchItem.holdCount"
          >
            <template #suffix> 个 </template>
          </el-input>
        </div>
        <div class="flex-middle-between">
          <span> 出售单价 </span>
          <el-input size="small" maxlength="10" v-model.number="price" type="number" placeholder="请输入单价" class="price">
            <template #suffix> 元 </template>
          </el-input>
        </div>
        <div class="flex-middle-between sum-box">
          <span> 预计销售收入 </span>
          <span class="sum"
            >￥ <span>{{ (num * price).toFixed(2) || 0 }}</span></span
          >
        </div>
        <div class="flex-middle-between">
          <p>出售到期时间</p>
          
        </div>
        <div class="time-type">
          <div>
            <el-select v-model="value" style="width: 120px;" placeholder="Select" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div v-if="value != 4">
            <el-time-picker
              v-model="time"
              disabled 
              size="small"
              style="width: 100%;"
              placeholder="请选择时间"
              format="HH:mm"
            >
            </el-time-picker>
          </div>
          <div v-else>
            <el-date-picker
              v-model="value1"
              size="small"
              type="datetime"
              style="width: 100%;"
              placeholder="请选择时间"
              format="YYYY/MM/DD HH:mm"
            >
            </el-date-picker>
          </div>
        </div>
        <div>
          <el-checkbox
            v-model="checked"
            style="
              --el-checkbox-checked-font-color: #000;
              --el-checkbox-checked-input-border-color: #000;
              --el-checkbox-checked-background-color: #000;
              --el-checkbox-input-border-color-hover: #000;
            "
          >
            勾选此框，即表示我同意贝多音乐的服务条款
          </el-checkbox>
        </div>
        <p class="btn-box">
          <span class="btn" @click="sell"> 确认出售 </span>
        </p>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from "vue";
import { ElMessage } from "element-plus";
import { getUserNftListApi } from "@/api/apiManagement/musicNFT";
import { dateFormat } from "@/utils/filter";
import { publishSellNftInfo } from "@/api/apiManagement/userManagement";
export default defineComponent({
  name: "",
  setup(props, ctx) {
    const state = reactive({
      checked: false,
      sellDate: '',
      sellBarchItem: {},
      price: null,
      num: null,
      value: 1,
      value1: null,
      visibleSell: false,
      options: [
        {
          value: 1,
          label: '3天'
        },
        {
          value: 2,
          label: '7天'
        },
        {
          value: 3,
          label: '30天'
        },
        {
          value: 4,
          label: '自定义'
        },
      ],
      visible: false,
      musicId: 0,
      MusicNftId: 0,
      batchId: -1,
      time: Date.now(),
      userBatchList: [],
    })
    const sumTime = (type: number): number => {
      switch(type) {
        case 1:
          return 3 * 24 * 60 * 60;
        case 2:
          return 7 * 24 * 60 * 60;
        case 3:
          return 30 * 24 * 60 * 60;
      }
    }
    const sell = () => {
      
      if (!state.num) return ElMessage.warning("请输入出售数量！");
      if (!state.price) return ElMessage.warning("请输入单价！");
      if (state.value == 4 && !state.value1) return ElMessage.warning("请选择时间！");
      if (!state.checked) return ElMessage.warning("请先同意相关协议！");
      let time = 0;
      if (state.value == 4) {
        time = Math.floor((new Date(state.value1)).getTime()/1000);
      } else {
        let timeStr = dateFormat(state.time, 'HH:mm');
        time = sumTime(state.value) + (+(timeStr.split(':')[0]) * 60 * 60) + (+(timeStr.split(':')[1]) * 60)
      }
      publishSellNftInfo({
        musicId: state.musicId,
        musicNftId: state.MusicNftId,
        count: state.num,
        unitPrice: state.price,
        timeType: state.value == 4 ? 2 : 1,
        validTime: time
      }).then((res: any) => {
        if (res.code == 0) {
          state.visible = false;
          state.visibleSell = true;
          ctx.emit('getData')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const sellBarchItem = computed(() => {
      return state.userBatchList[state.batchId] || {};
    });
    const getUserBatch = () => {
      getUserNftListApi({ musicId: state.musicId }).then((res: any) => {
        if (res.code == 0) {
          state.userBatchList = res.data;
          if (state.userBatchList.length > 0) {
            state.batchId = 0;
          }
        }
      })
    }
    return {
      ...toRefs(state),
      sell,
      getUserBatch,
      sellBarchItem
    };
  },
});
</script>
<style lang="scss">
  .sellsuc{
      .el-dialog__header{
        border-bottom: 0;
      }

  }
</style>
<style lang="scss" scoped>
  .sell-suc-box{
    padding: 30px;
    display: flex;
    img{
      width: 277px;
      height: 169px;
      margin-top: 30px;
    }
    >div{
      margin-left: 68px;
      p:nth-child(1){
        height: 64px;
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 64px;
      }
      p:nth-child(2){
        color: rgba(0, 0, 0, 0.45);
        line-height: 28px;
        height: 28px;
        font-size: 16px;
        margin-top: 8px;
      }
      div{
        width: 100px;
        height: 36px;
        background: linear-gradient(270deg, #877BFF 0%, #7EB6FF 100%);
        border-radius: 2px;
        cursor: pointer;
        text-align: center;
        line-height: 36px;
        color: #fff;
        font-size: 14px;
        margin-top: 58px;
      }
    }
  }
  .time-type{
    display: flex;
    div:nth-child(2){
      flex: 1;
      margin-left: 10px;
    }
  }
  .sell-dialog-container {
    .title {
      font-size: 14px;
      font-weight: 500;
      color: #888888;
      margin-bottom: 10px;
    }
    
    .flex-middle-between {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 10px;
      span,p{
        color: #333333;
        font-size: 14px;
        font-weight: bold;
      }
      .el-input {
        width: 200px;
      }
      .price,
      .date {
        width: 200px;
      }
      &.sum-box {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
        .sum {
          font-size: 12px;
          font-weight: 500;
          color: #333333;
          span {
            font-size: 18px;
          }
        }
      }
    }
  }
  .btn-box {
    border-top: 1px solid #eee;
    display: flex;
    justify-content: end;
    padding-top: 10px;
    .btn {
      width: 85px;
      height: 32px;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 32px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
    }
  }
</style>
