<template>
  <div class="verified-box">
    <div class="verified-title" style="font-weight: bold;">实名认证</div>
    <!-- 第一步 -->
    <!--  -->
    <div class="first-step" v-show="!isAuth && step == 2 && isLoad">
      <div class="remind">
        <img src="../../assets/images/remind.png" />
        <span>根据中华人民共和国法律要求，互联网平台参与者需进行实名认证</span>
      </div>
      <div class="card-box">
        <div>
          <span class="card-top">*</span>
          <span class="card-tip">上传手持身份证照片（半身+人像面）</span>
        </div>
        <div>照片清晰，仅支持png、jpeg格式，2M以内</div>
        <div class="uploadBox">
          <div v-if="!IdentityCardsPeople">
            <img src="../../assets/images/card1.png" />
            <div>手持人像面</div>
            
          </div>
          <img v-else :src='getUrl(IdentityCardsPeople)' />
          <div class="upload"><ImgUpload accept="image/png,image/jpg,image/jpeg" v-model:fileList="IdentityCardsPeople" /></div>
        </div>
        <div>
          <span class="card-top">*</span>
          <span class="card-tip">上传手持身份证照片（半身+人像面）</span>
        </div>
        <div>
          请上传清晰，无水印，无遮挡的扫描件，仅支持png，jpg，jpeg格式，2M以内
        </div>
        <div>
          <div class="uploadBox">
            <div v-if="!IdentityCardsFront">
              <img src="../../assets/images/card1.png" />
              <div>人像面</div>
            </div>
            <img v-else :src='getUrl(IdentityCardsFront)' />
            <div class="upload"><ImgUpload accept="image/png,image/jpg,image/jpeg" v-model:fileList="IdentityCardsFront" /></div>
          </div>
          <div class="uploadBox" style="margin-left: 50px;">
            <div v-if="!IdentityCardsBack">
              <img src="../../assets/images/card1.png" />
              <div>国徽面</div>
            </div>
            <img v-else :src='getUrl(IdentityCardsBack)' />
            <div class="upload"><ImgUpload accept="image/png,image/jpg,image/jpeg" v-model:fileList="IdentityCardsBack" /></div>
          </div>
        </div>
        <div>
          <span class="card-top">*</span>
          <span class="card-tip">许可声明</span>
        </div>
        <div>
          为保障您在合法安全的环境下使用本平台，请您按照相应操作指示完成实名认证，我们将采用行业领先的技术来保护您的信息安全
        </div>
        <div class="read">
          <el-checkbox
            v-model="checkSell"
            style="--el-color-primary: #000"
            label="已阅读并同意"
          >
          </el-checkbox>
          <span>《实名认证授权声明》</span>
        </div>
        <div class="nextBtn">
          <el-button type="primary" :class="canSubmit ? 'active' : ''" class="submit" @click="submit"
            >提交
            </el-button>
        </div>
      </div>
    </div>
     <!--   -->
    <div class="id-information" v-show="!isAuth && step == 1 && isLoad">
      <div class="remind">
        <img src="../../assets/images/remind.png" />
        <span>根据中华人民共和国法律要求，互联网平台参与者需进行实名认证</span>
      </div>
      <div class="information-box">
        <div>
          <span>*</span>
          <span>个人身份信息</span>
        </div>
        <div class="personally">
          <div class="pre-left">
            <div>真实姓名</div>
            <el-input
              class="pre-input"
              v-model="UserRealName"
              placeholder="请输入真实姓名"
              maxlength="10"
            />
          </div>
          <div class="pre-right">
            <div>身份证号码</div>
            <el-input
              maxlength="18"
              class="pre-input"
              v-model="UserCardId"
              placeholder="请输入身份证号"
            />
          </div>
        </div>
        <div class="personally">
          <div class="pre-left">
            <div>证件有效起始日期</div>
            <el-date-picker
              v-model="EffectiveStart"
              type="date"
              placeholder="证件选择有效起始日期"
            />
          </div>
          <div class="pre-right">
            <div>证件有效截止日期</div>
            <el-date-picker
              v-model="EffectiveEnd"
              type="date"
              placeholder="请选择证件有效截止日期"
            />
          </div>
        </div>
        <div class="nextBtn">
          <el-button type="primary" :class="canNext?'active':''" class="submit" @click="next"
            >下一步</el-button
          >
        </div>
      </div>
    </div>
    <div v-if='isAuth && isLoad'>
      <el-alert title="审核失败！" type="error" show-icon :closable="false" v-if="userAsset.certifyState === 3"></el-alert>
      <el-alert title="认证资料正在审核中…" v-if="userAsset.certifyState === 1" type="warning" show-icon :closable="false"></el-alert>
      <el-alert title="审核成功" v-if="userAsset.certifyState === 2" type="success" show-icon :closable="false"></el-alert>
      <div class="certification-information">认证资料</div>
      <div class="verified-content">
        <div class="information">
          <div>
            <div class="information-title">真实姓名</div>
            <div class="information-con">{{userAsset.userRealName}}</div>
          </div>
          <div>
            <div class="information-title">身份证号码</div>
            <div class="information-con">{{userAsset.userCardId}}</div>
          </div>
        </div>
        <div class="information">
          <div>
            <div class="information-title">证件有效起始日期</div>
            <div class="information-con">{{formatDate(+userAsset.effectiveStart  * 1000)}}</div>
          </div>
          <div>
          <!-- （格式为：2008.08.08） -->
            <div class="information-title">证件有效截止日期</div>
            <div class="information-con">{{formatDate(+userAsset.effectiveEnd * 1000)}}</div>
          </div>
        </div>
      </div>
      <div class="nextBtn" v-if="userAsset.certifyState === 3 || userAsset.certifyState === 1">
        <el-button type="primary" class="submit active" @click="changeAuth"
          >修改</el-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ElAvatar, ElMessage } from "element-plus";
