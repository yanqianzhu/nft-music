import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "element-plus/dist/index.css";
import "@/font/iconfont.css";
import "@/font/iconfont.js";
import store from "@/store";

createApp(App).use(router).use(store).mount("#app");
