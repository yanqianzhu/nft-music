import { ElMessage } from "element-plus";
import { loginApi, isLoginApi } from "@/api/apiManagement/login";
import { getCookie, setCookie } from "@/utils/cookies";
import axios from "axios";
import { useStore } from "vuex";
import store from "@/store";

export default {
  state: {
    playerList: [],
    currentPlayerIndex: 0,
  },
  mutations: {
    setPlayerList(state: { playerList: any }, playerlist: any) {
      state.playerList = playerlist;
      console.log("playerList", state.playerList);
    },
    setCurrenyPlayerIndex(state: { currentPlayerIndex: any }, currentPlayerIndex: any) {
      state.currentPlayerIndex = currentPlayerIndex;
    },
  },
  actions: {},
  getters: {
    playerList: (state: { playerList: any }) => state.playerList,
    currentPlayerIndex: (state: any) => state.currentPlayerIndex,
  },
};
