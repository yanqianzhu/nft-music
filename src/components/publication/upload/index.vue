<template>
  <div class="upload-box" :class="'direction-' + tipsDirection" :id="id">
    <ElUpload
      ref="elupload"
      action="upload"
      :auto-upload="true"
      :multiple="false"
      :limit="1"
      :http-request="fileUpload"
      :on-remove="onRemove"
      :accept="accept"
    >
      <p class="selete-files" v-if="!slotsUpload">
        <svg-icon iconClass="upload-file" className="icon-upload-file"></svg-icon>
        {{ uploadText }}
      </p>
      <slot name="upload" v-else></slot>

      <template #tip>
        <span class="tips">{{ tips }}</span>
        <el-tooltip placement="bottom" effect="light">
          <span>
            <svg class="icon icon-question-mark" aria-hidden="true" v-if="hasQuestionMark">
              <use xlink:href="#icon-yiwen"></use>
            </svg>
          </span>
          <template #content> {{ questionMarkTips }} </template>
        </el-tooltip>
      </template>
    </ElUpload>
  </div>
</template>

<script lang="ts">
import { fileUploadApi } from "@/api/apiManagement/file";
//@ts-ignore TODO
// import { upload } from "@/utils/upload.tsx";
import { ElUpload, ElTooltip } from "element-plus";
import { getUrl } from "@/utils/filter";
import {
  toRefs,
  useSlots,
  defineComponent,
  reactive,
  watch,
  onMounted,
  toRaw,
  PropType,
} from "vue";
// @ts-ignore
import { getUuiD } from "@/utils/validate.js";

export default defineComponent({
  props: {
    uploadText: {
      type: String,
      default: "上传歌曲文件",
    },
    tips: {
      type: String,
      default: "请上传码率不低于128Kbps，且200M以内的mp3/wma/wav格式的文件",
    },
    tipsDirection: {
      type: String,
      default: "right",
    },
    hasQuestionMark: {
      type: Boolean,
      default: false,
    },
    questionMarkTips: {
      type: String,
      default: "为了更好得到编辑推荐，请上传320kbqs以上码率歌曲文件",
    },
    fileList: String,
    accept: String,
  },
  components: {
    ElUpload,
    ElTooltip,
  },
  setup(props, content) {
    const data = reactive({
      slotsUpload: !!useSlots().upload,
      elupload: null,
      id: getUuiD(),
      filelist: props.fileList,
    });
    function onRemove(file: any, fileList: any) {
      console.log(file, fileList);
      data.filelist = "";
    }
    async function fileUpload(file: any) {
      console.log("", file);
      let fileData = new FormData();
      fileData.append("file", file.file);
      await fileUploadApi(fileData).then((res: any) => {
        if (res.code == 0) {
          file.onSuccess();
          file.file.path = res.data.path;
          data.filelist = file.file.path;
        } else {
          file.onError();
        }
      });
    }
    watch(
      () => data.filelist,
      (val) => {
        content.emit("update:fileList", val);
      }
    );
    return {
      ...toRefs(data),
      onRemove,
      fileUpload,
    };
  },
});
</script>

<style lang="scss" scoped>
.upload-box {
  padding: 10px 0px;
  margin-bottom: 20px;
  .tips {
    padding-left: 15px;
  }
  &.direction-top {
    display: flex;
    flex-direction: column-reverse;
    .tips {
      padding-bottom: 20px;
    }
  }
  &.direction-right {
    display: flex;
    align-items: center;
  }
  .selete-files {
    width: 140px;
    display: inline-block;
    height: 40px;
    padding: 0px 15px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    border: 1px dashed rgba(0, 0, 0, 0.15);
    background: RGBA(255, 255, 255, 1);
    cursor: pointer;
    .icon-upload-file {
      margin-right: 5px;
    }
  }
  .tips {
    font-size: 12px;
    color: #000;
  }
  .icon-question-mark {
    margin-left: 10px;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
