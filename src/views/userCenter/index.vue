<template>
  <div class="userCenter-box">
    <div class="userCenter-container">
      <div class="user-info-box">
        <el-avatar :size="80" :src="getUrl(list.HeadShotPath)"></el-avatar>
        <p class="user-info-name">{{ list.NickName }}</p>
        <p class="user-info-other">ID:{{ list.Id }}</p>
        <p class="user-info-other">
          {{ list.Introduction ? list.Introduction : "这个人很懒，什么都没有留下" }}
        </p>
        <p class="edit-user-info" @click="editData" v-if="isMyself">编辑资料</p>
        <div class="flex" v-else>
          <div class="icon-follow" @click="setFollow">
            {{ list.IsFollowed == 1 ? "取消关注" : "关注" }}
          </div>
          <!-- <div class="privateLetter">私信</div>
          <div class="icon-report">...</div> -->
        </div>
      </div>
      <ol class="menu-box">
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
      <Router-View></Router-View>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from "vue";
import footerVue from "@/components/footer/index.vue";
import mainHeaderVue from "@/components/header/mainHeader.vue";
import { getUserBasic } from "@/api/apiManagement/login";
import { useRoute, useRouter } from "vue-router";
import { getUrl } from "@/utils/filter";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { follow } from "@/api/apiManagement/userManagement";
export default defineComponent({
  name: "userCenter",
  components: { mainHeaderVue, footerVue },
  setup() {
    const state = reactive({
      menuList: [
        { routerName: "nftStore", label: "NFT仓库" },
        { routerName: "musicCollect", label: "音乐收藏" },
      ],
      list: {},
      store: useStore(),
      route: useRoute(),
      router: useRouter(),
    });
    const userInfo = computed(() => {
      return state.store.getters.userInfo;
    });
    const isMyself = computed(() => {
      return state.route.params.userId == userInfo.value.UserId;
    });
    const editData = () => {
      state.router.push({ name: "accountSettings" });
    };
    async function setFollow() {
      if ((await state.store.dispatch("loginCheck")) as unknown as Boolean) {
        follow({
          followId: Number(state.route.params.userId),
          action: !Boolean(state.list.IsFollowed),
        }).then((res: any) => {
          if (res.code == 0) {
            ElMessage.success("操作成功!");
            state.list.IsFollowed = Number(!Boolean(state.list.IsFollowed));
          } else {
            ElMessage.error(res.msg);
          }
        });
      }
    }
    async function getUserInformation() {
      await getUserBasic({userId: state.route.params.userId}).then((res: any) => {
        console.log(res);
        if (res.code == 0) {
          state.list = res.data;
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
    getUserInformation();
    return {
      ...toRefs(state),
      editData,
      getUrl,
      isMyself,
      setFollow,
    };
  },
});
</script>
<style lang="scss" scoped>
.userCenter-box {
  display: flex;
  justify-content: center;
  background-color: RGBA(247, 248, 250, 1);
  padding-top: 10px;
  .userCenter-container {
    width: 1200px;
    padding: 3%;
    background-color: RGBA(255, 255, 255, 1);
    .user-info-box {
      height: 260px;
      background: #fafafb;
      padding: 22px 0px;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      align-items: center;
      .user-info-name {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 10px;
        margin-top: 10px;
      }
      .user-info-other {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        margin-bottom: 4px;
      }
      .edit-user-info {
        font-size: 14px;
        font-weight: 500;
        color: #61a4ff;
        margin-top: 4px;
        cursor: pointer;
      }
    }
    .menu-box {
      display: flex;
      margin-top: 10px;
      border-bottom: 1px solid #ebebff;
      .menu-item {
        width: 100px;
        cursor: pointer;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 50px;
        height: 50px;
        &.route-active {
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          // todo 激活态的样式滚动
          // border-bottom: 1px solid linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
          border-bottom: 1px solid #7eb6ff;
        }
      }
    }
  }
}
.icon-follow {
  width: 100px;
  height: 32px;
  background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
  border-radius: 2px;
  text-align: center;
  line-height: 32px;
  margin-right: 18px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}
.privateLetter {
  width: 100px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  background-color: #ffffff;
  border-radius: 2px;
  border: 1px solid #ebebff;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
}
.icon-report {
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  background-color: #ffffff;
  border-radius: 2px;
  border: 1px solid #ebebff;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  margin-left: 15px;
}
</style>
