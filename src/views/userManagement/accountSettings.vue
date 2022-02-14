<template>
  <div class="accountSettings-box">
    <div class="verified-title" style="font-weight: bold;">账户设置</div>
    <div class="account-content">
      <div class="title">个人信息</div>
      <div class="profilepicture">
        <div style="position:relative;z-index: 100;opacity:0">
          <ImgUpload accept="image/png,image/jpg,image/jpeg" v-model:fileList="fileList"></ImgUpload>
        </div>
        <img :src="getUrl(fileList)" />
        <!-- <el-image  :src="getUrl(fileList)" fit="cover" class="music-picture"></el-image> -->
        <!-- <img :src="getUrl(fileList)" v-if="fileList"> -->
        <div class="upload-text">更换头像</div>
      </div>
      <div class="form-box">
        <el-form
          ref="form"
          :model="info"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="昵称">
            <el-input size="small" maxlength="10" style="width:300px"  placeholder="请输入昵称" v-model="info.NickName"></el-input>
          </el-form-item>
          <el-form-item label="贝多ID">
            <span>{{info.Id}}</span>
          </el-form-item>
          <el-form-item label="性别">
            <el-select size="small"  v-model="info.Sex" placeholder="请选择性别">
              <el-option label="保密" :value="-1"></el-option>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              size="small"
              type="date"
              v-model="info.birthday"
              placeholder="选择生日"
              style="width:300px"
              class="time-picker"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="所在地">
            <el-popover
              placement="bottom-start"
              title="请选择省份"
              :width="402"
              trigger="hover"
              >
              <div class="address-list">
                <div v-for="(item, index) in addressList" :key="index" :class="info.province == item ? 'active' : ''" @click="changeAddress(item)">{{item}}</div>
                
              </div>
              <template #reference>
                <div class="select-address">
                  <span v-if="!info.province">请选择所在地</span>
                  <span v-else>{{info.province}}</span>
                  <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0z"></path></svg></div>
                </div>
              </template>
          </el-popover>
            
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input size="small" resize="none" maxlength="300" v-model="info.Introduction" type="textarea" placeholder="请输入个人简介"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="seting">
        <div>安全设置</div>
      </div>
      <div class="phone">
        <div>绑定手机</div>
        <div>{{info.Phone}}</div>
        <div @click="changeAccessShow">更换手机</div>
      </div>
      <div class="socialcontact">关联社交账号</div>
      <div class="socil-title">
        您可以填写您的社交媒体账号，以便其他用户可以见到您
      </div>
      <div class="link-list">
        <div>
          <img class="link-img" src="../../assets/images/douyin.png" />
          <el-input size="small" maxlength="100" v-model="info.DouyinUrl" placeholder="输入抖音个人主页分享链接" />
        </div>
        <div>
          <img class="link-img" src="../../assets/images/kuaishou.png" />
          <el-input size="small" maxlength="100" v-model="info.KuaishouUrl" placeholder="输入快手个人主页分享链接" />
        </div>
        <div>
          <img class="link-img" src="../../assets/images/weibo.png" />
          <el-input size="small" maxlength="100" v-model="info.WeiboUrl" placeholder="输入微博个人主页分享链接" />
        </div>
      </div>
      <div class="link-list">
        <div>
          <img class="link-img" src="../../assets/images/wymusic.png" />
          <el-input size="small" maxlength="100" v-model="info.WangyiyunUrl" placeholder="输入网易云个人主页分享链接" />
        </div>
        <div>
          <img class="link-img" src="../../assets/images/qqmusic.png" />
          <el-input size="small" maxlength="100" v-model="info.QQyinyueUrl" placeholder="输入QQ音乐个人主页分享链接" />
        </div>
        <div>
          <img class="link-img" src="../../assets/images/kugou.png" />
          <el-input size="small" maxlength="100" v-model="info.KugouUrl" placeholder="输入酷狗个人主页分享链接" />
        </div>
      </div>
      <div class="save">
        <el-button type="primary" class="submit" @click="save">保存</el-button>
      </div>
    </div>
    <el-dialog v-model="accessShow" title="手机号修改" width="470px">
      <div class="assess-dialog" v-if="step == 1">
        <div class="set-phone">
          <div>原手机号</div>
          <div>{{info.Phone}}</div>
          <el-popover
            placement="top-start"
            :width="200"
            trigger="hover"
            content="this is content, this is content, this is content"
          >
            <template #reference>
              <div class="chart">无法接收通知？</div>
            </template>
            <div class="pop">
              <div>客服电话</div>
              <div>400-0000-0000</div>
              <div>联系客服</div>
            </div>
          </el-popover>
          
        </div>
        <div class="phone-code">
          <div>*</div>
          <div>手机验证码</div>
          <el-input size="small" maxlength="6" style="width: 140px;margin-left: 16px;" v-model="msg" placeholder="请输入短信验证码" />
          <button :disabled='isSend' @click="send">{{isSend ? `${codeCount}秒后重新发送` : '发送验证码'}}</button>
        </div>
        <div class="line"></div>
        <div class="next-btn">
          <button @click="changeStep(2)" :class="msg ? 'active' : ''">下一步</button>
        </div>
      </div>
      <div class="assess-dialog" v-if="step == 2">
        <div class="phone-code">
          <div style="opacity: 0;">*</div>
          <div>手机号</div>
          <el-input size="small" maxlength="11" v-model="newphone" style="margin-left: 42px;width:300px" placeholder="请填写手机号码" />
        </div>
        <div class="phone-code">
          <div>*</div>
          <div>手机验证码</div>
          <el-input size="small" maxlength="6" style="width: 130px;margin-left: 14px;" v-model="remsg" placeholder="请输入短信验证码" />
          <button @click="resend">{{isSend2 ? `${codeCount2}秒后重新发送` : '发送验证码'}}</button>
        </div>
        <div class="line"></div>
        <div class="next-btn">
          <button @click="changeStep(3)" :class="remsg && newphone ? 'active' : ''">确定</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { ElAvatar, ElMessage } from "element-plus";
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { getUserBasic, updateUser, updateUserPhone, checkPhone } from "@/api/apiManagement/userManagement";
import ImgUpload from '@/components/publication/upload/index.vue'
import { getPhoneCode } from "@/api/apiManagement/login";
import { dateFormat, getUrl, isLink } from "@/utils/filter";
import { useStore } from "vuex";
export default defineComponent({
  name: "accountSettings",
  components: {
    ElAvatar,
    ImgUpload
  },
  setup() {
    var state = reactive({
      info: {
        HeadShotPath: '',
        NickName: '',
        Introduction: '',
        Id: '',
        Sex: -1,
        Phone: '',
        DouyinUrl: '',
        KuaishouUrl: '',
        KugouUrl: '',
        QQyinyueUrl: '',
        WangyiyunUrl: '',
        WeiboUrl: '',
        province: '',
        birthday: '',
      },
      fileList: '',
      isSend: false,
      codeCount: 60,
      isSend2: false,
      codeCount2: 60,
      accessShow: false,
      newphone: '',
      remsg: '',
      msg: '',
      step: 1,
      store: useStore(),
      addressList: ['北京市', '天津市', '河北市', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省',
      '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省',
      '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区']
    });
    onMounted(() => {
      getUserInfo();
    })
    function changeAccessShow() {
      state.step = 1;
      state.accessShow = true;
    }
    function changeAddress(address: string) {
      state.info.province = address;
    }
    function getUserInfo() {
      console.log(state.store.state.login.userInfo.UserId)
      getUserBasic({userId: state.store.state.login.userInfo.UserId}).then((res) => {
        state.info = res.data;
        state.fileList = res.data.HeadShotPath;
      })
    }
    function save() {
      if (state.info.DouyinUrl && !isLink(state.info.DouyinUrl)) return ElMessage.error('请输入正确的抖音链接');
      if (state.info.KuaishouUrl && !isLink(state.info.KuaishouUrl)) return ElMessage.error('请输入正确的快手链接');
      if (state.info.WeiboUrl && !isLink(state.info.WeiboUrl)) return ElMessage.error('请输入正确的微博链接');
      if (state.info.WangyiyunUrl && !isLink(state.info.WangyiyunUrl)) return ElMessage.error('请输入正确的网易链接');
      if (state.info.QQyinyueUrl && !isLink(state.info.QQyinyueUrl)) return ElMessage.error('请输入正确的qq音乐链接');
      if (state.info.KugouUrl && !isLink(state.info.KugouUrl)) return ElMessage.error('请输入正确的酷狗链接');
      updateUser({
        Id: state.info.Id,
        KuaishouUrl: state.info.KuaishouUrl,
        HeadShotPath: state.fileList,
        Introduction: state.info.Introduction,
        KugouUrl: state.info.KugouUrl,
        NickName: state.info.NickName,
        QQyinyueUrl: state.info.QQyinyueUrl,
        Sex: state.info.Sex,
        WangyiyunUrl: state.info.WangyiyunUrl,
        WeiboUrl: state.info.WeiboUrl,
        DouyinUrl: state.info.DouyinUrl,
        birthday: dateFormat(new Date(state.info.birthday).getTime(), 'yyyy-MM-dd'),
        province: state.info.province
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('操作成功')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const changeStep = (num: number): void => {
      if (num == 2 && !state.msg) return;
      if (num == 2) {
        checkPhone({
          captcha: state.msg
        }).then((res: any) => {
          if (res.code == 0) {
            state.step = num;
          } else {
            ElMessage.error(res.msg)
          }
        })
        
      }
      if (num == 3) {
        if (!state.remsg || !state.newphone) return;
        updateUserPhone({
          NewPhone: state.newphone,
          OldPhone: state.info.Phone,
          Captcha: state.msg,
          NewCaptcha: state.remsg
        }).then((res: any) => {
          if (res.code == 0) {
            ElMessage.success('修改成功');
            getUserInfo();
            state.accessShow = false;
          } else {
            ElMessage.error(res.msg);
          }
        })
      }
    }
    function send() {
      if (state.isSend) return;
      state.isSend = true;
      getPhoneCode({
        Phone: state.info.Phone,
        Type: 3
      }).then((res: any) => {
        if (res.code == 0) {
          const timer = setInterval(() => {
              state.codeCount --;
              if (state.codeCount === 0) {
              state.codeCount = 60;
              state.isSend = false;
              clearInterval(timer);
              }
          }, 1000)
        } else {
          state.isSend = false;
          ElMessage.error(res.msg);
        }
        
      })
          
    }
    function resend() {
      if (state.isSend2) return;
      state.isSend2 = true;
      getPhoneCode({
        Phone: state.newphone,
        Type: 3
      }).then((res: any) => {
        if (res.code == 0) {
          const timer = setInterval(() => {
              state.codeCount2 --;
              if (state.codeCount2 === 0) {
              state.codeCount2 = 60;
              state.isSend2 = false;
              clearInterval(timer);
              }
          }, 1000)
        } else {
          state.isSend2 = false;
          ElMessage.error(res.msg);
        }
        
      })
          
    }
    return {
      ...toRefs(state),
      changeAccessShow,
      getUserInfo,
      save,
      send,
      changeStep,
      changeAddress,
      getUrl,
      resend
    };
  },
});
</script>
<style lang="scss">

.accountSettings-box {
  .el-upload{
    height: 100px;
  }
  .el-upload__input{
    height: 100px;
  }
  // .el-dialog__body {
  //   padding: 22px 21px 12px 19px;
  // }
  // .el-dialog__header {
  //   border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  // }
  // .el-input {
  //   width: 320px !important;
  // }
  // .el-input--prefix {
  //   height: 32px !important;
  // }
  // .el-input__inner {
  //   height: 32px !important;
  //   line-height: 32px;
  // }
  // .el-input__icon {
  //   display: flex;
  //   align-items: center;
  //   height: 100%;
    
  // }
}
</style>
<style lang="scss" scoped>
.pop{
    text-align: center;
    .div:nth-child(1){
      text-align: center;
      font-size: 12px;
      color: #888;

    }
    >div:nth-child(2){
      height: 22px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      color: #333333;
      line-height: 22px;
      font-weight: bold;
      margin-top: 4px;
    }
    div:nth-child(3){
      width: 146px;
      height: 26px;
      background: #000000;
      border-radius: 2px;
      line-height: 26px;
      color: #fff;
      font-size: 12px;
      margin: 12px auto 0;
      cursor: pointer;
    }
}
.address-list{
  display: flex;
  flex-wrap: wrap;
  width: 380px;
  div{
    width: 120px;
    height: 26px;
    background: #F5F5F5;
    border-radius: 2px;
    line-height: 26px;
    text-align: center;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
  }
  div.active{
    color: #fff;
    background: #000000;
  }
  div:nth-child(3n){
    margin-right: 0;
    
  }
}
.select-address{
  width: 300px !important;
  border-radius: var(--el-input-border-radius,var(--el-border-radius-base));
  border: var(--el-input-border,var(--el-border-base));
  height: 32px !important;
  line-height: 32px;
  color: var(--el-input-font-color,var(--el-text-color-regular));
  display: inline-block;
  font-size: inherit;
  padding: 0 15px;
  cursor: pointer;
  position: relative;
  div{
    position: absolute;
    right: 3px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    width: 14px;
    color: var(--el-select-input-color);
    transform: rotate(180deg);
    svg{
      color: var(--el-select-input-color);
      opacity: 0.6;
    }
  }
}
.accountSettings-box {
  padding: 30px 40px 30px 35px;
  .assess-dialog {
    padding-top: 30px;
    .next-btn {
      display: flex;
      justify-content: right;
      margin-top:12px;
      > button {
        width: 85px;
        height: 32px;
        background: #f5f5f5;
        font-weight: 400;
        color: #cccccc;
        line-height: 22px;
        font-size:14px;
        border:none;
      }
      > button.active{
        color: #fff;
        background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      }
    }
    .line {
      width: 470px;
      height: 1px;
      background: rgba(0, 0, 0, 0.09);
      margin-top: 40px;
    }
    .phone-code {
      margin-top: 24px;
      display: flex;
      line-height:32px;
      > input {
        width: 200px;
        height: 32px;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #eeeeee;
        margin-left: 15px;
        padding-left: 14px;
      }
      > button {
        margin-left: 20px;
        width: 110px;
        height: 32px;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #eeeeee;
        cursor: pointer;
      }
    }
    .phone-code > div:nth-child(1) {
      color: #ff3333;
    }
    .phone-code > div:nth-child(2) {
      margin-left: 2px;
      font-weight: 500;
      color: #999999;
      line-height: 32px;
      font-size: 14px;
    }

    .set-phone {
      display: flex;
      height: 22px;
      line-height: 22px;
    }
    .set-phone > div:nth-child(1) {
      font-weight: 500;
      color: #999999;
      font-size: 14px;
    }
    .set-phone > div:nth-child(2) {
      font-weight: 600;
      color: #333333;
      margin: 0 12px 0 34px;
      font-size: 16px;
    }
    .set-phone > .chart{
      color: #7EB6FF;
      cursor: pointer;
      
    }
  }
  
  .seting {
    margin-top: 40px;
    display: flex;
  }
  .save {
    margin-top: 80px;
    margin-bottom: 170px;
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
      // opacity: 0.6;
    }
  }
  .socialcontact {
    margin-top: 40px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
  }
  .link-list {
    display: flex;
    margin-top: 36px;
    height: 32px;
    > div {
      height: 32px;
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .link-img {
        width: 26px;
        height: 26px;
      }
      .el-input {
        width: 240px !important;
        //   height:32px;
        margin-left: 18px;
        padding-left: 14px;
      }
    }
  }
  .link-list > div:nth-child(2) {
    margin: 0 30px;
  }
  .socil-title {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    margin-top: 8px;
  }
  .seting > div:nth-child(1) {
    width: 100px;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
    font-size: 16px;
  }
  .seting > div:nth-child(2) {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }
  .phone {
    display: flex;
    margin-top: 40px;
  }
  .phone > div:nth-child(1) {
    width: 100px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
  .phone > div:nth-child(2) {
    padding: 0 50px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
  }
  .phone > div:nth-child(3) {
    font-size: 14px;
    font-weight: 500;
    color: #63a5ff;
    line-height: 20px;
    cursor: pointer;
  }
  .verified-title {
    font-size: 24px;
    font-weight: 500;
    color: #333333;
    line-height: 33px;
    margin-bottom: 20px;
  }
  .form-box {
    margin-top: 34px;
    text-align: left;
  }
  .account-content {
    padding-top: 35px;
    .title {
      height: 22px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
    .profilepicture {
      margin-top: 40px;
      width: 68px;
      height: 67px;
      border: 1px solid #ddd;
      position: relative;
      overflow: hidden;
      border-radius: 50%;
      .upload-text{
        height: 23px;
        line-height: 23px;
        text-align: center;
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: 10px;
        width: 100%;
        color: #fff;
        background: #000000;
        z-index: 11;
        cursor: pointer;
        
      }
      img{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 10;
      }
      .music-picture{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 10;
      }
    }
  }
}
</style>
