<template>
  <el-config-provider :locale="locale">
    <div>
      <header-vue></header-vue>
      <router-view></router-view>
      <FooterVue></FooterVue>
      <loginVue></loginVue>
      <audio-player-vue></audio-player-vue>
    </div>
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import loginVue from "./views/login/index.vue";
import headerVue from "@/components/header/index.vue";
import FooterVue from "@/components/footer/index.vue";
import audioPlayerVue from "./components/home/audioPlayer.vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
export default defineComponent({
  components: { loginVue, FooterVue, headerVue, audioPlayerVue, ElConfigProvider },
  setup() {
    return {
      locale: zhCn,
    };
  },
});
</script>
``
<style lang="scss">
.el-dialog__header {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.09);
}
.el-dialog__footer {
  border-top: 1px solid rgba($color: #000000, $alpha: 0.09);
}
.el-dialog__body {
  padding: 8px 22px !important;
}
.flex {
  display: flex;
}
.flex-item {
  flex: 1;
}
.flex-justify-content-center {
  justify-content: center;
}
.flex-justify-content-between {
  justify-content: space-between;
}
.flex-justify-content-around {
  justify-content: space-around;
}
.flex-align-items-center {
  align-items: center;
}
.flex-middle-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-center-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
* {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
    "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: RGBA(253, 253, 255, 1);
  min-width: 1280px;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.multi-ellipsis--l2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.multi-ellipsis--l3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.el-affix--fixed {
  z-index: 17 !important;
}
</style>
