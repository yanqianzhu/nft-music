<template>
  <div class="login-modal" v-if="loginStatus">
    <div class="login-box" :class="{ register: isLogin }">
      <i class="iconfont icon-shanchu" @click="closeLoginModel"> </i>
      <img :src="loginBg" class="music-logo" />
      <div class="login-info-box">
        <h1 class="title">欢迎使用贝多音乐</h1>
        <div class="login-info" v-if="isLogin" :class="{ register: isLogin }">
          <p class="login-type">
            <span :class="{ active: !type }" @click="type = false"> 短信验证码登陆</span>
            <span :class="{ active: type }" @click="type = true">密码登陆</span>
          </p>
          <el-form ref="loginForm" :rules="rulus" :model="loginData" class="login-input-box">
            <el-form-item prop="tel">
              <el-input v-model="loginData.tel" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="passWord" v-if="type">
              <el-input
                v-model="loginData.passWord"
                type="password"
                placeholder="请输入8-20位密码"
                v-if="type"
              />
            </el-form-item>
            <el-form-item prop="smsCode" v-else>
              <el-input
                v-model="loginData.smsCode"
                placeholder="请输入手机验证码"
                class="smscode-box"
              >
                <template #append>
                  <div class="sendSms" @click="sendSmsCode('loginForm')">
                    {{ showCode ? `${countdown}s后重新发送` : "发送验证码" }}
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <p class="login-btn" @click="sendLogin">登陆</p>
          <p class="login-tips">
            还没有贝多账号？
            <span class="red" @click="isLogin = false">立即注册</span>
          </p>
        </div>
        <div class="register-box" v-else>
          <el-form ref="registorForm" :rules="rulus" :model="registerData" class="login-input-box">
            <el-form-item prop="tel">
              <el-input v-model="registerData.tel" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input v-model="registerData.passWord" placeholder="请输入8-20位密码" />
            </el-form-item>
            <el-form-item prop="smsCode">
              <el-input
                v-model="registerData.smsCode"
                placeholder="请输入手机验证码"
                class="smscode-box"
              >
                <template #append>
                  <div class="sendSms" @click="sendSmsCode('registorForm')">
                    {{ showCode ? `${countdown}s后重新发送` : "发送验证码" }}
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="checkbox" prop="pact">
              <div class="checkbox-box">
                <el-checkbox v-model="registerData.surePact" true-label="1" false-label="0">
                </el-checkbox>
                <div class="checkbox-label">
                  本人确认已仔细阅读并充分理解
                  <span class="red">
                    <router-link :to="{ name: 'userAgreement' }"
                      >《音乐贝多用户协议》
                    </router-link></span
                  >
                  与
                  <span class="red">
                    <router-link :to="{ name: 'privacyPolicy' }">《音乐贝多隐私政策》</router-link>
                  </span>
                  的全部内容，同意接受上述协议全部内容
                </div>
              </div>
            </el-form-item>
          </el-form>
          <p class="login-btn" @click="registor">注册</p>
          <p class="login-tips">
            已有贝多账号？
            <span class="red" @click="isLogin = true">立即登陆</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ElInput, ElCheckbox, ElMessage } from "element-plus";
