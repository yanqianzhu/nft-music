<template>
  <div class="comments-box">
    <h3>评论列表</h3>
    <div class="comments-input flex-middle-between">
      <el-avatar
        :size="40"
        :src="isLogin ? getUrl(userInfo.HeadShotPath) : defaultAvatar"
        class="avatar"
      ></el-avatar>
      <div class="input-box" v-if="isLogin">
        <el-input v-model="message" placeholder="有爱评论，说点儿好听的" class="user-avatar" />
        <div class="input-emoji flex-middle-between">
          <el-popover placement="bottom-start" :width="400" trigger="click">
            <template #reference>
              <i class="iconfont icon-biaoqing" slot="reference" title="发表情"></i>
            </template>
            表情包功能待开发
            <!-- <div class="emojis">
              <div
                v-for="item in emojiName"
                class="emoji"
                :key="item"
                @click="chooseEmoji(item, 0)"
              >
                <img :src="emojiUrl + emojiMap[item]" style="width: 30px; height: 30px" />
              </div>
            </div> -->
          </el-popover>
          <el-button type="primary" @click="createComment" :disabled="!isLogin">发送</el-button>
        </div>
      </div>
      <div v-else class="no-login-box">
        请先
        <span @click="toLogin">登录</span>后发表评论
      </div>
    </div>
  </div>
  <div class="comments-itme-box">
    <commentItemVue v-for="item in commentList" :key="item.Id" :itemInfo="item"></commentItemVue>
  </div>
</template>
<script lang="ts">
import { createCommentApi, getCommentListApi, getReplyListApi } from "@/api/apiManagement/audio";
import { getUrl } from "@/utils/filter";
import { defineComponent, computed, reactive, toRefs, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { emojiMap, emojiName, emojiUrl } from "@/utils/emojiMap";
import { ElMessage } from "element-plus";
//@ts-ignore
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import commentItemVue from "@/components/comment/commentItem.vue";

export default defineComponent({
  name: "commentsVue",
  components: {
    commentItemVue,
  },
  setup() {
    const data = reactive({
      message: "",
      route: useRoute(),
      store: useStore(),
      pageSize: {
        Page: 1,
        Size: 10,
      },
      commentList: [],
      musicInfo: inject("musicInfo"),
      replyPageSize: {
        Page: 1,
        Size: 10,
      },
      replyList: [],
    });
    // computed
    const userInfo = computed(() => {
      return data.store.getters.userInfo;
    });
    const isLogin = computed(() => {
      return data.store.getters.isLogin;
    });
    //=-=========methods
    function createComment() {
      createCommentApi({
        MusicId: Number(data.route.params.Id),
        Comment: data.message,
      }).then((res: any) => {
        if (res.code == 0) {
          data.message = "";
          ElMessage.success("已发布");
          data.commentList.unshift(res.data);
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
    function toLogin() {
      data.store.commit("setLoginShow");
    }
    // 获取二级评论
    function getMoreReply(item: any) {
      getReplyListApi({
        ReplyId: item.Id,
        ...data.replyPageSize,
      }).then((res: any) => {
        if (res.code == 0) {
          item.replyList = res.data.list;
          item.replyListShow = true;
          item.replyList.forEach((i: any) => {
            i.ReplyMessage = "";
            i.replyShow = false;
            i.replyListShow = false;
          });
        }
      });
    }
    function getCommentList() {
      getCommentListApi({
        MusicId: data.route.params.Id,
        ...data.pageSize,
      }).then((res: any) => {
        if (res.code == 0) {
          data.commentList = res.data.list || [];
        }
      });
    }
    /**
     * @description 发送回复
     * TODO 可以和发送评论合并
     * @param item
     */
    function sendReply(item: any) {
      createCommentApi({
        MusicId: Number(data.route.params.Id),
        Comment: item.ReplyMessage,
        ReplyId: item.Id,
      }).then((res: any) => {
        if (res.code == 0) {
          item.ReplyMessage = "";
          item.replyShow = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    }

    getCommentList();
    return {
      ...toRefs(data),
      createComment,
      getUrl,
      userInfo,
      isLogin,
      emojiMap,
      emojiName,
      emojiUrl,
      toLogin,
      defaultAvatar,
      sendReply,
      getMoreReply,
    };
  },
});
</script>
<style lang="scss" scoped>
.comments-box {
  margin-top: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(235, 235, 255, 1);
  .comments-input {
    align-items: flex-start;
    margin-top: 20px;
    .avatar {
      flex-shrink: 0;
      margin-right: 15px;
    }
    .input-box {
      padding-left: 10px;
      flex-grow: 1;
      padding-top: 4px;
      .user-avatar {
        flex-shrink: 0;
      }
      .input-emoji {
        margin-top: 6px;
        .comment-send {
          width: 50px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          background: #eae6e6;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 400;
          color: #a5a0a1;
        }
      }
    }
    .no-login-box {
      height: 46px;
      background: #ecf0f7;
      border-radius: 2px;
      flex-grow: 1;
      text-align: center;
      line-height: 46px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      span {
        padding: 0px 3px;
        color: RGBA(130, 183, 254, 1);
        cursor: pointer;
      }
    }
  }
}
.comments-itme-box {
  margin-bottom: 50px;
  .time {
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    margin-left: 5px;
  }
}
</style>
<style lang="scss">
.comments-input {
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
.emojis {
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
}
</style>
