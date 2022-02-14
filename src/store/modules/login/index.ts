import { ElMessage } from "element-plus";
import { loginApi, isLoginApi } from "@/api/apiManagement/login";
import axios from "axios";

export default {
  state: {
    isLogin: false, // 用户登录状态 接口获取
    loginShow: false,
    userInfo: {},
  },
  actions: {
    // 登录
    async login({ commit }: any, params: object) {
      loginApi(params)
        .then((res: any) => {
          if (res.code == 0) {
            if (localStorage.getItem("token")) {
              localStorage.removeItem("token");
            }
            localStorage.setItem("token", res.data.Token);
            axios.defaults.headers["Authorization"] = res.data.Token;
            commit("setLoginShow");
            ElMessage.success("登陆成功！");
            commit("setLoginStatus", true);
            commit("setUserInfo", res.data.UserModel);
          } else {
            commit("setLoginStatus", false);
            ElMessage.error(res.msg);
            commit("setUserInfo", {});
          }
        })
        .catch((e) => {
          console.log(e);
          ElMessage.error(e.data);
          commit("setUserInfo", {});
          commit("setLoginStatus", false);
        });
    },
    // 判断是否登陆
    async isLogin({ commit }: any) {
      if (localStorage.getItem("token")) {
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      }
      await isLoginApi()
        .then((res: any) => {
          if (res.code == 0) {
            commit("setLoginStatus", true);
            commit("setUserInfo", res.data);
          } else {
            commit("setLoginStatus", false);
            commit("setUserInfo", {});
          }
        })
        .catch((e) => {
          commit("setLoginStatus", false);
          commit("setUserInfo", {});
        });
    },
    exitLogin({ commit }: any) {
      //@ts-ignore
      delete axios.defaults.headers.Authorization;
      console.log(axios.defaults.headers);
      commit("setLoginStatus", false);
    },
    loginCheck({ state, commit }: any) {
      console.log(state);
      if (state.isLogin) {
        return true;
      } else {
        commit("setLoginShow");
        return false;
      }
    },
  },
  mutations: {
    setLoginStatus(state: { isLogin: any }, params: any) {
      state.isLogin = params;
    },
    setLoginShow(state: { loginShow: boolean }) {
      state.loginShow = !state.loginShow;
    },
    setUserInfo(state: { userInfo: object }, userInfo: object) {
      state.userInfo = userInfo;
    },
  },
  getters: {
    isLogin: (state: { isLogin: any }) => state.isLogin,
    loginShow: (state: { loginShow: any }) => state.loginShow,
    userInfo: (state: { userInfo: any }) => state.userInfo,
  },
};
