/**
 * @description 排行榜 Api
 */
import axiosAPI, { baseApi } from "@/api/request";

const Api = {
  getRecommendMusicList: `${baseApi}/cloud/music/getRecommendMusicList`, // 排行榜
 
};

export function getRecommendMusicList(params: object) {
  return axiosAPI.get(Api.getRecommendMusicList, params);
}
