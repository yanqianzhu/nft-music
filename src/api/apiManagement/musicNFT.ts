/**
 * @description 前台-音乐模块-音乐NFT
 */
import axiosAPI, { baseApi } from "@/api/request";

const Api = {
  NFTMINT: `${baseApi}/cloud/music/nft/mint`, // 铸造NFT
  BUYNFTINFO: `${baseApi}/cloud/music/publishBuyNftInfo`, // 发布求购信息
  SELLNFTINFO: `${baseApi}/cloud/music/publishSellNftInfo`, // 发布出售信息
  USERNFTLIST: `${baseApi}/cloud/user/nft/list`, // 发布出售信息
};

export function musicNFTApi(params: any) {
  return axiosAPI.post(Api.NFTMINT, params);
}
export function buyNftInfoApi(params: any) {
  return axiosAPI.post(Api.BUYNFTINFO, params);
}
export function sellNftInfoApi(params: any) {
  return axiosAPI.post(Api.SELLNFTINFO, params);
}
export function getUserNftListApi(params: any) {
  return axiosAPI.get(Api.USERNFTLIST, params);
}
