<template>
  <main class="publication-box">
    <aside class="publication-aside">
      <ol class="aside-box">
        <router-link
          v-for="item in menuList"
          custom
          :key="item.routerName"
          :to="{ name: item.routerName }"
          v-slot="{ isActive, navigate }"
        >
          <li :class="{ 'route-active': isActive }" class="menu-item" @click="navigate">
            {{ item.label }}
          </li>
        </router-link>
      </ol>
    </aside>
    <router-view class="publication-main"></router-view>
  </main>
</template>

<script lang="ts">
import { reactive, ref, defineComponent } from "vue";

export default defineComponent({
  name: "publication",
  components: {},
  setup() {
    const menuList = ref([
      { label: "原唱", routerName: "Singer" },
      { label: "翻唱", routerName: "Cover" },
      { label: "伴奏", routerName: "Accompaniment" },
    ]);
    return {
      menuList,
    };
  },
});
</script>

<style lang="scss" scoped>
.publication-box {
  width: 62.5%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 15%;
  min-width: 960px;
  padding-top: 40px;
  .publication-aside {
    width: 160px;
    flex-shrink: 0;
    .aside-box {
      width: 160px;
      list-style: none;
      border-radius: 6px;
      border: 1px solid #ebebff;
      background-color: #fff;
      margin: 0;
      padding: 0;
      position: fixed;
      top: 112px;
      .menu-item {
        height: 60px;
        padding: 10px 0px 0px 32px;
        font-size: 18px;
        color: rgba(51, 51, 51, 1);
        cursor: pointer;
        user-select: none;
        &.route-active {
          color: rgba(254, 255, 255, 1);
          background-image: url("@/assets/images/publication-menuBg.png");
          background-position: 8px 22px;
          border-radius: 6px;
          background-size: 81.25%;
          background-repeat: no-repeat;
          background-color: #000;
        }
      }
    }
  }
  .publication-main {
    flex-grow: 1;
    flex-shrink: 0;
    padding-left: 75px;
    max-width: calc(100% - 160px);
    border-left: 1px solid #ebebff;
  }
}
</style>
<style lang="scss">
.publication-main .main-title {
  margin-left: -45px;
}
.tips-title {
  color: rgba(255, 0, 0, 1);
  .icon {
    font-size: 18px;
    margin-right: 10px;
  }
}
.tips-content {
  max-width: 640px;
  .tips-first-ul-box {
    padding: 10px 20px;
    li {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      padding-bottom: 12px;
      .tips-ul li {
        padding-top: 12px;
        font-size: 12px;
        font-weight: 500;
        color: #333333;
      }
    }
  }
}
</style>
