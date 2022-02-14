<template>
  <div class="flex-box">
    <div class="container-box">
      <el-container>
        <el-affix :offset="82" target=".container-box" z-index="2">
          <el-aside>
            <div class="release-btn" @click="publish">发布作品</div>
            <el-menu v-if="show" :default-active="activeKey" class="management-menu" router>
              <template v-for="menuItem in menuList" :key="menuItem.path">
                <el-sub-menu :index="menuItem.path" v-if="menuItem.children">
                  <template #title>
                    <icons :name="menuItem.icon" />
                    <span>{{ menuItem.label }}</span>
                  </template>
                  <el-menu-item
                    :index="childrenItem.path"
                    v-for="childrenItem in menuItem.children"
                    :key="childrenItem.path"
                  >
                    {{ childrenItem.label }}
                  </el-menu-item>
                </el-sub-menu>
                <el-menu-item :index="menuItem.path" v-else>
                  <template #title>
                    <el-icon><location /></el-icon>
                    <span>{{ menuItem.label }}</span>
                  </template>
                </el-menu-item>
              </template>
            </el-menu>
          </el-aside>
        </el-affix>
        <el-main style="--el-main-padding: 0px">
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
  <!-- <pub-footer bgcolor="RGBA(51, 51, 51, 1)" textcolor="RGBA(255, 255, 255, 1)"></pub-footer> -->
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, watch,  } from "vue";
import pubFooter from "@/components/footer/index.vue";
import { ElContainer, ElAside, ElMain, ElMenu } from "element-plus";
import { Location, Document, Menu as IconMenu, Setting } from "@element-plus/icons";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import icons from '@/components/userManagement/icons.vue';
export default defineComponent({
  name: "userManagementIndex",
  components: {
    Location,
    Document,
    Setting,
    IconMenu,
    pubFooter,
    ElContainer,
    ElAside,
    ElMain,
    ElMenu,
    icons
  },
  setup() {
    const state = reactive({
      activeKey: useRoute().path,
      route: useRoute(),
      show: true
    })
    // onBeforeRouteUpdate(() => {
    //   state.show = false;
    //   nextTick(() => {
    //     state.activeKey = state.route.path;
    //     state.show = true;
    //   })
    // })
    watch(() => state.route.path, (n) => {
      state.show = false;
      nextTick(() => {
        state.activeKey = n;
        state.show = true;
      })
      
      
    })
    const menuList = [
      {
        label: "作品管理",
        path: "content",
        icon: 'document-copy',
        children: [{ label: "作品管理", path: "/management/work" }],
      },
      {
        label: "NFT管理",
        path: "nft",
        icon: 'expand',
        children: [
          { label: "NFT仓库", path: "/management/nftStore" },
          { label: "NFT批次管理", path: "/management/nftBatchManagement" },
        ],
      },
      {
        label: "我的收益",
        path: "mypursemanage",
        icon: 'money',
        children: [
          { label: "我的钱包", path: "/management/mypurse" },
        ],
      },
      {
        label: "互动管理",
        path: "interactive",
        icon: 'promotion',
        children: [
          { label: "关注管理", path: "/management/follow" },
          { label: "粉丝管理", path: "/management/follower" },
          // { label: "系统消息", path: "/management/systemData" },
          { label: "评论管理", path: "/management/comments" },
          { label: "收到的赞", path: "/management/greatData" },
          { label: "收藏管理", path: "/management/collectionData" },
          // { label: "私信管理", path: "/management/privateMessage" },
        ],
      },
      // {
      //   label: "数据总览",
      //   path: "data",
      //   icon: 'data-line',
      //   children: [
      //     { label: "作品数据", path: "/management/workData" },
      //     { label: "收益数据", path: "/management/incomeData" },
      //     { label: "粉丝数据", path: "/management/fanData" },
      //   ],
      // },
      // {
      //   label: "nft音乐管理",
      //   path: "man",
      //   children: [
      //     { label: "铸造nft", path: "" },
      //     { label: "查看nft", path: "" },
      //   ],
      // },
      { 
        label: "账户设置",
        path: "ver" ,
        icon: 'Setting',
        children :[
          {label: '实名认证',path: '/management/verified'},
          {label: '账户设置',path: '/management/accountSettings'},
        ]
      },
    ];
    const router = useRouter();
    const publish = () => {
      router.push('/publication/singer')
    }
    return { menuList, ...state, publish };
  },
});
</script>

<style lang="scss" scoped>
@mixin hiddenScrollBar {
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
.flex-box {
  display: flex;
  justify-content: center;
  background: RGBA(247, 248, 250, 1);
  padding-top: 10px;
  .container-box {
    width: 1200px;
    background: RGBA(255, 255, 255, 1);
    .release-btn {
      height: 32px;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
      line-height: 32px;
      margin: 4px 10px;
      cursor: pointer;
    }
  }
  .el-aside,
  .management-menu {
    @include hiddenScrollBar;
  }
}
</style>
<style lang="scss">
.container-box {
  .el-affix {
    height: calc(100vh - 82px) !important;
  }
  .el-aside {
    width: 200px;
    height: calc(100vh - 82px) !important;
  }
}
</style>
