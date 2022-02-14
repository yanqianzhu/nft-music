<template>
  <ul class="nav_box">
    <li
      v-for="(item, index) in state.navList"
      :key="index"
      @click="handleNavClick(item, index)"
      :id="state.currentIndex === index ? 'active' : ''"
    >
      <svg-icon :iconClass="item.icon" className="nav_icon" v-if="item.icon" />
      {{ item.label }}
    </li>
    <div class="line" :style="{ left: linePos }"></div>
  </ul>
</template>

<script lang="ts">
export default {
  name: "Nav",
};
</script>
<script setup lang="ts">
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const state = reactive({
  currentIndex: 0,
  navList: [
    {
      label: "首页",
      icon: "",
      path: "",
    },
    {
      label: "推荐",
      icon: "",
      path: "",
    },
    {
      label: "关于贝多",
      icon: "",
      path: "",
    },
    // {
    //   label: "充值",
    //   icon: "money",
    //   path: "",
    // },
  ],
});
// 下划线位置
const linePos = computed(() => {
  return state.currentIndex * 80 +25 + "px";
});
// nav导航点击
function handleNavClick(item: { label: string; icon: string; path: string }, index: number) {
  state.currentIndex = index;
  router.push(item.path);
}
</script>

<style lang="scss" scoped>
#active {
  color: #000;
}
.nav_box {
  display: flex;
  // margin-right: 5%;
  cursor: pointer;
  user-select: none;
  position: relative;
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 72px;
    font-size: 16px;
    color: #2f3035e6;
    &:hover {
      color: #000;
    }
    .nav_icon {
      font-size: 20px;
      margin-right: 5px;
    }
  }
  .line {
    width: 30px;
    height: 3px;
    background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
    border-radius: 2px;
    position: absolute;
    bottom: 0;
    transition: all 0.5s;
  }
}
</style>
