/**
 * @description 鉴权登录管理模块 Api
 */
import axiosAPI, { baseApi } from "@/api/request";
const Api = {
  LOGIN: `${baseApi}/cloud/auth/login`,
  REGISTOR: `${baseApi}/cloud/user/register`,
  PHONECODE: `${baseApi}/cloud/account/sms`,
  ISLOGIN: `${baseApi}/cloud/auth/isLogin`,
  BASIC: `${baseApi}/cloud/user/getUserBasic`,
};

export function loginApi(params: object) {
  return axiosAPI.post(Api.LOGIN, params);
}
export function registoreApi(params: object) {
  return axiosAPI.post(Api.REGISTOR, params);
}
export function getPhoneCode(params: object) {
  return axiosAPI.post(Api.PHONECODE, params);
}
export function isLoginApi() {
  return axiosAPI.post(Api.ISLOGIN, {});
}
export function getUserBasic(params: object) {
  return axiosAPI.get(Api.BASIC, params);
}
