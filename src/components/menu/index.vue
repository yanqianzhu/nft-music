<template>
  <div class="menu-container">
    <div class="logo">
      <img src="@/assets/images/logo.png" title="logo" @click="goHome" />
    </div>
    <ul class="menu">
      <li
        v-for="(item, index) in state.menuList"
        :key="index"
        @click="handleMenuClick(item, index)"
        :id="state.currentIndex === index ? 'active' : ''"
      >
        <svg-icon :iconClass="item.icon" className="icon" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Menu",
};
</script>
<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const state = reactive({
  currentIndex: 1,
  menuList: [
    {
      label: "首页",
      icon: "home",
      path: "/home/homePage",
    },
    {
      label: "推荐",
      icon: "thumb",
      path: "/home/thumb",
    },
    {
      label: "我的关注",
      icon: "collect",
      path: "/home/collect",
    },
    {
      label: "排行榜",
      icon: "ranking",
      path: "/",
    },
  ],
});
// logo点击
function goHome() {
  router.push("/home/thumb");
}
// 菜单切换
function handleMenuClick(item, index) {
  console.log(item);
  state.currentIndex = index;
  router.push(item.path);
}
</script>

<style lang="scss" scoped>
// 公共样式
#active {
  background: linear-gradient(270deg, #cac5ff 0%, #d9e9ff 100%);
  color: #000;
}
.menu-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f1f2f5;
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 72px;
    img {
      width: 75px;
      cursor: pointer;
    }
  }
  .menu {
    width: 100%;
    // height: 952px;
    overflow-y: auto;
    cursor: pointer;
    &::-webkit-scrollbar {
      display: none;
    }
    li {
      display: flex;
      align-items: center;
      width: 100%;
      height: 60px;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      user-select: none;
      .icon {
        margin: 0 6px 0 43px;
      }
    }
  }
}
</style>
