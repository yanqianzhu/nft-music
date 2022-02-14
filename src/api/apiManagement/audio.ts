/**
 * @description 音乐模块 Api
 */
import axiosAPI, { baseApi } from "@/api/request";
const Api = {
  CREATEAUDIO: `${baseApi}/cloud/music/createMusicOrUpdate`,
  MUSCIINFOBYID: `${baseApi}/cloud/music/getMusicInfoByMusicId`, // 获取 音乐详情
  MUSICNFTCASTING: `${baseApi}/cloud/music/createMusicNft`, // 铸造音乐NFT
  MUSICOPERATIONBYUSER: `${baseApi}/cloud/music/musicOperationByUser`, // 音乐数据操作，用户操作(特殊接口)
  HOMEPAGEMUSIC: `${baseApi}/cloud/music/homePageMusicList`, //首页音乐列表
  RECOMMENDMUSICLIST: `${baseApi}/cloud/music/getRecommendMusicList`, // 热歌榜
  GETCOLLECTIONMUSICLIST: `${baseApi}/cloud/music/getMusicCollectList`, // 收藏的音乐列表
  CUMUSICNFTDRAFT: `${baseApi}/cloud/music/createOrUpdateMusicNftDraft`, // 创建或修改音乐铸造nft草稿
  GETMUSICNFTINFO: `${baseApi}/cloud/music/getMusicNftInfo`, // 音乐nft详情
  CREATECOMMENT: `${baseApi}/cloud/music/createComment`, // 创建评论
  GETMUSICNFTLIST: `${baseApi}/cloud/music/getMusicNftList`, // nft批次列表
  GETMUSICNFTLISTBUMUSICID: `${baseApi}/cloud/music/getMusicNftListByMusicId`, // 获取音乐NFT列表基础数据
  GETSELLNFTINFO: `${baseApi}/cloud/music/getSellNftList`, // 获取NFT卖单列表
  GETBUYNFTINFO: `${baseApi}/cloud/music/getBuyNftList`, // 获取NFT买单列表
  MUSICLIKE: `${baseApi}/cloud/music/like`, // 音乐点赞/取消点赞
  MUSICCOLLECT: `${baseApi}/cloud/music/collect`, // 音乐收藏/取消收藏
  GETPLAYINFO: `${baseApi}/cloud/music/playInfo`, // 获取 歌词
  MUSICCREATE: `${baseApi}/cloud/music/create`, // 发布音乐
  MUSICUPDATE: `${baseApi}/cloud/music/update`, // 更新音乐信息
  GETCOMMENTLIST: `${baseApi}/cloud/music/getCommentList`, // 获取一级评论
  COMMENTLIKES: `${baseApi}/cloud/music/commentLikes`, // 获取一级评论
  GETREPLYLIST: `${baseApi}/cloud/music/getReplyList`, // 获取二级评论
  ADDREPORT: `${baseApi}/cloud/user/product/addReport`, // 举报
};
// export function createMusicApi(params: object) {
//   return axiosAPI.post(Api.CREATEAUDIO, params);
// }
export function getMusicInfoById(params: { Id: number }) {
  return axiosAPI.get(Api.MUSCIINFOBYID, params);
}
export function musicNftCastingApi(params: object) {
  return axiosAPI.post(Api.MUSICNFTCASTING, params);
}
export function musicOpeartionByUserApi(params: {
  MusicId: number;
  OperationType: number;
  OperationState: number;
}) {
  return axiosAPI.post(Api.MUSICOPERATIONBYUSER, params);
}
export function getHomePageMusicListApi(params: object) {
  return axiosAPI.post(Api.HOMEPAGEMUSIC, params);
}
export function getRecommendMusicList(params: object) {
  return axiosAPI.get(Api.RECOMMENDMUSICLIST, params);
}
export function getCollectionMusicList(params: object) {
  return axiosAPI.get(Api.GETCOLLECTIONMUSICLIST, params);
}
export function musicNftDraftApi(params: object) {
  return axiosAPI.post(Api.CUMUSICNFTDRAFT, params);
}
export function getMusicInfoApi(params: object) {
  return axiosAPI.get(Api.GETMUSICNFTINFO, params);
}
export function createCommentApi(params: object) {
  return axiosAPI.post(Api.CREATECOMMENT, params);
}
export function getMusciNFTListApi(params: object) {
  return axiosAPI.get(Api.GETMUSICNFTLIST, params);
}
export function getMusicNftListByMusicIdApi(params: object) {
  return axiosAPI.get(Api.GETMUSICNFTLISTBUMUSICID, params);
}
export function getSellNftInfoApi(params: object) {
  return axiosAPI.get(Api.GETSELLNFTINFO, params);
}
export function getBuyNftInfoApi(params: object) {
  return axiosAPI.get(Api.GETBUYNFTINFO, params);
}
export function setMusicLikeStatusApi(params: object) {
  return axiosAPI.post(Api.MUSICLIKE, params);
}
export function setMusicCollectStatusApi(params: object) {
  return axiosAPI.post(Api.MUSICCOLLECT, params);
}
export function getPlayInfoApi(params: object) {
  return axiosAPI.get(Api.GETPLAYINFO, params);
}
export function createMusicApi(params: object) {
  return axiosAPI.post(Api.MUSICCREATE, params);
}
export function updateMusicApi(params: object) {
  return axiosAPI.post(Api.MUSICUPDATE, params);
}
export function getCommentListApi(params: object) {
  return axiosAPI.get(Api.GETCOMMENTLIST, params);
}
export function setCommentLikes(params: object) {
  return axiosAPI.get(Api.COMMENTLIKES, params);
}
export function postCommentLikes(params: object) {
  return axiosAPI.post(Api.COMMENTLIKES, params);
}
export function getReplyListApi(params: object) {
  return axiosAPI.get(Api.GETREPLYLIST, params);
}
export function addReportApi(params: object) {
  return axiosAPI.post(Api.ADDREPORT, params);
}