import { defineComponent, reactive, toRefs, watch, ref, computed, onBeforeUnmount } from "vue";
//@ts-ignore
import loginBg from "@/assets/images/login-bg.png";
import { loginApi, registoreApi, getPhoneCode } from "@/api/apiManagement/login";
//@ts-ignore
import { isPhone } from "@/utils/validate.js";
import { useStore } from "vuex";
import store from "@/store";
const validateTel = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    if (!isPhone(value)) {
      callback(new Error("请输入正确的手机号"));
    }
    callback();
  }
};
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  }
  if (value.length < 6 || value.length > 20) {
    callback(new Error("请输入6-20位的密码"));
  }
  callback();
};
const validateCode = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  }
  callback();
};
export default defineComponent({
  name: "loginOrRegister",
  components: { ElInput, ElCheckbox },
  setup() {
    const validateCheckbox = (rule: any, value: any, callback: any) => {
      console.log("================", value);
      if (data.registerData.surePact !== "1") {
        callback(new Error("请勾选协议"));
      }
      callback();
    };
    const data = reactive({
      loginData: {
        tel: "",
        passWord: "",
        smsCode: "",
      }, // login data
      registerData: {
        tel: "",
        passWord: "",
        smsCode: "",
        surePact: "0",
      }, // registor data
      type: false, // 0 密码登录  1 短信验证码
      isLogin: true, // 显示登录 or 注册 true 登录 false 注册
      rulus: {
        tel: [{ validator: validateTel, trigger: "blur" }],
        passWord: [{ validator: validatePass, trigger: "blur" }],
        smsCode: [{ validator: validateCode, trigger: "blur" }],
        pact: [{ validator: validateCheckbox, trigger: "change" }],
      }, // 表单校验信息
      loginForm: ref(null),
      registorForm: ref(null),
      store: useStore(),
      showCode: false,
      countdown: 60,
    });
    data.store.dispatch("isLogin");
    const sendSmsCode = (formName: string) => {
      if (data.showCode) {
        return;
      }
      data[formName].validateField("tel", (valid: string) => {
        if (valid == "") {
          getPhoneCode({ phone: data[formName].model.tel, type: data.isLogin ? 2 : 1 })
            .then((res: any) => {
              console.log(res);
              if (res.code == 0) {
                data.showCode = true;
                const timeout = setInterval(() => {
                  data.countdown--;
                  if (data.countdown == 0) {
                    data.showCode = false;
                    data.countdown = 60;
                    clearInterval(timeout);
                  }
                }, 1000);
              } else {
                data.showCode = false;
                ElMessage.error(res.msg);
              }
            })
            .catch((e) => {
              data.showCode = false;
              ElMessage.error(e.data.msg);
            });
        }
      });
    };
    const loginStatus = computed(() => {
      return store.getters.loginShow;
    });
    const sendLogin = () => {
      data.loginForm.validate(async (valid: any) => {
        if (valid) {
          await data.store.dispatch(
            "login",
            data.type
              ? {
                  Phone: data.loginData.tel,
                  UserPassword: data.loginData.passWord,
                  Type: 1,
                }
              : { Phone: data.loginData.tel, Code: data.loginData.smsCode, Type: 2 }
          );
          // await loginApi(
          //   data.type
          //     ? {
          //         Phone: data.loginData.tel,
          //         UserPassword: data.loginData.passWord,
          //       }
          //     : { Phone: data.loginData.tel, Captcha: data.loginData.smsCode }
          // ).then((res) => {
          //   if (res.code == 0) {
          //     // data.loginStatus = false;
          //     data.store.commit("setLoginShow");
          //     ElMessage.success("登陆成功！");
          //     data.store.commit("setLoginStatus", true);
          //   } else {
          //     ElMessage.error(res.msg);
          //   }
          // });
        }
      });
    };
    const registor = () => {
      data.registorForm.validate(async (valid: any) => {
        if (valid) {
          await registoreApi({
            Code: data.registerData.smsCode,
            ConfirmUserPassword: data.registerData.passWord,
            Phone: data.registerData.tel,
            UserPassword: data.registerData.passWord,
          })
            .then(() => {
              data.isLogin = true;
              ElMessage.success("注册成功！");
            })
            .catch(() => {
              ElMessage.error("注册失败，请稍后重试！");
            });
        }
      });
    };
    const closeLoginModel = () => {
      data.store.commit("setLoginShow");
      data.isLogin = true;
    };
    //----------watch
    watch(
      () => data.type,
      () => {
        data.loginData.passWord = "";
        data.loginData.smsCode = "";
      }
    );
    watch(
      () => data.isLogin,
      () => {
        data.countdown = 60;
        data.showCode = false;
        data.loginData = { tel: "", passWord: "", smsCode: "" };
        data.registerData = { tel: "", passWord: "", smsCode: "", surePact: "0" };
      }
    );
    watch(
      () => loginStatus,
      (val, old) => {
        console.log(val, old);
      }
    );
    return {
      ...toRefs(data),
      loginBg,
      sendSmsCode,
      sendLogin,
      registor,
      loginStatus,
      closeLoginModel,
    };
  },
});
</script>
<style lang="scss" scoped>
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 101;
  justify-content: center;
  align-items: center;
  right: 0;
  bottom: 0;
  background-color: RGBA(0, 0, 0, 0.5);
  .login-box {
    position: relative;
    width: 660px;
    display: flex;
    height: auto;
    max-height: 640px;
    background-color: #fff;
    .icon-shanchu {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 16px;
      cursor: pointer;
    }
    &.register {
      max-height: 480px;
    }
    .music-logo {
      width: 12vw;
      max-width: 242px;
      flex-shrink: 0;
    }
    .login-info-box {
      padding: 30px 35px 40px 35px;
      display: flex;
      flex-direction: column;
      //   justify-content: space-between;
      flex-grow: 1;
      .title {
        font-size: 32px;
        font-weight: 600;
        color: #333333;
        line-height: 45px;
        margin-bottom: 20px;
      }
      .login-type {
        margin-bottom: 40px;
        span {
          font-size: 16px;
          font-weight: 400;
          color: #333333;
          cursor: pointer;
          &.active {
            color: rgba(97, 164, 255, 1);
          }
          &:last-child {
            padding-left: 10px;
            border-left: 1px solid rgba(216, 216, 216, 1);
          }
          &:first-child {
            padding-right: 10px;
          }
        }
      }
      .login-input-box {
        margin-bottom: 10px;
        .el-form-item {
          margin-bottom: 50px;
        }
      }
      .login-btn {
        height: 50px;
        background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
        line-height: 50px;
        text-align: center;
        margin-bottom: 20px;
        cursor: pointer;
      }
      .login-tips {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
      .red {
        color: rgba(255, 80, 72, 1);
        cursor: pointer;
      }
      .register-box {
        width: 100%;
        overflow-y: hidden;
        .el-form-item {
          margin-bottom: 30px;
        }
        .checkbox-box {
          display: flex;
          align-items: flex-start;
        }
        .checkbox-label {
          font-size: 12px;
          font-weight: 400;
          color: #999999;
          padding-left: 15px;
          position: relative;
          top: -3px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.smscode-box {
  .el-input-group__append {
    width: 120px;
    text-align: center;
  }
  .sendSms {
    cursor: pointer;
    user-select: none;
  }
}
.checkbox-box {
  .el-checkbox {
    display: flex;
    align-items: flex-start;
  }
}
.register-box {
  width: 100%;
  overflow-y: hidden;
  .el-form-item {
    margin-bottom: 30px;
    &.checkbox {
      margin-bottom: 20px !important;
      .el-checkbox {
        height: auto;
      }
      .el-form-item__content {
        line-height: normal;
      }
    }
  }
}
</style>
