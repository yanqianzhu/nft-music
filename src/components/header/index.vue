<template>
  <div class="filling-box"></div>
  <div class="header-container">
    <div class="header-left">
      <img src="@/assets/images/logo.png" @click="goHome" class="logo" />
      <!-- <headerSearch class="header-search"></headerSearch> -->
    </div>
    <div class="header-right">
      <ol class="menu-list">
        <router-link
          :to="{ name: item.routerName }"
          custom
          v-slot="{ isActive, navigate }"
          v-for="item in menuList"
        >
          <li
            class="menu-list-item"
            :class="{ 'route-active': isActive }"
            @click="toJump(navigate, item.routerName)"
          >
            {{ item.label }}
          </li>
        </router-link>
        <div class="slide" v-if="slideShow" :style="{ left: linePos }"></div>
      </ol>
      <img src="@/assets/images/nft-casting.png" class="nft-casting" @click="toNFTIcmone" />
      <div @click="toPublication" class="toCreate">
        <svg-icon iconClass="add" className="icon_add" />
        <span>发布音乐</span>
      </div>
      <div @click="toLogin" class="toLogin" v-if="!isLogin">登陆</div>
      <div v-else class="login-box">
        <!-- <el-image class="small-bells" :src="circleUrl" fit="cover"></el-image> -->
        <el-popover placement="bottom-end" trigger="hover">
          <template #reference>
            <img src="@/assets/images/bell.png" class="small-bells" />
          </template>
          <div class="usermenulist">
            <router-link
              :to="{ name: item.routerName }"
              custom
              v-slot="{ isActive, navigate }"
              v-for="item in noticeList"
            >
              <li :class="{ 'route-active': isActive }" @click="toJump(navigate, item.routerName)">
                {{ item.label }}
              </li>
            </router-link>
          </div>
        </el-popover>
        <span class="gap"></span>

        <el-popover placement="bottom-end" trigger="hover">
          <template #reference>
            <el-avatar
              :size="41"
              :src="circleUrl"
              class="header-user-avatar"
              @click="toUserManagement"
            ></el-avatar>
          </template>
          <div class="usermenulist" v-if="Object.keys(userInfo).length > 0">
            <router-link
              :to="getRouterName(item)"
              custom
              v-slot="{ isActive, navigate }"
              v-for="item in userMenuList"
            >
              <li :class="{ 'route-active': isActive }" @click="toJump(navigate, item)">
                {{ item.label }}
              </li>
            </router-link>
          </div>
        </el-popover>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  nextTick,
  reactive,
  toRefs,
  defineComponent,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import headerSearch from "@/components/header/headerSearch.vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "Header",
  components: {
    headerSearch,
  },
  setup() {
    const data = reactive({
      router: useRouter(),
      store: useStore(),
      menuList: [
        {
          label: "首页",
          routerName: "homePage",
        },
        {
          label: "推荐",
          routerName: "Thumb",
        },
        // rank
        {
          label: "排行榜",
          routerName: "",
        },
        {
          label: "关于贝多",
          routerName: "",
        },
      ],
      userMenuList: [
        {
          label: "个人主页",
          routerName: "userCenter",
        },
        {
          label: "管理中心",
          routerName: "userManagement",
        },
        {
          label: "我的收藏",
          routerName: "collectionData",
        },
        {
          label: "我的关注",
          routerName: "Follow",
        },
        {
          label: "账号设置",
          routerName: "accountSettings",
        },
        {
          label: "退出登录",
          routerName: "",
        },
      ],
      noticeList: [
        {
          label: "粉丝",
          routerName: "Follow",
        },
        {
          label: "评论",
          routerName: "Comments",
        },
        {
          label: "点赞",
          routerName: "greatData",
        },
        // {
        //   label: "私信",
        //   routerName: "PrivateMessage",
        // },
      ],
      input2: "",
      slideShow: true,
      minwidth: document.body.clientWidth,
      currentLine: 0,
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      menuDomList: Array as unknown as HTMLCollectionOf<Element>,
    });
    //-----------methods
    const toPublication = () => {
      data.router.push({
        name: "Singer",
      });
    };
    const toLogin = () => {
      data.store.commit("setLoginShow");
    };
    const userInfo = computed(() => {
      return data.store.getters.userInfo;
    });
    /**
     * @description 前往用户管理
     */
    const toUserManagement = () => {
      data.router.push({ name: "userManagement" });
    };
    function goHome() {
      data.router.push("/home/thumb");
    }
    const toJump = (fun: any, item: { label: string; routerName: string }) => {
      if (item.label == "退出登录") {
        data.store.dispatch("exitLogin");
        localStorage.removeItem("token");
        data.router.push("/");
        return;
      }
      if (item.routerName == "") {
        ElMessage.warning("暂未开放!");
        return;
      }
      fun();
    };
    const toNFTIcmone = async () => {
      if (await data.store.dispatch("loginCheck")) {
        data.router.push({ name: "Work" });
      }
    };
    const getRouterName = (item) => {
      let route = { name: item.routerName };
      if (item.routerName == "userCenter") {
        route.params = { userId: userInfo.value.UserId || 0 };
      }
      return route;
    };
    //-----compued
    const isLogin = computed(() => {
      return data.store.getters.isLogin;
    });
    const linePos = computed(() => {
      if (data.minwidth > 1680) {
        return data.currentLine * 150 + 60 + "px";
      }
      return data.currentLine * 80 + 25 + "px";
    });
    data.router.afterEach((to, from) => {
      if (to.name !== "homePage" && to.name !== "Thumb" && to.name != "rank") {
        data.slideShow = false;
      } else {
        data.slideShow = true;
      }
      nextTick(() => {
        data.currentLine = Array.prototype.indexOf.call(
          data.menuDomList,
          document.getElementsByClassName("menu-list-item route-active")[0]
        );
      });
    });

    onMounted(() => {
      data.menuDomList = document.getElementsByClassName("menu-list-item");
      data.currentLine = Array.prototype.indexOf.call(
        data.menuDomList,
        document.getElementsByClassName("menu-list-item route-active")[0]
      );
      window.onresize = () => {
        return (data.minwidth = document.body.clientWidth);
      };
    });
    onBeforeUnmount(() => {
      window.onresize = null;
    });
    return {
      ...toRefs(data),
      toPublication,
      toUserManagement,
      goHome,
      linePos,
      isLogin,
      toLogin,
      toJump,
      toNFTIcmone,
      userInfo,
      getRouterName,
    };
  },
});
</script>

