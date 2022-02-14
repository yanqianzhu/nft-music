<template>
  <div class="singer">
    <el-form
      :model="uploadData"
      :rules="rules"
      ref="uploadRef"
      style="--el-color-primary: #000; --el-color-primary-light-4: #000"
    >
      <el-form-item prop="Type">
        <main-title :title="titleList[0]" :required="true"></main-title>
        <el-select v-model="uploadData.type" placeholder="请选择作品类型">
          <el-option v-for="item in workType" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <main-title :title="titleList[1]" :required="true"></main-title>
      <el-form-item prop="Path" class="music-form-item">
        <uploadVue
          :hasQuestionMark="true"
          v-model:fileList="uploadData.path"
          :accept="accept"
        ></uploadVue>
        <!-- <div class="upload-box">
          <p class="selete-files">
            <svg-icon iconClass="upload-file" className="icon-upload-file"></svg-icon>
            上传歌曲文件
          </p>
          <span class="tips">{{ fileTips }}</span>
          <el-tooltip placement="bottom" effect="light">
            <span>
              <svg class="icon icon-question-mark" aria-hidden="true">
                <use xlink:href="#icon-yiwen"></use>
              </svg>
            </span>
            <template #content> 为了更好得到编辑推荐，请上传320kbqs以上码率歌曲文件 </template>
          </el-tooltip>
        </div> -->
      </el-form-item>
      <el-form-item prop="Cover" class="music-form-item">
        <uploadVue
          :tips="pictureTips"
          tipsDirection="right"
          v-model:fileList="uploadData.cover"
          accept="image/png,image/jpg"
        >
          <template #upload>
            <span class="upload-label">
              <p class="jia">+</p>
              <p class="label">上传作品封面</p>
            </span>
          </template>
        </uploadVue>
      </el-form-item>
    </el-form>
    <main-title :title="titleList[2]"></main-title>
    <div class="accompaniment-box">
      <uploadVue
        uploadText="上传伴奏文件"
        v-model:fileList="uploadData.accompanimentPath"
        :accept="accept"
      ></uploadVue>
      <uploadVue
        uploadText="上传干音文件"
        v-model:fileList="uploadData.drySound"
        :accept="accept"
      ></uploadVue>
    </div>
    <p class="warning-box">
      <tips>
        <template #container>
          <span>
            <svg class="icon icon-warning" aria-hidden="true">
              <use xlink:href="#icon-jingshi"></use>
            </svg>
            原创审核标准（必看）
          </span>
        </template>
        <template #tips>
          <div class="tips-content">
            <ul class="tips-first-ul-box">
              <li>
                1. 必须是上传人自己参与创作的原创歌曲：
                <ul class="tips-ul">
                  <li>
                    ①上传者请正确、完整地填写好歌曲信息，包括自己参与歌曲的身份，若提供的填写框没有对应的身份，请填写在歌词头部。
                  </li>
                  <li>
                    ②上传者与作词、作曲、编曲、演唱、策划、统筹、剧本、监制、发行(如社团名、工作室名称)、后期（后期包括混音、调教、母带）、配音（CV）、参与当前歌曲海报的画师（设计）等其中之
                    一的信息相符。
                  </li>
                  <li>③上传者填写的名字，需要跟个人主页昵称或实名认证名称保持一致。</li>
                </ul>
              </li>
              <li>
                2. 引用他人的词、曲、伴奏（填词、歌曲改编、朗诵等）进行二度创作的作品只能传到翻唱。
              </li>
              <li>3. 不能上传他人作品作为收藏。</li>
              <li>4. 歌曲伴奏请传到伴奏区，不要传原创。</li>
              <li>
                5.
                歌曲及歌曲信息中请勿涉及政治、宗教、广告、涉毒、犯罪、色情、低俗、暴力、血腥、消极等违规内容，违反者直接删除内容。多次违反将封号。请不要对红歌进行任何的改编。
                更多详情请查看《用户自制内容上传协议》
              </li>
            </ul>
          </div>
        </template>
      </tips>
      <tips>
        <template #container>
          <span>
            <svg class="icon icon-warning" aria-hidden="true">
              <use xlink:href="#icon-jingshi"></use>
            </svg>
            歌曲评判标准须知
          </span>
        </template>
        <template #tips>
          <div class="tips-content">
            <ul class="tips-first-ul-box">
              <li>1. 原创作品无抄袭，无版权纠纷，无广告。</li>
              <li>2. 翻唱作品无盗歌，无广告。</li>
              <li>3. 后期制作：收集之类的录制歌曲并且无后期的则不能通过。</li>
              <li>4. 唱功：总体稳定完整性较强，整体无走音。</li>
              <li>5. 上传者与演唱者一致。</li>
              <li>6. 歌曲音质好。</li>
            </ul>
          </div>
        </template>
      </tips>
    </p>
    <formVue :formData="formData" :rules="rules" @submit="submit">
      <template #nameTips>
        <tips>
          <template #container>
            <span class="tips-title">
              <svg class="icon icon-warning" aria-hidden="true">
                <use xlink:href="#icon-jingshi"></use>
              </svg>
              原唱审核标准（必看）
            </span>
          </template>
          <template #tips>
            <div class="tips-content">
              <ul class="tips-first-ul-box">
                <li>
                  1.
                  歌曲名后可添加歌曲信息备注，包含但不限于时间、歌曲类型、歌曲用途等，但需要统一用“（）”
                  <br />
                  歌曲名（XXXX） <br />例子，说了再见（电影《电影天堂》主题曲）
                </li>
                <li>
                  2. 翻唱歌曲，若歌曲名上要加上原创歌手名字（可选择不加），用“（cover：）”
                  多个歌手名字时，用“、”：<br />
                  歌曲名（cover：） <br />例子，说了再见（cover：周杰伦）；
                  说了再见（cover：周杰伦、袁咏琳）
                </li>
                <li>
                  3. 歌曲包含版本信息，需要统一用“（）” <br />
                  歌曲名（版本信息）<br />
                  例子，说了再见（纯歌版）
                </li>
                <li>
                  4.
                  身份信息和歌曲类型请不要写在歌名里，否则歌曲无法推荐到TME其他平台，若坚持要写，需要统一格式。歌曲名里只能最多写一个身份或一个歌曲类型，且身份信息和歌曲信息只能二选一:
                  <br />
                  【身份类型】歌曲名，例子，【策划】说了再见
                  <br />
                  【歌曲类型】歌曲名，例子，【填翻】说了再见
                </li>
              </ul>
            </div>
          </template>
        </tips>
      </template>
      <template #inspirationTips>
        <tips>
          <template #container>
            <span class="tips-title">
              <svg class="icon icon-warning" aria-hidden="true">
                <use xlink:href="#icon-jingshi"></use>
              </svg>
              创作歌曲说明（必看）
            </span>
          </template>
          <template #tips>
            <div class="tips-content">
              <ul class="tips-first-ul-box">
                <li>
                  1. 必须说明自己参与创作的原创歌曲里面所获取的灵感素材
                  <ul class="tips-ul">
                    <li>
                      ①上传者请正确、完整地填写创作这首音乐有无参考其他音乐人素材，包括自己参与歌曲的身份，如有，请详细说明。若原创仅为自己灵感创作，请填写在自己的灵感说明。
                    </li>
                    <li>
                      ②上传者与作词、作曲、编曲、演唱、策划、统筹、剧本、监制、发行(如社团名、工作室名称)、后期（后期包括混音、调教、母带）、配音（CV）、参与当前歌曲海报的画师（设计）等其中之一的信息相符。请铸造NFT时需要关联
                    </li>
                    <li>③上传者描述的内容，需要跟事实保持一致，如有不一致，需要承担法律责任。</li>
                  </ul>
                </li>
                <li>
                  2.
                  引用他人的词、曲、伴奏（整首填词、其他歌曲改编、整首伴奏等）进行二度创作的作品只能传到翻唱。
                </li>
                <li>3. 不能上传他人作品作为收藏。</li>
                <li>4. 歌曲伴奏请传到伴奏区，不要传原创。</li>
                <li>
                  5.
                  歌曲及歌曲信息中请勿涉及政治、宗教、广告、涉毒、犯罪、色情、低俗、暴力、血腥、消极等违规内容，违反者直接删除内容。多次违反将封号。请不要对红歌进行任何的改编。
                  更多详情请查看《用户自制内容上传协议》
                </li>
              </ul>
            </div>
          </template>
        </tips>
      </template>
    </formVue>
  </div>
  <!-- <el-dialog
    v-model="successDialog"
    title="提示"
    width="470px"
    :fullscreen="true"
    :close-on-press-escape="false"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div>
      <p>上传中...</p>
    </div>
  </el-dialog> -->
  <successDialogVue
    v-model:successShow="successDialog"
    :loading="successLoading"
  ></successDialogVue>