import { defineComponent, reactive, toRefs, computed, onMounted } from "vue";
import ImgUpload from '@/components/publication/upload/index.vue'
import { realNameAuthentication, getRealNameAuthentication } from "@/api/apiManagement/userManagement";
import { unix, formatDate, dateFormat, getUrl } from '@/utils/filter';
//@ts-ignore
import { IsCard, IsTime } from '@/utils/validate.js';
export default defineComponent({
  name: "verified",
  components: {
    ElAvatar,
    ImgUpload
  },
  setup() {
    var state = reactive({
      checkSell: true,
      step: 1,
      isAuth: false,
      isLoad: false,
      IdentityCardsPeople: '',
      IdentityCardsFront: '',
      IdentityCardsBack: '',
      UserCardId: '',
      UserRealName: '',
      EffectiveEnd: '',
      EffectiveStart: '',
      userAsset: {
        userId: 0,
        effectiveEnd: '',
        effectiveStart: '',
        userRealName: '',
        userCardId: '',
        certifyState: 0
      },
      
    });
    const getBase = (): void => {
      getRealNameAuthentication().then((res) => {
        if (res.data.userRealName) {
          state.isAuth = true;
        }
        state.EffectiveEnd = res.data.effectiveEnd && dateFormat(res.data.effectiveEnd * 1000, 'yyyy-MM-dd');
        state.IdentityCardsPeople = res.data.identityCardsPeople;
        state.IdentityCardsFront = res.data.identityCardsFront;
        state.IdentityCardsBack = res.data.identityCardsBack;
        state.UserCardId = res.data.userCardId;
        state.UserRealName = res.data.userRealName;
        state.EffectiveStart = res.data.effectiveStart && dateFormat(res.data.effectiveStart * 1000, 'yyyy-MM-dd');
        state.isLoad = true;
        state.userAsset = res.data;
      })
    }
    onMounted(() => {
      getBase();
    })
    const canNext = computed(() => Boolean(state.UserCardId && state.UserRealName && state.EffectiveEnd && state.EffectiveStart))
    const canSubmit = computed(() => Boolean(state.IdentityCardsPeople && state.IdentityCardsFront && state.IdentityCardsBack))
    const next = function() {
      if (!canNext.value) return;
      if (!state.UserRealName) ElMessage.error("请输入真实姓名");
      if (!IsCard(state.UserCardId)) return ElMessage.error("请输入正确的身份证号码");
     
      state.step = 2;
    };
    const changeAuth = () => {
      state.isAuth = false;
      state.step = 1;
    }
    const submit = () => {
      if (!canSubmit.value) return;
      if (!state.checkSell) return ElMessage.error("请确认勾选相关协议");

      realNameAuthentication({
        EffectiveEnd: unix(state.EffectiveEnd) + 86399,
        EffectiveStart: unix(state.EffectiveStart),
        IdentityCardsBack: state.IdentityCardsBack,
        IdentityCardsFront: state.IdentityCardsFront,
        IdentityCardsPeople: state.IdentityCardsPeople,
        UserCardId: state.UserCardId,
        UserRealName: state.UserRealName,
        UserId: state.userAsset.userId
      }).then((res: any) => {
        if (res.code == 0) {
          
          ElMessage.success('提交成功');
          getBase();
        }
      })
    }
    return {
      ...toRefs(state),
      next,
      submit,
      canNext,
      canSubmit,
      formatDate,
      changeAuth,
      getUrl
    };
  },
});
</script>
<style lang="scss">
.verified-box {
  .el-upload{
    height: 1000px;
  }
  .el-upload__input{
    height: 1000px;
  }
  .el-input__prefix-inner{
    display: flex;
    align-items: center;
    justify-content: center;

  }
  .el-input__suffix-inner{
    display: flex;
    align-items: center;
  }
  .el-input {
    width: 320px !important;
  }
}
</style>
<style lang="scss" scoped>
.verified-box {
  padding: 30px 40px 30px 35px;
  .information-box {
    margin-top: 5px;
    .personally {
      margin-top: 9px;
      display: flex;
      justify-content: space-between;
      .pre-input {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
      }
      .pre-left {
        width: 400px;
        > div {
          margin-bottom: 10px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #888888;
          line-height: 20px;
        }
      }
      .pre-right {
        flex: 1;
        margin-left: 100px;
        > div {
          margin-bottom: 10px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #888888;
          line-height: 20px;
        }
      }
    }
  }
  .information-box > div:nth-child(1) {
    padding: 24px 0 18px;
    > span:nth-child(1) {
      color: #ff3333;
      width: 8px;
      height: 8px;
      position: relative;
      top: 2px;
    }
    > span:nth-child(2) {
      margin-left: 5px;
      font-weight: 600;
      color: #333333;
      font-size: 16px;
    }
  }
  .card-box {
    margin-top: 5px;
    .card-top {
      color: #ff3333;
      width: 8px;
      height: 8px;
      position: relative;
      top: 2px;
    }
    .card-tip {
      font-weight: 600;
      color: #333333;
      font-size: 16px;
      margin-left: 5px;
    }
  }
  .card-box > div:nth-child(2),
  .card-box > div:nth-child(5),
  .card-box > div:nth-child(8) {
    margin-top: 7px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
  .card-box > div:nth-child(4),
  .card-box > div:nth-child(7) {
    margin-top: 50px;
  }
  .read {
    margin-top: 84px;
    > span {
      margin-left: 6px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
  }
  .nextBtn {
    margin-top: 54px;
    .submit {
      width: 120px;
      height: 40px;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      border-radius: 2px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      border: none;
      outline: none;
      opacity: 0.6;
    }
    .active{
      opacity: 1;
      background: linear-gradient(270deg, #877BFF 0%, #7EB6FF 100%);
    }
  }
  .card-box > div:nth-child(6) {
    margin-top: 36px;
    display: flex;
    .card-left {
      width: 104px;
      height: 104px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      padding: 16px 15px 24px 15px;
      > img {
        width: 70px;
        height: 40px;
      }
      > div {
        margin-top: 2px;
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        text-align: center;
      }
    }
    .card-right {
      margin-left: 50px;
      width: 104px;
      height: 104px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      padding: 16px 15px 24px 15px;
      > img {
        width: 70px;
        height: 40px;
      }
      > div {
        margin-top: 2px;
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        text-align: center;
      }
    }
  }
  .card-box > div:nth-child(1) {
    display: flex;
    padding-top: 24px;
    line-height: 22px;
  }
  .first-step,
  .id-information {
    .remind {
      height: 40px;
      background: #fff1f0;
      border-radius: 2px;
      border: 1px solid #ffa39e;
      line-height: 40px;
      padding-left: 15px;
      font-size: 14px;
      color: #fe3f39;
      > img {
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-right: 12px;
      }
    }
  }
  .verified-title {
    font-size: 24px;
    font-weight: 500;
    color: #333333;
    line-height: 33px;
    margin-bottom: 20px;
  }
  .certification-information {
    margin-top: 26px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
  }
  .verified-content {
    margin-top: 23px;
    height: 210px;
    background: #fafafb;
    border: 1px solid #ededff;
    padding-top: 29px;
    padding-left: 40px;
    .information {
      display: flex;
      justify-content: space-between;
      .information-title {
        font-weight: 400;
        color: #888888;
        line-height: 20px;
        font-size: 14px;
      }
      .information-con {
        margin-top: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 20px;
        font-size: 14px;
      }
    }
    .information > div:nth-child(1) {
      width: 300px;
    }
    .information > div:nth-child(2) {
      flex: 1;
      margin-left: 100px;
    }
  }
  .verified-content > div:nth-child(2) {
    margin-top: 34px;
  }
}
.uploadBox{
  position:  relative;
  width: 104px;
  height: 104px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin-top: 36px;
  overflow: hidden;
  cursor: pointer;
  >div:nth-child(1){
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 12px;
    align-items: center;
    img{
      width: 70px;
      height: 40px;
    }
    div{
      text-align: center;
      width: 100%;
      color: rgba(0, 0, 0, 0.65);
      margin-top: 6px;
      font-size: 14px;
    }
    
  }
  >.upload{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 11;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
  >img{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
}
</style>
