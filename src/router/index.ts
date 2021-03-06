import { createRouter, createWebHistory } from "vue-router";

const routerHistory = createWebHistory();
import { ElMessage } from "element-plus";
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("@/views/home/index.vue"),
      redirect: "/home/homePage",
      children: [
        {
          path: "homePage",
          name: "homePage",
          component: () => import("@/views/home/homePage.vue"),
        },
        {
          path: "thumb",
          name: "Thumb",
          component: () => import("@/views/thumb/index.vue"),
        },
        {
          path: "rank",
          name: "rank",
          component: () => import("@/views/rank/index.vue"),
        },
        {
          path: "collect",
          name: "Collect",
          component: () => import("@/views/collect/index.vue"),
        },
      ],
    },
    {
      path: "/musicDetails/:Id",
      name: "musicDetails",
      component: () => import("@/views/musicDetails/index.vue"),
    },
    {
      path: "/publication",
      name: "publication",
      component: () => import("@/views/publication/index.vue"),
      redirect: "/publication/singer",
      meta: {
        login: true,
      },
      children: [
        {
          path: "singer",
          name: "Singer",
          meta: {
            login: true,
          },
          component: () => import("@/views/publication/singer.vue"),
        },
        {
          path: "cover",
          name: "Cover",
          meta: {
            login: true,
          },
          component: () => import("@/views/publication/cover.vue"),
        },
        {
          path: "accompaniment",
          name: "Accompaniment",
          meta: {
            login: true,
          },
          component: () => import("@/views/publication/accompaniment.vue"),
        },
      ],
    },
    {
      path: "/management",
      name: "userManagement",
      component: () => import("@/views/userManagement/index.vue"),
      redirect: "/management/work",
      meta: {
        login: true,
      },
      children: [
        {
          // ????????????
          path: "work",
          name: "Work",
          meta: {
            login: true,
          },
          component: () => import("@/views/userManagement/work.vue"),
        },
        {
          // ????????????
          path: "follow",
          name: "Follow",
          meta: {
            login: true,
          },
          component: () => import("@/views/userManagement/follow.vue"),
        },
        {
          // ????????????
          path: "follower",
          name: "Follower",
          meta: {
            login: true,
          },
          component: () => import("@/views/userManagement/follower.vue"),
        },
        {
          // ????????????
          path: "systemData",
          name: "systemData",
          meta: {
            login: true,
          },
          component: () => import("@/views/userManagement/systemData.vue"),
        },
        {
          // ????????????
          path: "comments",
          name: "Comments",
          meta: {
            login: true,
          },
          component: () => import("@/views/userManagement/comments.vue"),
        },
        {
          // ????????????
          path: "greatData",
          name: "greatData",
          component: () => import("@/views/userManagement/greatData.vue"),
          meta: {
            login: true,
          },
        },
        {
          // ????????????
          path: "privateMessage",
          name: "PrivateMessage",
          component: () => import("@/views/userManagement/privateMessage.vue"),
          meta: {
            login: true,
          },
        },
        {
          // ????????????
          path: "collectionData",
          name: "collectionData",
          component: () => import("@/views/userManagement/collectionData.vue"),
          meta: {
            login: true,
          },
        },
        {
          // nft ??????
          path: "nftStore",
          name: "ManagementNFTStore",
          component: () => import("@/views/userManagement/nftStore.vue"),
          meta: {
            login: true,
          },
        },
        {
          // nft ????????????
          path: "nftBatchManagement",
          name: "nftBatchManagement",
          component: () => import("@/views/userManagement/nftBatchManagement.vue"),
          meta: {
            login: true,
          },
        },
        {
          // nft ????????????
          path: "workdata",
          name: "workdata",
          component: () => import("@/views/userManagement/workData.vue"),
          meta: {
            login: true,
          },
        },
        {
          // nft ????????????
          path: "incomedata",
          name: "incomedata",
          component: () => import("@/views/userManagement/incomeData.vue"),
          meta: {
            login: true,
          },
        },
        {
          // nft ????????????
          path: "fanData",
          name: "fanData",
          component: () => import("@/views/userManagement/fanData.vue"),
          meta: {
            login: true,
          },
        },
        // {
        //   // nft ????????????
        //   path: "tradeData",
        //   name: "tradeData",
        //   component: () => import("@/views/userManagement/tradeData.vue"),
        //   meta: {
        //     login: true,
        //   },
        // },
        {
          // nft ????????????
          path: "verified",
          name: "verified",
          component: () => import("@/views/userManagement/verified.vue"),
          meta: {
            login: true,
          },
        },
        {
          // nft ????????????
          path: "accountSettings",
          name: "accountSettings",
          component: () => import("@/views/userManagement/accountSettings.vue"),
          meta: {
            login: true,
          },
        },
        {
          // nft ????????????
          path: "mypurse",
          name: "mypurse",
          component: () => import("@/views/userManagement/mypurse.vue"),
          meta: {
            login: true,
          },
        },
        {
          // nft ????????????
          path: "withdrawsetting",
          name: "withdrawsetting",
          component: () => import("@/views/userManagement/withdrawSetting.vue"),
          meta: {
            login: true,
          },
        },
      ],
    },
    {
      path: "/casting",
      name: "Casting",
      component: () => import("@/views/casting/index.vue"),
    },
    {
      // ?????? params id
      path: "/NFTIncome/:id",
      name: "NFTIncome",
      meta: {
        login: true,
      },
      component: () => import("@/views/casting/NFTIncome.vue"),
    },
    {
      path: "/userCenter/:userId",
      name: "userCenter",
      component: () => import("@/views/userCenter/index.vue"),
      redirect: { name: "nftStore" },
      children: [
        {
          path: "nftStore",
          name: "nftStore",
          component: () => import("@/views/userCenter/nftStore.vue"),
        },
        {
          path: "musicCollect",
          name: "musicCollect",
          component: () => import("@/views/userCenter/musicCollect.vue"),
        },
      ],
    },
    {
      path: "/userAgreement",
      name: "userAgreement",
      component: () => import("@/views/registrationPolicy/userAgreement.vue"),
    },
    {
      path: "/privacyPolicy",
      name: "privacyPolicy",
      component: () => import("@/views/registrationPolicy/privacyPolicy.vue"),
    },
    //?????????
    {
      path: "/guide",
      name: "guide",
      component: () => import("@/views/guide/index.vue"),
    },
  ],
});
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});
router.beforeEach((to, from, next) => {
  if (to.meta.login && !localStorage.token) {
    ElMessage.error("????????????");
    next(from.path);
  } else {
    next();
  }
});
export default router;
