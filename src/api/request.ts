import axios from "axios";
import { ElMessage } from "element-plus";
import { devUrl } from "./url";
// axios.defaults.baseURL = process.env.NODE_ENV == "development" ? "/apiProxy" : "";
axios.defaults.baseURL = process.env.NODE_ENV == "development" ? devUrl.target : "";
import store from "@/store/index";
// axios.defaults.withCredentials = true;
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
// axios.defaults.headers["token"] = localStorage.getItem("token") || "";
axios.defaults.headers.post["Content-Type"] = "application/json";
// axios.defaults.timeout = 15000;
import router from "@/router/index";
interface responseModel {
  code: number;
  data: any;
  msg: string;
}
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    const code = response.status;
    if (response.data.code === 401 && router.currentRoute.value.meta.login) {
      ElMessage({
        message: "登录已失效，请重新登录",
        grouping: true,
        type: "error",
      });
      localStorage.removeItem("token");
      store.commit("setLoginStatus", false);
      store.commit("setLoginShow");
      router.push("/home/homePage");
      return;
    }
    if ((code >= 200 && code < 300) || code === 304) {
      return Promise.resolve(response.data as responseModel);
    } else {
      // 响应错误逻辑处理 5xx 4xx 等等
      return Promise.reject(response);
    }
  },
  (error) => {
    ElMessage.error("请求失败，请稍后再试");
    return Promise.reject(error);
  }
);
export const baseApi = "/api/v1.0";
// let axiosInstance: AxiosInstance;
export default {
  get(url: string, params?: any) {
    return axios({ method: "get", url, params });
  },
  post(url: string, data?: any, params?: any) {
    return axios({ method: "post", url, data, params });
  },
  delete(url: string, data?: any) {
    return axios({ method: "delete", url, data });
  },
  put(url: string, data: any) {
    return axios({ method: "put", url, data });
  },
  patch(url: string, data?: any) {
    return axios({ method: "patch", url, data });
  },
  // request<T = any>(config: AxiosRequestConfig, options?: any): Promise<T> {
  //   return new Promise((resolve, reject) => {
  //     axiosInstance
  //       .request<any, AxiosResponse<responseModel>>(config)
  //       .then((res: AxiosResponse<responseModel>) => {
  //         if (transformRequestHook && isFunction(transformRequestHook)) {
  //           try {
  //             const ret = transformRequestHook(res, opt);
  //             resolve(ret);
  //           } catch (err) {
  //             reject(err || new Error("request error!"));
  //           }
  //           return;
  //         }
  //         resolve(res as unknown as Promise<T>);
  //       })
  //       .catch((e: Error | AxiosError) => {
  //         if (requestCatchHook && isFunction(requestCatchHook)) {
  //           reject(requestCatchHook(e, opt));
  //           return;
  //         }
  //         if (axios.isAxiosError(e)) {
  //           // rewrite error message from axios in here
  //         }
  //         reject(e);
  //       });
  //   });
  // },
};
