import uploadVue from "@/components/public/upload.vue";
import { createApp } from "vue";

/**
 * @function 上传
 * @param target {string|element} 触发文件选择对话框的DOM元素，当点击该元素后便后弹出文件选择对话框。该值可以是DOM元素对象本身，也可以是该DOM元素的id
 * @param accept {string} 文件限制类型 eg:image/*  image/jpg,image/png  video/*
 * @param maxCount {object} 允许上传文件数量 { total: 数量, toast: 文案 }
 * @param multiple {Boolean} 是否可以在文件浏览对话框中选择多个文件,默认 false
 * @param autoUpload {Boolean} 返回false时不会自动上传
 * @param maxSize {number} 上传的最大字节数
 * @param beforeUpload {function:Boolean} 上传前的文件校验，已经做了文件类型校验，可自定义校验规则
 * @param onExceed {function} 文件数量选择超出限制的回调钩子
 * @param onSuccess {function(fileList:Array)} 成功回调参数 fileList:array
 * @param onError {function(e:string)} 错误回调 e:string 具体的错误信息
 *  TODO @param cleanList {Boolean} 是否在上传后清空上传队列,默认清空
 */
// TODO 暴露方法出去卸载相关 dom
export class Upload {
  constructor(params: uploadParams) {
    //-------挂载
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const UploadComponents = createApp(uploadVue, {
      accept: params.accept,
      maxCount: params.maxCount,
      onSuccess: params.onSuccess,
      onError: params.onError,
      autoUpload: params.autoUpload,
      multiple: params.multiple,
      beforeUpload: params.beforeUpload,
      maxSize: params.maxSize,
    });
    UploadComponents.mount(parent);
    console.log("UploadComponents", UploadComponents);
    let input = UploadComponents._container.getElementsByClassName("input")[0];
    let dom =
      typeof params.target === "object"
        ? params.target
        : document.getElementById(params.target as string);
    dom.addEventListener("click", () => {
      // @ts-ignore
      input.click();
    });
  }
}
type uploadParams = {
  target: string | Element;
  accept?: string;
  maxCount?: { total: number; toast: string };
  multiple?: Boolean;
  autoUpload?: Boolean;
  onSuccess: Function;
  onError: Function;
  beforeUpload?: Function;
  maxSize?: number;
};
