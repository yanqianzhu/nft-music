/**
 * @description 文件模块 Api
 */
import axiosAPI, { baseApi } from "@/api/request";

const Api = {
  FILEUPLOAD: `${baseApi}/cloud/fileUpload/file`, // 上传单个文件
  FILESUPLOAD: `${baseApi}/cloud/fileUpload/file/multi`, // 上传单个文件
};

export function fileUploadApi(params: FormData) {
  return axiosAPI.post(Api.FILEUPLOAD, params);
}
export function filesUploadApi(params: FormData) {
  return axiosAPI.post(Api.FILESUPLOAD, params);
}
