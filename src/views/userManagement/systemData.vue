<template>
  <div class="systemData-box">
    <div class="systemData-title" style="font-weight: bold;">系统消息</div>
    <div class="systemData-cont">
      <div class="systemData-list">
        <div>
          <img src="../../assets/images/message.png" />
        </div>
        <div>
          <div>系统消息</div>
          <div>你提交的作品信息修改申请审核已通过。</div>
          <div>2021-12-1 12:24:28</div>
        </div>
      </div>
      <div class="systemData-list">
        <div>
          <img src="../../assets/images/message.png" />
        </div>
        <div>
          <div>系统消息</div>
          <div>你提交的作品信息修改申请审核已通过。</div>
          <div>2021-12-1 12:24:28</div>
        </div>
      </div>
      <div class="systemData-list">
        <div>
          <img src="../../assets/images/message.png" />
        </div>
        <div>
          <div>系统消息</div>
          <div>你提交的作品信息修改申请审核已通过。</div>
          <div>2021-12-1 12:24:28</div>
        </div>
      </div>
      <div class="systemData-list">
        <div>
          <img src="../../assets/images/message.png" />
        </div>
        <div>
          <div>系统消息</div>
          <div>你提交的作品信息修改申请审核已通过。</div>
          <div>2021-12-1 12:24:28</div>
        </div>
      </div>
      <div class="nodata">没有更多了～</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from "vue";
export default defineComponent({
  setup() {
    var state = reactive({});

    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.systemData-box {
  padding: 30px 40px 30px 35px;
  .nodata {
    margin-top: 43px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    font-size:14px;
    text-align: center;
  }
  .systemData-title {
    font-size: 24px;
    font-weight: 500;
    color: #333333;
    line-height: 33px;
    margin-bottom: 20px;
  }
  .systemData-cont {
    margin-top: 30px;
    .systemData-list {
      height: 100px;
      border-bottom: 1px solid #ebebff;
      padding: 16px 0 14px 21px;
      display: flex;
    }
    .systemData-list > div:nth-child(1) {
      width: 50px;
      height: 50px;
      background: #f7f8fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      > img {
        width: 23px;
        height: 26px;
      }
    }
    .systemData-list > div:nth-child(2) {
      margin-left: 20px;
      font-size: 14px;
      > div:nth-child(1) {
        font-weight: 600;
        color: #333333;
      }
      > div:nth-child(2) {
        margin-top: 6px;
        margin-bottom: 8px;
        font-weight: 400;
        color: #333333;
      }
      > div:nth-child(3) {
        font-weight: 400;
        color: #888888;
      }
      > div {
        line-height: 20px;
      }
    }
  }
}
</style>
