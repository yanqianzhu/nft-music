<template>
  <div class="message-container" :class="{ flex: openChat }">
    <div :class="{ 'message-left': openChat }">
      <h2 class="message-title">私信列表</h2>
      <div class="message-box" v-loading="loading">
        <div class="message-item" v-for="item in ConversationList" :key="item.conversationID" @click="showChat(item)">
          <el-avatar :size="48" :src="item.userProfile.avatar || circleUrl" class="item-avatar"></el-avatar>
          <div class="item-content">
            <p class="item-username">
              {{ item.userProfile.nick || item.userProfile.userID }}
            </p>
            <p class="item-message">{{ item.lastMessage.messageForShow }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="message-right" v-if="openChat" v-loading="chatLoading">
      <div class="message-title">
        <div>
          <span class="username">音乐制作人</span>
          <span class="seeUserPage">
            查看Ta的主页
            <i class="iconfont icon-erweima"></i>
          </span>
        </div>
        <i class="iconfont icon-gengduo"></i>
      </div>
      <div class="record-box">
        <!-- <div v-for="item in 100">123123123123</div> -->
        <messageItemVue v-for="item in messageList.messageList" :message="item"></messageItemVue>
      </div>
      <div class="bottom" :class="{ active: focus }">
        <textarea
          ref="text-input"
          rows="4"
          resize="false"
          v-model="messageContent"
          class="text-input"
          @focus="focus = true"
          @blur="focus = false"
          @keydown.enter.exact.prevent="sendTextMessage"
          @keyup.ctrl.enter.prevent.exact="handleLine"
          placeholder="发送消息..."
        ></textarea>
        <div class="send-box">
          <el-popover placement="top" :width="400" trigger="click">
            <template #reference>
              <i class="iconfont icon-biaoqing" slot="reference" title="发表情"></i>
            </template>
            <div class="emojis">
              <div v-for="item in emojiName" class="emoji" :key="item" @click="chooseEmoji(item)">
                <img :src="emojiUrl + emojiMap[item]" style="width: 30px; height: 30px" />
              </div>
            </div>
          </el-popover>
          <el-tooltip class="item" content="按Enter发送消息，Ctrl+Enter换行" placement="left-start">
            <div class="btn-send" style="--el-loading-spinner-size: 21px" @click="sendTextMessage" v-loading="sendLoading">发送</div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, toRaw, reactive, toRefs, onMounted } from "vue";
import TIM from "tim-js-sdk";
import { login, logout, getConversationList, getMessageList } from "@/utils/tim";
import { ElAvatar, ElTooltip, ElPopover } from "element-plus";
import { emojiMap, emojiName, emojiUrl } from "@/utils/emojiMap";
import messageItemVue from "@/components/userManagement/messageItem.vue";
export default defineComponent({
  name: "PrivateMessage",
  components: { ElAvatar, ElTooltip, ElPopover, messageItemVue },
  setup() {
    const data = reactive({
      loading: false,
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      ConversationList: [],
      focus: false,
      messageContent: "",
      sendLoading: false,
      openChat: false,
      chatLoading: false,
      messageList: [],
    });
    //--------------------------------
    function ConversationListMethod() {
      getConversationList().then((res: any) => {
        data.ConversationList = res.data.conversationList;
        data.loading = false;
        console.log(toRaw(data.ConversationList));
      });
    }
    let options = {
      SDKAppID: 1400607499,
    };
    let tim = TIM.create(options);
    function init() {
      login("user0");
      let onSdkReady = async () => {
        console.log("sdk ready");
        ConversationListMethod();
      };
      tim.on(TIM.EVENT.SDK_READY, onSdkReady);
    }
    init();
    //---------------------------------- 回调监听
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, ConversationListMethod);
    //------------------------
    onBeforeUnmount(() => {
      logout();
    });
    //-------------------
    const handleLine = () => {
      data.messageContent += "\n";
    };
    const sendTextMessage = () => {
      if (data.messageContent === "" || data.messageContent.trim().length === 0) {
        data.messageContent = "";
        // this.$store.commit('showMessage', {
        //   message: '不能发送空消息哦！',
        //   type: 'info'
        // })
        return;
      }
      data.sendLoading = true;
      const message = tim.createTextMessage({
        to: "user1",
        conversationType: "C2C",
        payload: { text: data.messageContent },
      });
      //   this.$store.commit("pushCurrentMessageList", message);
      //   this.$bus.$emit("scroll-bottom");
      // tim.sendMessage(message).catch((error) => {
      //   this.$store.commit("showMessage", {
      //     type: "error",
      //     message: error.message,
      //   });
      // });
      tim
        .sendMessage(message)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
      data.messageContent = "";
      data.sendLoading = false;
    };
    const chooseEmoji = (item: object) => {
      data.messageContent += item;
    };
    const showChat = (item: object) => {
      data.openChat = true;
      data.chatLoading = true;
      getMessageList(item.conversationID).then((res) => {
        data.messageList = res.data;
        data.chatLoading = false;
        console.log("getMessageList", res);
      });
    };
    return {
      ...toRefs(data),
      chooseEmoji,
      focus,
      handleLine,
      sendTextMessage,
      emojiMap,
      emojiName,
      emojiUrl,
      showChat,
    };
  },
});
</script>
<style lang="scss" scoped>
.message-container {
  height: calc(100vh - 82px);
  // overflow-y: hidden;
  .message-left {
    width: 338px;
    flex-shrink: 0;
  }
  .message-title {
    height: 90px;
    line-height: 90px;
    padding-left: 35px;
    border-bottom: 1px solid #eeeeee;
  }
  .message-box {
    height: calc(100vh - 172px);
    overflow-y: scroll;
    padding: 0px 35px;
    .message-item {
      padding: 25px 20px;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      .item-avatar {
        flex-shrink: 0;
        margin-right: 12px;
      }
      .item-content {
        flex-grow: 1;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        color: #333333;
        flex-direction: column;
        cursor: pointer;
        .item-username,
        .item-message {
          padding-top: 4px;
        }
        .item-message {
          font-weight: 400;
          color: #888888;
        }
      }
    }
  }
  .message-right {
    flex-grow: 1;
    border-left: 1px solid #eeeeee;
    display: flex;
    flex-direction: column;
    .message-title {
      padding-left: 0px;
      display: flex;
      justify-content: space-between;
      padding: 0px 30px;
      align-items: center;
      .username {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
      .seeUserPage {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        cursor: pointer;
        .icon-erweima {
          font-size: 10px;
        }
      }
      .icon-gengduo {
        cursor: pointer;
      }
    }
    .record-box {
      flex-grow: 1;
      border-bottom: 1px solid #eeeeee;
    }
    .bottom {
      flex-shrink: 0;
      position: relative;
      padding: 10px 30px 20px 30px;
      .text-input {
        font-size: 16px;
        width: 100%;
        box-sizing: box-sizing;
        border: none;
        outline: none;
        background-color: transparent;
        resize: none;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      }
      .send-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon-biaoqing {
          cursor: pointer;
        }
        .btn-send {
          cursor: pointer;
          font-size: 12px;
          width: 50px;
          padding: 5px 0px;
          text-align: center;
          user-select: none;
          background: #f5f4f4;
          border-radius: 2px;
          &:hover {
            background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.emojis {
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
}
</style>
