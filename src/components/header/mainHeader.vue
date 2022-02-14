<template>
  <div class="filling-box"></div>
  <header class="piblication-header">
    <span class="logo-box">
      <img src="@/assets/images/logo.png" title="logo" @click="goHome" class="logo" />
      XX创作服务平台
    </span>
    <span class="user-box">
      <el-avatar :size="41" :src="state.circleUrl" class="user-avatar"></el-avatar>
      <span></span>
      <svg-icon iconClass="tips" className="icon-tips"></svg-icon>
    </span>
  </header>
</template>

<script lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "mainHeader",
  setup() {
    const router = useRouter();
    const state = reactive({
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      sizeList: ["large", "medium", "small"],
    });
    // logo点击
    function goHome() {
      router.push("/home/thumb");
    }
    return { goHome, state };
  },
};
</script>

<style lang="scss" scoped>
@mixin flex {
  display: flex;
  align-items: center;
}
.filling-box{
  height: 72px;
}
.piblication-header {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 40px;
  border-bottom: 1px solid #ebebff;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 3;
  background: #fff;
  .logo-box {
    @include flex();
    font-size: 26px;
    color: rgba(51, 51, 51, 1);
    font-weight: 500;
    .logo {
      width: 75px;
      margin-right: 25px;
      cursor: pointer;
    }
  }
  .user-box {
    @include flex();
    .user-avatar {
      margin-right: 18px;
      cursor: pointer;
    }
    span {
      width: 1px;
      height: 30px;
      background: rgba(235, 235, 255, 1);
    }
    .icon-tips {
      width: 30px;
      height: 30px;
      margin-left: 18px;
      cursor: pointer;
    }
  }
}
</style>