<style lang="scss" scoped>
.filling-box {
  height: 72px;
}
.header-container {
  position: fixed;
  height: 72px;
  width: 100%;
  min-width: 1200px;
  top: 0px;
  right: 0px;
  left: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 1.5%;
  z-index: 18;
  background-color: #ffffff;
  border-bottom: 1px solid #ccc;
  .header-left {
    display: flex;
    width: 35%;
    align-items: center;
    .logo {
      width: 164px;
      height: 37px;
      margin-right: 4%;
      cursor: pointer;
    }
    .header-search {
      max-width: 420px;
    }
  }
  .header-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 3%;
    // max-width: 65%;
    // flex-grow: 1;
    .menu-list {
      display: flex;
      position: relative;
      height: 100%;
      li {
        cursor: pointer;
        width: 80px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .slide {
        width: 30px;
        height: 3px;
        background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
        border-radius: 2px;
        position: absolute;
        bottom: 0;
        transition: all 0.5s;
      }
    }
    .nft-casting {
      width: 100px;
      height: 35px;
      margin-right: 60px;
      margin-left: 40px;
      cursor: pointer;
    }
    .toCreate,
    .toLogin {
      width: 120px;
      text-align: center;
      height: 42px;
      line-height: 42px;
      font-size: 14px;
      flex-shrink: 0;
      cursor: pointer;
    }
    .toCreate {
      border: 1px solid #7eb2ff;
      margin-right: 30px;
      .icon_add {
        margin-right: 10px;
        font-size: 18px;
      }
      font-size: 14px;
      font-weight: 600;
      color: #424348;
    }
    .toLogin {
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      border-radius: 2px;
      color: #ffffff;
    }
    .login-box {
      display: flex;
      align-items: center;
      width: 120px;
      .small-bells {
        width: 30px;
        height: 30px;
        margin-right: 20px;
        margin-left: 10px;
        cursor: pointer;
      }
      .gap {
        width: 1px;
        background-color: #ebebff;
        height: 30px;
      }
      .header-user-avatar {
        margin-left: 18px;
        display: block;
        cursor: pointer;
      }
    }
  }
}
@media screen and (min-width: 1680px) {
  .header-container {
    .header-right {
      .nft-casting {
        margin-right: 68px;
        margin-left: 80px;
      }
      .menu-list {
        .menu-list-item {
          width: 150px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.usermenulist {
  li {
    padding: 5px;
    cursor: pointer;
    &:hover {
      background-color: rgba($color: #aaaaaa, $alpha: 0.5);
    }
  }
}
</style>
