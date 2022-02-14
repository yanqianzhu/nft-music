<template>
  <ul class="footer-container" :style="{ backgroundColor: bgcolor, '--textcolor': textcolor }">
    <li class="tabs">
      <span v-for="(item, index) in tabs" :key="index" @click="handleTabClick(item)">{{
        item.label
      }}</span>
    </li>
    <li class="tel">
      <p>
        网络谣言曝光台 | 网上有害信息举报 | 违法和不良信息举报：400-xxx-xxxx |
        青少年守护专线：400-xxxx-xxx | 网络内容从业人员违法违规行为举报：123456@laohu.com
      </p>
    </li>
    <li class="info">
      <p>
        京ICP备12345678号-3 | 广播电视台节目制作经营许可证 | 京A1-12345678 |
        网络文化许可证-京网文-（2021）1234-123号 | 京公网安备 12345679852号
      </p>
    </li>
  </ul>
</template>

<script lang="ts">
export default {
  name: "Footer",
  props: {
    bgcolor: {
      type: String,
      default: "#f0f1f8",
    },
    textcolor: { type: String, default: "#333333" },
  },
};
</script>

<script lang="ts" setup>
interface tabsData {
  label: string;
  path: string;
}

import { reactive } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const tabs = reactive([
  {
    label: "营业执照",
    path: "/",
  },
  {
    label: "账号找回",
    path: "/",
  },
  {
    label: "隐私政策",
    path: "/",
  },
  {
    label: "联系我们",
    path: "/",
  },
]);
// tabs路由跳转
function handleTabClick(item: tabsData) {
  router.push(item.path);
}
</script>

<style lang="scss" scoped>
.footer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 180px;
  padding: 48px 95px;
  // background-color: var(--bgcolor);
  border-top: 1px solid #ebebff;
  // position: absolute;
  // bottom: 0;
  .tabs {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    color: var(--textcolor);
    span {
      cursor: pointer;
      user-select: none;
      width: 25%;
      display: inline-block;
      text-align: center;
    }
  }
  .tel,
  .info {
    display: flex;
    justify-content: center;
    font-size: 12px;
    color: #666666;
  }
  .tel {
    margin: 19px 0 10px;
  }
}
</style>
