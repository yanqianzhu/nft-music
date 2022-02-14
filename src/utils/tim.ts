import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import { genTestUserSig } from "@/utils/GenerateTestUserSig";
// import TIMUploadPlugin from 'tim-upload-plugin'; v2.9
let options = {
  SDKAppID: 1400607499,
};
let tim = TIM.create(options);
tim.setLogLevel(4);
tim.registerPlugin({ "cons-js-sdk": COS });
// tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

export default { tim };
/**
 * @description 登陆
 * @param userID  userid 唯一
 */
export function login(userID: string) {
  let promise = tim.login({ userID: userID, userSig: genTestUserSig(userID).userSig });
  promise
    .then(function (imResponse: { data: { repeatLogin: boolean; errorInfo: any } }) {
      console.log("登陆成功", imResponse.data); // 登录成功
      if (imResponse.data.repeatLogin === true) {
        // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
        console.log("标识账号已登录，本次登录操作为重复登录。", imResponse.data.errorInfo);
      }
    })
    .catch(function (imError: string) {
      console.warn("login error:", imError); // 登录失败的相关信息
    });
}
/**
 * @description 登出
 */
export function logout() {
  let promise = tim.logout();
  promise
    .then(function (imResponse: { data: any }) {
      console.log(imResponse.data); // 登出成功
    })
    .catch(function (imError: any) {
      console.warn("logout error:", imError);
    });
}
/**
 * @description 获取聊天列表
 */
export function getConversationList() {
  // 获取全量的会话列表
  //   let promise =
  return tim.getConversationList();
  //   promise
  //     .then((imResponse: { data: { conversationList: any } }) => {
  //       const conversationList = imResponse.data.conversationList; // 全量的会话列表，用该列表覆盖原有的会话列表
  //       console.log("conversationList", conversationList);
  //       return conversationList;
  //     })
  //     .catch(function (imError: any) {
  //       console.warn("getConversationList error:", imError); // 获取会话列表失败的相关信息
  //     });
}

/**
 * @description 发送消息
 */
export function createTextMessage(userId: string, msg: string) {
  // 发送文本消息，Web 端与小程序端相同
  // 1. 创建消息实例，接口返回的实例可以上屏
  let message = tim.createTextMessage({
    to: userId,
    conversationType: TIM.TYPES.CONV_C2C,
    // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
    // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
    // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
    payload: {
      text: msg,
    },
    // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
    // cloudCustomData: 'your cloud custom data'
  });
  // 2. 发送消息
  return tim.sendMessage(message);
}
/**
 * @description 将该会话 id 下的消息设为已读
 * @param conversationID
 * @returns
 */
export function setMessageRead(conversationID: string) {
  // 将某会话下所有未读消息已读上报
  return tim.setMessageRead({ conversationID: conversationID });
}
/**
 * @description 获取详细的用户资料
 *
 */
export function getConversationProfile(conversationID: string) {
  return tim.getConversationProfile(conversationID);
}
/**
 * @description 拉取聊天记录
 */
export function getMessageList(conversationID: string, count?: 15, nextReqMessageID?: string) {
  if (nextReqMessageID) {
    return tim.getMessageList({ conversationID: conversationID, nextReqMessageID, count });
  } else {
    return tim.getMessageList({ conversationID: conversationID, count });
  }
}
