/**
 * @description nft交易 Api
 */
import axiosAPI, { baseApi } from "@/api/request";

const Api = {
  ORDERCREATE: `${baseApi}/cloud/market/order/create`, // 创建订单
  ORDERSTATE: `${baseApi}/cloud/market/order/state`, // 创建订单
};

export function orderCreateApi(params: Object) {
  return axiosAPI.post(Api.ORDERCREATE, params);
}
export function orderStateApi(params: Object) {
  return axiosAPI.get(Api.ORDERSTATE, params);
}
