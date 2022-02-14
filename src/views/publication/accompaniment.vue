<template>
  <div class="singer">
    <main-title :title="titleList[0]"></main-title>
    <elupload :hasQuestionMark="true"></elupload>
    <p class="warning-box">
      <tips>
        <template #container>
          <span>
            <svg class="icon icon-warning" aria-hidden="true">
              <use xlink:href="#icon-jingshi"></use>
            </svg>
            伴奏审核标准（必看）
          </span>
        </template>
        <template #tips>
          <div class="tips-content">
            <ul class="tips-first-ul-box">
              <li>1. 必须真的是伴奏（纯音乐、缺男声/女声伴奏，和声伴奏）</li>
              <li>
                2.
                歌曲及歌曲信息中请勿涉及政治、宗教、广告、涉毒、犯罪、色情、低俗、暴力、血腥、消极等违规内容，违反者直接删除内容。多次违反将封号。请不要对红歌进行任何的改编。
                <br />
                更多详情请查看 《用户自制内容上传协议》
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
            歌曲伴奏评判标准须知
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
    <elupload tipsDirection="top" :tips="pictureTips"></elupload>
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
                  1. 歌曲名后可添加歌曲信息备注，包含但不限于时间、歌曲类型、歌曲用途等，但需要统一用“（）” <br />
                  歌曲名（XXXX） <br />例子，说了再见（电影《电影天堂》主题曲）
                </li>
                <li>
                  2. 翻唱歌曲，若歌曲名上要加上原创歌手名字（可选择不加），用“（cover：）” 多个歌手名字时，用“、”：<br />
                  歌曲名（cover：） <br />例子，说了再见（cover：周杰伦）； 说了再见（cover：周杰伦、袁咏琳）
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
// import { Name, SelectValidate } from "@/utils/rules";

export default {
  name: "Accompaniment",
  components: {
    elupload,
    mainTitle,
    formVue,
    tips,
  },
  setup() {
    const titleList = ["选择歌曲文件"];
    const pictureTips = "请上传您的作品封面图片，像素比例长宽在1200x1200范围内，尺寸1 : 1，格式为png、jpg，最大不超过15MB";
    const rules = {
      // musicName: [{ validator: Name, trigger: "blur", required: true }],
      // cover: [{ validator: Name, trigger: "blur", required: true }],
      // language: [{ validator: SelectValidate, trigger: "change", required: true }],
      // genre: [{ validator: SelectValidate, trigger: "change", required: true }],
      // description: [{ validator: SelectValidate, trigger: "change", required: true }],
      // singer: [{ validator: select, trigger: "change", required: true }],
      // composing: [{ validator: select, trigger: "change", required: true }],
      // lyrics: [{ validator: select, trigger: "change", required: true }],
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
          { label: "原唱:", types: 0, valueName: "singer" },
          {
            label: "曲风:",
            types: 2,
            radioType: 1,
            valueName: "genre",
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
        ],
      },
      {
        label: "上传标题&灵感&歌词",
        children: [
          { label: "标题:", types: 1, valueName: "title", rows: 3 },
          { label: "灵感说明:", types: 1, valueName: "inspiration", rows: 5 },
        ],
      },
      {
        label: "歌词设置",
        children: [
          { label: "下载设置:", types: 2, valueName: "download", radioGroup: ["不允许下载", "免费下载"] },
          { label: "", types: 3, valueName: "agreeUserAgreement", checkLabel: "我已阅读并同意《用户自制内容上传协议》" },
          { label: "", types: 3, valueName: "upload", checkLabel: "本歌曲仅上传到XXXX" },
        ],
      },
    ];
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