</template>

<script lang="ts">
import mainTitle from "@/components/publication/header/mainTitle.vue";
import uploadVue from "@/components/publication/upload/index.vue";
import formVue from "@/components/publication/form/index.vue";
import tips from "@/components/publication/form/tips.vue";
import editFormVue from "@/components/casting/editForm.vue";
import {
  Name,
  Singing,
  WriteLyrics,
  WriteMusic,
  Language,
  Genre,
  Mood,
  WorkType,
  inspiration,
  musicCopyRight,
} from "@/utils/rules";
import type { FormState } from "@/model/formData";
import { createMusicApi } from "@/api/apiManagement/audio";
import { toRefs, reactive, defineComponent } from "vue";
import { LANGUAGE, GENRE, MOOD } from "@/model/selectData";
import { ElSelect, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import successDialogVue from "@/components/publication/successDialog.vue";

export default defineComponent({
  name: "Singer",
  components: {
    uploadVue,
    mainTitle,
    formVue,
    tips,
    editFormVue,
    ElSelect,
    successDialogVue,
  },
  setup() {
    let LyricPathValidate = (rule: Object, value: any, callback: Function) => {
      if (data.uploadData.path == "") {
        callback(new Error("请上传歌词文件"));
      }
      callback();
    };
    let coverValidate = (rule: Object, value: any, callback: Function) => {
      if (data.uploadData.cover == "") {
        callback(new Error("请上传作品封面"));
      }
      callback();
    };
    let musicValidate = (rule: Object, value: any, callback: Function) => {
      if (data.uploadData.path == "") {
        callback(new Error("请上传歌曲文件"));
      }
      callback();
    };
    let data = reactive({
      uploadRef: null,
      uploadData: {
        type: "",
        path: "", // 歌曲文件路径
        cover: "",
        accompanimentPath: "", // 伴奏文件路径
        drySound: "", // 干音文件路径
      },
      workType: [
        { key: 10041, label: "歌曲" },
        { key: 10044, label: "Demo" },
      ],
      titleList: [
        "选择作品类型",
        "选择歌曲文件",
        "上传伴奏和干音文件（文件不会在平台进行展示，上传文件有助于审核）",
      ],
      fileTips: "请上传码率不低于128Kbps，且200M以内的mp3/wma/wav格式的文件",
      pictureTips:
        "请上传您的作品封面图片，像素比例长宽在800x800范围内，尺寸1 : 1，格式为png、jpg，最大不超过5MB",
      rules: {
        name: [{ validator: Name, trigger: "blur", required: true }],
        singing: [{ validator: Singing, trigger: "blur", required: true }],
        writeLyrics: [{ validator: WriteLyrics, trigger: "blur", required: true }],
        writeMusic: [{ validator: WriteMusic, trigger: "blur", required: true }],
        language: [{ validator: Language, trigger: "change", required: true }],
        genre: [{ validator: Genre, trigger: "change", required: true }],
        mood: [{ validator: Mood, trigger: "change", required: true }],
        type: [{ validator: WorkType, trigger: "change", required: true }],
        inspirationDescription: [{ validator: inspiration, trigger: "blur", required: true }],
        path: [{ validator: musicValidate, trigger: "change", required: true }],
        cover: [{ validator: coverValidate, trigger: "change", required: true }],
        copyRight: [{ validator: musicCopyRight, trigger: "blur", required: true }],
        // // TODO
        // download: [{ validator: select, trigger: "change" }],
        // agreeUserAgreement: [{ validator: select, trigger: "change" }],
        // upload: [{ validator: select, trigger: "change" }],
      },
      router: useRouter(),
      accept: "audio/mp3,audio/wav,audio/wma",
      placeholder: "若有多人参与，建议使用‘、’分隔。例如：张三、李四",
      successDialog: false,
      successLoading: false,
    });
    const formData: FormState[] = [
      {
        label: "填写歌曲信息",
        children: [
          { label: "歌曲名称:", types: 0, valueName: "name", tipSlotName: "musicName" },
          { label: "演唱:", types: 0, valueName: "singing" },
          { label: "作词:", types: 0, valueName: "writeLyrics" },
          { label: "作曲:", types: 0, valueName: "writeMusic" },
          { label: "编曲:", types: 0, valueName: "arranger" },
          { label: "制作人:", types: 0, valueName: "producer" },
          { label: "和声:", types: 0, valueName: "harmony" },
          { label: "录音:", types: 0, valueName: "recording" },
          { label: "母带:", types: 0, valueName: "originalDemo" },
          { label: "混音:", types: 0, valueName: "mix" },
          { label: "后期混缩:", types: 0, valueName: "confusion" },
          { label: "监制:", types: 0, valueName: "production" },
          { label: "其他参与:", types: 1, valueName: "otherIn", rows: 5 },
          {
            label: "语种(多选):",
            types: 5,
            radioType: 1,
            valueName: "language",
            radioGroup: LANGUAGE,
          },
          {
            label: "曲风(多选):",
            types: 5,
            radioType: 1,
            valueName: "genre",
            radioGroup: GENRE,
          },
          {
            label: "心情(多选):",
            types: 5,
            radioType: 1,
            valueName: "mood",
            radioGroup: MOOD,
          },
          {
            label: "歌曲版权",
            types: 0,
            valueName: "copyRight",
          },
        ],
      },
      {
        label: "关联音乐",
        children: [
          {
            label: "网易云音乐",
            valueName: "wangyiyunUrl",
            types: 0,
          },
          {
            label: "QQ音乐",
            valueName: "QQUrl",
            types: 0,
          },
          {
            label: "酷狗音乐",
            valueName: "kugouUrl",
            types: 0,
          },
          {
            label: "酷我音乐",
            valueName: "kuwoUrl",
            types: 0,
          },
        ],
      },
      {
        label: "上传简介&歌词",
        children: [
          {
            label: "作品简介:",
            types: 1,
            valueName: "inspirationDescription",
            rows: 5,
            tipSlotName: "inspirationTips",
          },
          {
            label: "歌词:",
            types: 4,
            valueName: "lyricPath",
            uploadText: "上传歌词文件",
            tips: "请上传歌词文件,文件格式为 lrc 《如何制作 lrc 歌词》",
            accept: "file/lrc",
          },
          {
            label: "",
            types: 3,
            valueName: "agreeUserAgreement",
            checkLabel:
              "我已确保销售的版权比例，一定归我所有，一旦销售成功产生收益，我将承担相应的法律责任",
          },
          {
            label: "",
            types: 3,
            valueName: "upload",
            checkLabel: "我已确认不会一首歌出售多次或多平台出售，我将承当相应的法律责任",
          },
        ],
      },
    ];
    const submit = async (validateData: any) => {
      await data.uploadRef.validate(async (valid: boolean, field: Object) => {
        if (valid) {
          data.successLoading = true;
          data.successDialog = true;
          let Labels: { type: number; label: string }[] = [];
          validateData.genre.forEach((element: string) => {
            Labels.push({ type: 10071, label: element });
          });
          validateData.mood.forEach((element: string) => {
            Labels.push({ type: 10072, label: element });
          });
          validateData.language.forEach((element: string) => {
            Labels.push({ type: 10073, label: element });
          });
          let musicDate = JSON.parse(JSON.stringify(validateData));
          delete musicDate.mood;
          delete musicDate.language;
          delete musicDate.genre;
          delete musicDate.agreeUserAgreement;
          delete musicDate.upload;
          musicDate.copyRight = Number(musicDate.copyRight) * 100;
          await createMusicApi({
            ...musicDate,
            ...data.uploadData,
            labels: Labels,
          })
            .then((res: any) => {
              console.log("createMusic", res);
              if (res.code == 0) {
                data.successLoading = false;
                ElMessage.success("成功提交，请耐心等待审核~");
                // data.router.push({ name: "Work" });
              } else {
                data.successLoading = false;
                data.successDialog = false;
                ElMessage.error(res.msg);
              }
            })
            .catch((e) => {
              data.successLoading = false;
              data.successDialog = false;
              ElMessage.error(e);
            });
        } else {
          if (Object.keys(validateData).length == 0) {
            return false;
          }
          for (const key in field) {
            if (Object.prototype.hasOwnProperty.call(field, key)) {
              const element = field[key];
              return ElMessage.error(element[0].message);
            }
          }
          return false;
        }
      });
    };
    return {
      formData,
      submit,
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss" scoped>
.singer {
  .upload-label {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    .jia {
      font-size: 24px;
    }
    .label {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
    }
  }
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
  .accompaniment-box {
    background: #fcfcfc;
    border-radius: 6px;
    border: 1px solid #ebebff;
    padding: 20px 40px;
  }
  .warning-box {
    margin-top: 20px;
    color: rgba(255, 0, 0, 1);
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 50px;
    .icon-warning {
      font-size: 18px;
      margin-right: 10px;
    }
    span {
      cursor: pointer;
      &:first-child {
        margin-right: 52px;
      }
    }
  }
}
</style>
<style lang="scss">
.singer {
  .el-form {
    .music-form-item {
      line-height: normal;
      height: auto;
      margin: 0px;
      .el-form-item__content {
        line-height: normal;
        height: auto;
        margin-bottom: 20px;
      }
      .upload-box {
        margin-bottom: 0px;
      }
    }
    .el-form-item {
      .el-select {
        .el-input__icon {
          display: flex;
          align-items: center;
        }
        .el-input__validateIcon {
          display: none;
        }
      }
    }
  }
}
</style>
