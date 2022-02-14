<template>
  <input
    type="file"
    @change="fileChange"
    class="input"
    :multiple="multiple"
    :accept="accept"
    style="display: none"
  />
</template>
<script lang="ts">
import { fileUploadApi, filesUploadApi } from "@/api/apiManagement/file";
import { ElMessage, ElUpload } from "element-plus";
import { reactive, defineComponent, toRefs } from "vue";
export default defineComponent({
  name: "upload",
  components: {
    ElUpload,
  },
  props: {
    accept: String, // 文件格式限制
    onSuccess: Function, // 文件上传成功回调
    onError: Function, // 文件上传失败回调
    beforeUpload: Function, // 文件上传前的钩子
    onExceed: Function, // 文件超出限制的钩子
    maxCount: Object,
    autoUpload: {
      type: Boolean,
      defaule: true,
    },
    cleanList: {
      type: Boolean,
      default: true,
    },
    maxSize: {
      type: Number,
      default: -1,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const data = reactive({
      fileList: [],
      uploadRef: null,
    });
    async function httpRequest(filelist: any) {
      let fileData = new FormData();
      for (const key in filelist) {
        if (Object.prototype.hasOwnProperty.call(filelist, key)) {
          const element = filelist[key];
          fileData.append("file", element);
        }
      }
      return new Promise(async (resolve, reject) => {
        await filesUploadApi(fileData)
          .then((res: any) => {
            if (res.code == 0) {
              resolve(res.data);
            } else {
              resolve(res.msg);
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
    /**
     * @function 获取文件后缀
     * @param filename {string} 文件名
     */
    function getSuffix(filename: string) {
      return filename.substring(filename.lastIndexOf("."));
    }
    function checkName(file: any) {
      if (props.accept == "" || props.accept == "*") {
        return true;
      } else if (props.accept.indexOf(getSuffix(file.name)) >= 0) {
        return true;
      } else if (file.type !== "" && props.accept.indexOf(file.type.split("/")[0]) >= 0) {
        return true;
      } else {
        ElMessage.warning("请上传格式正确的文件！");
        return false;
      }
    }
    function checkSize(size: number) {
      if (size == 0) {
        ElMessage.warning("请勿上传0字节的无效文件！");
        return false;
      }
      if (props.maxSize == -1) {
        return true;
      } else if (props.maxSize < size) {
        return false;
      }
      return false;
    }
    // 上传文件前校验回调
    function beforeUploadMethods(fileList: any): boolean {
      console.log("beforeUploadMethods", fileList, typeof fileList);
      let checkFile = false;
      for (const key in fileList) {
        if (Object.prototype.hasOwnProperty.call(fileList, key)) {
          const file = fileList[key];
          if (!(checkName(file) && checkSize(file.size))) {
            checkFile = false;
            return;
          }
          checkFile = true;
        }
      }
      return checkFile;
    }
    // 超出文件数量回调
    async function onExceedMethods() {
      if (typeof props.onExceed === "function") {
        await props.onExceed();
        return;
      }
      ElMessage.error(props.maxCount.toast);
    }
    function clearFileList(e: any) {
      e.target.value = "";
      console.log("clearFileList", e.target.files);
    }
    async function fileChange(e: any) {
      let filelist = e.target.files;
      // ---- 超出文件数量上传校验
      if (filelist.length > props.maxCount.total) {
        await onExceedMethods();
        //TODO 清空 fileList
        clearFileList(e);
        return;
      }
      //---beforeUpload 校验
      let checkResult = false;
      checkResult = await beforeUploadMethods(filelist);
      if (typeof props.beforeUpload === "function") {
        checkResult = await props.beforeUpload(filelist);
      }
      console.log(checkResult);
      if (checkResult == false) {
        clearFileList(e);
        return;
      }
      // ----------自动上传校验  先简单处理 统一通过 success 返回
      if (props.autoUpload) {
        await httpRequest(filelist)
          .then((res) => {
            props.onSuccess(res);
          })
          .catch((e) => {
            props.onError(e);
          });
      } else {
        props.onSuccess(filelist);
      }
      clearFileList(e);
    }
    return {
      ...toRefs(data),
      fileChange,
    };
  },
});
</script>
<style lang="scss" scoped></style>
