/**
 * @description 管理中心 Api
 */
import axiosAPI, { baseApi } from "@/api/request";

const Api = {
  USERASSET: `${baseApi}/cloud/user/getUserAssetByUserId`, // 我的钱包-数据概览
  WithdrawalRecord: `${baseApi}/cloud/user/getUserWithdrawalRecord`, //我的钱包-提现明细
  NFTMUSICLIST: `${baseApi}/cloud/user/getMusicNftStoreList`, // NFT批次管理-列表,
  CollectionMusicList: `${baseApi}/cloud/music/my/collection`, // 收藏管理-列表,
  UserAttention: `${baseApi}/cloud/user/follow/list`, // 互动管理-关注列表,
  UserFans: `${baseApi}/cloud/user/fans/list`,//互动管理-粉丝管理
  MusicLikesList: `${baseApi}/cloud/user/getMusicLikesList`, //互动管理-收到的赞
  UserBasic: `${baseApi}/cloud/user/getUserBasic`, //账户设置-账户设置
  updateUser: `${baseApi}/cloud/user/updateUser`, //账户设置-修改用户信息
  Balancewithdrawal: `${baseApi}/cloud/user/createWithdrawal`,//我的钱包-余额提现,
  realNameAuthentication: `${baseApi}/cloud/user/realNameAuthentication`, //实名认证
  getUserIncomeSummary: `${baseApi}/cloud/user/getUserIncomeSummary`, //收益数据-概览
  getEverydayPofitList: `${baseApi}/cloud/music/getEverydayPofitList`, //收益数据列表
  getCommentList: `${baseApi}/cloud/music/getCommentList`, //评论管理
  setUserBank: `${baseApi}/cloud/user/setUserBank`, //设置开户行,
  getUserMusicNftList: `${baseApi}/cloud/user/getUserMusicNftList`, //nft批次管理,
  setUserNftTop: `${baseApi}/cloud/user/setUserNftTop`, //置顶取消置顶
  setUserNftPrivate: `${baseApi}/cloud/user/setUserNftPrivate`, //仅我可见
  updateUserPhone: `${baseApi}/cloud/user/updateUserPhone`, //修改手机号
  getRealNameAuthentication: `${baseApi}/cloud/user/getRealNameAuthentication`, //获取用户认证信息
  follow: `${baseApi}/cloud/user/follow`, //关注取消关注
  bankList: `${baseApi}/cloud/user/bank/list`,
  myWorks: `${baseApi}/cloud/music/my/works`,
  interactComment: `${baseApi}/cloud/music/interactComment`,
  checkNft: `${baseApi}/cloud/user/nft/info`, //查看nft
  getUserHeilList: `${baseApi}/cloud/user/getUserHeilList`, //收到的赞
  setMusicTop: `${baseApi}/cloud/music/my/works/set-top`, //设置音乐置顶
  deleteComment: `${baseApi}/cloud/music/deleteComment`, //删除评论
  collectTop: `${baseApi}/cloud/user/collect/top`, //音乐收藏置顶
  workPrivate: `${baseApi}/cloud/music/my/works/set-private`, //音乐作品权限
  publishSellNftInfo: `${baseApi}/cloud/music/publishSellNftInfo`, //音乐作品权限
  checkPhone: `${baseApi}/cloud/user/checkPhone`, //验证手机验证码
  commentFeedback: `${baseApi}/cloud/music/my/comment/feedback`, //评论管理
};

export function getUserAsset() {
  return axiosAPI.get(Api.USERASSET);
}
export function bankList() {
  return axiosAPI.get(Api.bankList);
}
export function getWithdrawalRecord(params: object) {
  return axiosAPI.get(Api.WithdrawalRecord, params);
}
export function commentFeedback(params: object) {
  return axiosAPI.get(Api.commentFeedback, params);
}
export function interactComment(params: object) {
  return axiosAPI.get(Api.interactComment, params);
}
export function myWorks(params: object) {
  return axiosAPI.get(Api.myWorks, params);
}
export function getRealNameAuthentication() {
  return axiosAPI.get(Api.getRealNameAuthentication);
}
export function getUserMusicNftList(params: object) {
  return axiosAPI.get(Api.getUserMusicNftList, params);
}
export function getNftMusicList(params: object) {
  return axiosAPI.get(Api.NFTMUSICLIST, params);
}
export function getCollectionMusicList(params: object) {
  return axiosAPI.get(Api.CollectionMusicList, params);
}
export function getUserAttention(params: object) {
  return axiosAPI.get(Api.UserAttention, params);
}
export function getUserFans(params: object) {
  return axiosAPI.get(Api.UserFans, params);
}
export function getMusicLikesList(params: object) {
  return axiosAPI.get(Api.MusicLikesList, params);
}
export function getUserBasic(params: object) {
  return axiosAPI.get(Api.UserBasic, params);
}
export function updateUser(params: object) {
  return axiosAPI.post(Api.updateUser, params );
}
export function workPrivate(params: object) {
  return axiosAPI.post(Api.workPrivate, params );
}
export function publishSellNftInfo(params: object) {
  return axiosAPI.post(Api.publishSellNftInfo, params );
}
export function updateUserPhone(params: object) {
  return axiosAPI.post(Api.updateUserPhone, params );
}
export function setUserNftTop(params: object) {
  return axiosAPI.post(Api.setUserNftTop, params );
}
export function setUserNftPrivate(params: object) {
  return axiosAPI.post(Api.setUserNftPrivate, params );
}
export function balancewithdrawal(params: object) {
  return axiosAPI.post(Api.Balancewithdrawal, params );
}

export function realNameAuthentication(params: object) {
  return axiosAPI.post(Api.realNameAuthentication, params );
}
export function setUserBank(params: object) {
  return axiosAPI.post(Api.setUserBank, params );
}
export function follow(params: object) {
  return axiosAPI.post(Api.follow, params );
}
export function setMusicTop(params: object) {
  return axiosAPI.post(Api.setMusicTop, params );
}
export function checkPhone(params: object) {
  return axiosAPI.post(Api.checkPhone, params );
}
export function deleteComment(params: object) {
  return axiosAPI.post(Api.deleteComment, params );
}
export function collectTop(params: object) {
  return axiosAPI.post(Api.collectTop, params );
}
export function getUserIncomeSummary() {
  return axiosAPI.get(Api.getUserIncomeSummary);
}
export function getEverydayPofitList(params: object) {
  return axiosAPI.get(Api.getEverydayPofitList, params);
}
export function getCommentList(params: object) {
  return axiosAPI.get(Api.getCommentList, params);
}
export function checkNft(params: object) {
  return axiosAPI.get(Api.checkNft, params);
}
export function getUserHeilList(params: object) {
  return axiosAPI.get(Api.getUserHeilList, params);
}
