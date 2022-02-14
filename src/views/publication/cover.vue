<template>
  <div class="singer">
    <div id="shangchuan">上传</div>
    <main-title :title="titleList[0]"></main-title>
    <elupload :hasQuestionMark="true"></elupload>
    <p class="warning-box">
      <tips>
        <template #container>
          <span>
            <svg class="icon icon-warning" aria-hidden="true">
              <use xlink:href="#icon-jingshi"></use>
            </svg>
            翻唱审核标准（必看）
          </span>
        </template>
        <template #tips>
          <div class="tips-content">
            <ul class="tips-first-ul-box">
              <li>
                1. 必须是上传人自己唱的翻唱歌曲或参与创作的翻唱歌曲：
                <ul class="tips-ul">
                  <li>
                    ①上传者请正确、完整地填写好歌曲信息，包括自己参与歌曲的身份，若提供的填写框没有对应的身份，请填写在歌词头部。
                  </li>
                  <li>
                    ②上传者与作词、作曲、编曲、演唱、策划、统筹、剧本、监制、发行(如社团名、工作室名称)、后期（后期包括混音、调教、母带）、配音（CV）、参与当前歌曲海报的画师（设计）等其中之一的信息相符。
                  </li>
                  <li>③上传者填写的名字，需要跟个人主页昵称或实名认证名称保持一致。</li>
                </ul>
              </li>
              <li>2. 不能上传他人作品作为收藏。</li>
              <li>3. 歌曲伴奏请传到伴奏区，不要传翻唱。</li>
              <li>
                4.
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
    <elupload :tips="pictureTips"></elupload>
    <formVue :formData="formData" :rules="rules">
      <template #nameTips>
        <tips>
          <template #container>
            <span class="tips-title">
              <svg class="icon icon-warning" aria-hidden="true">
                <use xlink:href="#icon-jingshi"></use>
              </svg>
              歌曲名称审核标准（必看）
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
    </formVue>
  </div>
</template>

<script lang="ts">
import mainTitle from "@/components/publication/header/mainTitle.vue";
import elupload from "@/components/publication/upload/index.vue";
import formVue from "@/components/publication/form/index.vue";
import tips from "@/components/publication/form/tips.vue";
import type { FormState } from "@/model/formData";
import { Upload } from "@/utils/upload";
import { onMounted } from "vue";
// import { name, select } from "@/utils/rules";

export default {
  name: "Cover",
  components: {
    elupload,
    mainTitle,
    formVue,
    tips,
  },
  setup() {
    const titleList = ["选择歌曲文件"];
    const pictureTips =
      "请上传您的作品封面图片，像素比例长宽在1200x1200范围内，尺寸1 : 1，格式为png、jpg，最大不超过15MB";
    const rules = {
      // musicName: [{ validator: name, trigger: "blur", required: true }],
      // cover: [{ validator: name, trigger: "blur", required: true }],
      // language: [{ validator: select, trigger: "change", required: true }],
      // genre: [{ validator: select, trigger: "change", required: true }],
      // description: [{ validator: name, trigger: "blur", required: true }],
      // singer: [{ validator: name, trigger: "blur", required: true }],
      // composing: [{ validator: name, trigger: "blur", required: true }],
      // lyrics: [{ validator: name, trigger: "blur", required: true }],
      // //TODO 标题 灵感说明  歌词 表单校验
      // title: [{ validator: select, trigger: "blur", required: true }],
      // inspiration: [{ validator: select, trigger: "blur", required: true }],
      // lrcFile: [{ validator: select, trigger: "change", required: true }],
      // // TODO
      // download: [{ validator: select, trigger: "change" }],
      // agreeUserAgreement: [{ validator: select, trigger: "change" }],
      // upload: [{ validator: select, trigger: "change" }],
    };
    const formData: FormState[] = [
      {
        label: "填写歌曲信息",
        children: [
          { label: "歌曲名称:", types: 0, valueName: "musicName", tipSlotName: "nameTips" },
          { label: "演唱:", types: 0, valueName: "cover" },
          {
            label: "语种:",
            types: 2,
            radioType: 1,
            valueName: "language",
            radioGroup: [
              "华语",
              "欧美",
              "日语",
              "韩语",
              "俄语",
              "法语",
              "德语",
              "粤语",
              "闽南语",
              "方言",
              "西班牙语",
              "其他",
              "阿拉伯语",
              "维语",
              "藏语",
            ],
          },
          {
            label: "曲风:",
            types: 2,
            radioType: 1,
            valueName: "genre",
            radioGroup: [
              "古风",
              "流行",
              "民谣",
              "摇滚",
              "RAP/说唱",
              "动漫/游戏",
              "民族",
              "美声",
              "R&B",
              "广播剧",
              "搞笑/另类",
              "爵士",
              "电子",
              "HIP/HOP",
              "DJ/舞曲",
              "影视",
              "对唱/合唱",
              "儿歌",
              "红歌",
              "古典",
              "纯音乐",
              "新世纪",
              "戏曲/曲艺",
              "填词",
              "朗诵",
            ],
          },
        ],
      },
      {
        label: "填写原唱歌曲信息",
        children: [
          { label: "作曲说明:", types: 0, valueName: "description" },
          { label: "原唱:", types: 0, valueName: "singer" },
          { label: "作曲:", types: 0, valueName: "composing" },
          { label: "作词:", types: 0, valueName: "lyrics" },
        ],
      },
      {
        label: "上传标题&灵感&歌词",
        children: [
          { label: "标题:", types: 1, valueName: "title", rows: 3 },
          { label: "灵感说明:", types: 1, valueName: "inspiration", rows: 5 },
          {
            label: "歌词:",
            types: 4,
            valueName: "lrcFile",
            uploadText: "上传歌词文件",
            tips: "请上传您的歌词文件，像素比例长宽在1200x1200范围内，尺寸1 : 1，格式为png、jpg，最大不超过15MB",
          },
        ],
      },
      {
        label: "歌词设置",
        children: [
          {
            label: "下载设置:",
            types: 2,
            valueName: "download",
            radioGroup: ["不允许下载", "免费下载"],
          },
          {
            label: "",
            types: 3,
            valueName: "agreeUserAgreement",
            checkLabel: "我已阅读并同意《用户自制内容上传协议》",
          },
          { label: "", types: 3, valueName: "upload", checkLabel: "本歌曲仅上传到XXXX" },
        ],
      },
    ];
    onMounted(() => {
      let uploader = new Upload({
        target: "shangchuan",
        onSuccess: (file) => {},
        onError: (e) => {},
        maxCount: { total: 1, toast: "ssss" },
        multiple: true,
      });
    });
    return {
      titleList,
      pictureTips,
      formData,
      rules,
    };
  },
};
</script>

<style lang="scss" scoped>
.singer {
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
