<template>
  <el-dialog
    v-model="show"
    width="800px"
    custom-class="box-forging"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div
      class="dialog-content flex"
      v-loading="loading"
      element-loading-text="提交审核中..."
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <img src="@/assets/images/forging.png" />
      <div>
        <h1>已提交审核！</h1>
        <div class="icon-title">
          <p>作品正在审核，预计X分钟内完成，可在作品管理中查询进度</p>
          <span @click="toWork">前往<img src="@/assets/images/icon-go.png" /></span>
        </div>
        <div class="gohome" @click="toHomePage">返回首页</div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "successDialog",
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    successShow: Boolean,
  },
  setup(props, { emit }) {
    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
    const data = reactive({
      show: false,
      router: useRouter(),
    });
    function toWork() {
      data.router.push({ name: "Work" });
    }
    function toHomePage() {
      data.router.push({ name: "Home" });
    }
    watch(
      () => props.successShow,
      (val) => {
        data.show = val;
      },
      {
        immediate: true,
      }
    );
    watch(
      () => data.show,
      (val) => {
        emit("update:successShow", val);
      }
    );
    return {
      ...toRefs(data),
      toWork,
      toHomePage,
      svg,
    };
  },
});
</script>
<style lang="scss">
.box-forging {
  width: 800px;
  height: 390px;
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__body {
    width: 100%;
    height: 100%;
  }
  .dialog-content {
    width: 100%;
    height: 100%;
    img {
      width: 277px;
      height: 169px;
      margin-left: 40px;
      margin-top: 68px;
    }
    h1 {
      font-size: 48px;
      color: #000000;
      margin-left: 68px;
      margin-top: 58px;
    }
    .icon-title {
      width: 315px;
      height: 56px;
      position: relative;
      line-height: 28px;
      margin-top: 12px;
      margin-left: 68px;
      p {
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }
      span {
        font-size: 16px;
        color: #63a5ff;
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: pointer;
        img {
          width: 15px;
          height: 10px;
          padding: 0;
          margin: 0;
          margin-left: 9px;
        }
      }
    }
    .gohome {
      width: 100px;
      height: 36px;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 36px;
      border-radius: 2px;
      margin-top: 30px;
      margin-left: 68px;
      cursor: pointer;
    }
  }
}
</style>
