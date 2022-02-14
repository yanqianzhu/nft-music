<template>
  <div class="comments-item">
    <el-avatar :size="40" :src="getUrl(item.HeadShotPath)"></el-avatar>
    <div class="comments-right">
      <p class="username">
        {{ item.NickName }}
        <span class="time">{{ dateFormat(item.CreateTime, "yyyy-MM-dd hh:mm") }}</span>
      </p>
      <p class="message-box">
        <template v-for="(item, index) in decodeText({ text: item.Comment })">
          <span :key="index" v-if="item.name === 'text'">{{ item.text }}</span>
          <img v-else-if="item.name === 'img'" :src="item.src" width="20" height="20" />
        </template>
      </p>
      <p class="count-box">
        <span @click="setLike(comment)">
          <i class="iconfont" :class="[item.IsLike == 0 ? 'icon-weidianzan' : 'icon-dianzan']"></i>
          {{ item.LikeCount }}
        </span>
        <span @click="showRepluInput">
          <i class="iconfont icon-pinglun"></i>
          {{ item.ReplyCount }}
        </span>
      </p>
      <div class="reply-input-box" v-if="comment.replyShow">
        <el-input
          v-model="extendAttr.ReplyMessage"
          :rows="2"
          type="textarea"
          :placeholder="`回复${item.NickName}`"
        />
        <div class="btn-box">
          <el-popover placement="bottom-start" :width="400" trigger="click">
            <template #reference>
              <i class="iconfont icon-biaoqing" title="发表情"></i>
            </template>
            表情包功能待开发
          </el-popover>
          <span :class="{ active: comment.ReplyMessage.length > 0 }" @click="sendReply(comment)">
            发送
          </span>
        </div>
      </div>
      <p class="user-reply" v-if="item.ReplyCount > 0">
        <span @click="getReplyList">
          展开{{ item.ReplyCount }}条回复
          <svg-icon iconClass="caret-down" className="icon-caret-down"></svg-icon>
        </span>
        <svg-icon iconClass="caret-up" className="icon-caret-up"></svg-icon>
      </p>
      <div class="reply-box" v-if="replyList.length > 0">
        <div v-for="reply in replyList" class="comments-item">
          <el-avatar :size="40" :src="getUrl(reply.HeadShotPath)"></el-avatar>
          <div class="comments-right">
            <p class="username">
              {{ reply.NickName }}
              <span class="time">{{ dateFormat(reply.CreateTime, "yyyy-MM-dd hh:mm") }}</span>
            </p>
            <p class="message-box">
              <template v-for="(item, index) in decodeText({ text: reply.Comment })">
                <span :key="index" v-if="item.name === 'text'">{{ item.text }}</span>
                <img v-else-if="item.name === 'img'" :src="item.src" width="20" height="20" />
              </template>
            </p>
            <p class="count-box">
              <span @click="setLike(reply)">
                <i
                  class="iconfont"
                  :class="[reply.IsLike == 0 ? 'icon-weidianzan' : 'icon-dianzan']"
                ></i>
                {{ reply.LikeCount }}
              </span>
              <span @click="reply.replyShow = !reply.replyShow">
                <i class="iconfont icon-pinglun"></i>
                {{ reply.ReplyCount }}
              </span>
            </p>
            <div class="reply-input-box" v-if="reply.replyShow">
              <el-input
                v-model="reply.ReplyMessage"
                :rows="2"
                type="textarea"
                :placeholder="`回复${reply.NickName}`"
              />
              <div class="btn-box">
                <el-popover placement="bottom-start" :width="400" trigger="click">
                  <template #reference>
                    <i class="iconfont icon-biaoqing" title="发表情"></i>
                  </template>
                  表情包功能待开发
                </el-popover>
                <span :class="{ active: reply.ReplyMessage.length > 0 }" @click="sendReply(reply)">
                  发送
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  createCommentApi,
  getReplyListApi,
  setMusicLikeStatusApi,
} from "@/api/apiManagement/audio";
import { decodeText } from "@/utils/decodeText";
import { dateFormat, getUrl } from "@/utils/filter";
import { ElMessage } from "element-plus";
import { defineComponent, reactive, toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "commentItem",
  props: {
    itemInfo: Object,
  },
  setup(props) {
    const data = reactive({
      store: useStore(),
      item: props.itemInfo,
      extendAttr: {
        replyShow: false,
        ReplyMessage: "",
      },
      replyList: [],
      replyPageSize: {
        Page: 1,
        Size: 3,
      },
      route: useRoute(),
    });
    const comment = computed(() => {
      return { ...data.item, ...data.extendAttr };
    });

    function getReplyList() {
      getReplyListApi({
        ReplyId: data.item.Id,
        ...data.replyPageSize,
      }).then((res: any) => {
        if (res.code == 0) {
          data.replyList = res.data.list;
          data.replyList = data.replyList.map((item) => {
            return {
              ...item,
              replyShow: false,
              ReplyMessage: "",
            };
          });
          //   data.extendAttr.replyListShow = true;
        }
      });
    }
    async function setLike(obj: any) {
      if (await data.store.dispatch("loginCheck")) {
        setMusicLikeStatusApi({
          LikeId: obj.Id,
          Opt: Number(!Boolean(obj.IsLike)),
          BizType: 2,
        }).then((res: any) => {
          if (res.code == 0) {
            obj.IsLike = Number(!Boolean(obj.IsLike));
            if (obj.IsLike == 1) {
              obj.LikeCount++;
            } else {
              obj.LikeCount--;
            }
          } else {
            ElMessage.error(res.msg);
          }
        });
      }
    }
    async function showRepluInput() {
      if (await data.store.dispatch("loginCheck")) {
        data.extendAttr.replyShow = !data.extendAttr.replyShow;
      }
    }
    function sendReply(obj: any) {
      console.log(obj);
      createCommentApi({
        MusicId: Number(data.route.params.Id),
        Comment: obj.ReplyMessage,
        FirstCommentId: comment.value.Id,
        ReplyId: obj.Id,
      }).then((res: any) => {
        if (res.code == 0) {
          data.replyList.unshift(res.data);
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
    return {
      ...toRefs(data),
      getUrl,
      decodeText,
      dateFormat,
      setLike,
      sendReply,
      comment,
      getReplyList,
      showRepluInput,
    };
  },
});
</script>
<style lang="scss" scoped>
.comments-item {
  padding: 20px 0px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  .el-avatar {
    margin-right: 10px;
    flex-shrink: 0;
  }
  .comments-right {
    flex-grow: 1;
  }
  .username {
    font-size: 12px;
    font-weight: 500;
    color: #333333;
  }
  .message-box {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .count-box {
    display: flex;
    align-items: center;
    flex-direction: row;
    span {
      display: flex;
      align-items: center;
      margin-right: 10px;
      cursor: pointer;
      .iconfont {
        margin-right: 5px;
        &.icon-dianzan {
          color: #e92b4f;
        }
      }
    }
  }
  .user-reply {
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
    .icon-caret-up {
      margin-left: 15px;
    }
    span {
      cursor: pointer;
    }
  }
  .reply-input-box {
    width: 100%;
    margin-top: 10px;
    position: relative;
    min-height: 45px;

    .btn-box {
      position: absolute;
      right: 15px;
      bottom: 10px;
      display: flex;
      align-items: center;
      span {
        width: 51px;
        height: 26px;
        background: #eeeeee;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 400;
        color: #a5a0a1;
        display: inline-block;
        text-align: center;
        line-height: 26px;
        cursor: pointer;
        margin-left: 20px;
        &.active {
          background: #000000;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
