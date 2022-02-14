<template>
  <div class="comments-container">
    <div class="title">评论管理</div>
    <template v-if="list.length">
      <div class="comment-list" v-for="(item,index) in list" :key="index">
        <img src="../../assets/images/bell.png" />
        <div class="comment-right">
          <div class="user-id">
            <span>{{item.byReplyUserNickname}}</span>
            <span>评论了我的{{item.commentType == 1 ? '歌曲' : '评论'}}</span>
          </div>
          <div class="comment-content">
            <template v-for="(i, idx) in decodeText({ text: item.content })">
              <span :key="idx" v-if="i.name === 'text'">{{ i.text }}</span>
              <img v-else-if="i.name === 'img'" :src="i.src" width="20" height="20" />
            </template>
          </div>
          <div class="music" v-if="item.commentType == 1">
            <div>
              <img style="width: 62px;height:62px" :src="getUrl(item.cover)" />
            </div>
            <div>{{item.musicName}} - {{item.singing}}</div>
          </div>
          <div class="my-comment" v-if="item.myCommentContent">
            <span>我的评论</span>
            <div>{{item.myCommentContent}}</div>
          </div>
          <div class="comment-action">
            <span>{{dateFormat(item.createTime, 'yy-MM-dd hh:mm')}}</span>
            <div>
              <div @click="item.check = !item.check">
                <img src="../../assets/images/tip.png" />
                <span v-if="!item.check">回复</span>
                <span v-if="item.check">取消回复</span>
              </div>
              <div>
                <img src="../../assets/images/love.png" />
                <span>点赞</span>
              </div>
            </div>
          </div>
          <div class="text" v-if="item.check">
            <el-input
              v-model="item.msg"
              :rows="3"
              type="textarea"
              resize="none"
              placeholder=""
            />
            <div class="btn" :class="item.msg ? 'active' : ''" @click.stop="send(item)">发送</div>
          </div>
        </div>
      </div>
      <superPaginationVue
          v-model:currentPage="page.current"
          v-model:pageSize="page.pageSize"
          :total="page.total"
      ></superPaginationVue>
    </template>
    <nodata v-else />
  </div>
</template>

<script lang="ts">
import { Search } from "@element-plus/icons";
import { ElImage, ElAvatar, ElDrawer } from "element-plus";
import { defineComponent, ref, reactive, toRefs, onMounted, watch} from "vue";
import { commentFeedback, interactComment } from "@/api/apiManagement/userManagement";
import { getUrl, dateFormat } from "@/utils/filter";
import { decodeText } from "@/utils/decodeText";
import superPaginationVue from "@/components/public/superPagination.vue";
import nodata from "@/components/userManagement/nodata.vue";
import {
  createCommentApi,
} from "@/api/apiManagement/audio";
export default defineComponent({
  name: "comments",
  components: {
    Search,
    ElImage,
    ElAvatar,
    ElDrawer,
    nodata,
    superPaginationVue
  },
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const state = reactive({
      list: [],
      decodeText,
      dateFormat,
      getUrl,
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    })
    onMounted(() => {
      getData();
    })
    function getData() {
      commentFeedback({
        page: state.page.current,
        size: state.page.pageSize
      }).then((res) => {
        state.list = res.data.items || [];
        state.page.total = res.data.total;
      })
    }
   watch(() => [state.page.pageSize], () => {
      if (state.page.current == 1) {
        getData();
      } else {
        state.page.current = 1;
      }
    })
    watch(() => state.page.current, () => {
      getData();
    })
    const send = (item: any) => {
      if (!item.msg) return;
      createCommentApi({
        MusicId: item.musicId,
        Comment: item.msg,
        FirstCommentId: item.commentId,
        ReplyId: 0,
      }).then((res: any) => {
        if (res.code == 0) {
        } else {
        }
      });
    }
    return { ...toRefs(state), send };
  },
});
</script>

<style lang="scss" scoped>
.comments-container {
  padding: 30px 40px 30px 35px;
  .text{
    margin-top: 12px;
    position: relative;
    >.btn{
      position: absolute;
      width: 51px;
      height: 26px;
      background: #EAE6E6;
      border-radius: 2px;
      line-height: 26px;
      text-align: center;
      right: 10px;
      bottom: 10px;
      cursor: pointer;
      color: #A5A0A1;
      font-size: 12px;
    }
    .btn.active{
      background: #000000;
      color: #fff;
    }
  }
  .comment-action{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    >span{
      color: #999;
      font-size: 14px;
    }
    >div{
      display: flex;
      align-items: center;
      >div{
        display: flex;
        align-items: center;
        cursor: pointer;
        span{
          color: #666666;
          font-size: 12px;
          margin-left: 6px;
        }
        img{
          width: 18px;
          height: 18px;
        }
        &:nth-child(2){
          margin-left: 20px;
        }
      }
    }
  }
  .my-comment{
    height: 54px;
    background: #FAFAFB;
    line-height: 54px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding-left: 20px;
    width: 100%;
    span{
      color: #888888;
      font-size: 14px;
    }
    div{
      color: #333333;
      font-weight: bold;
      margin-left: 10px;
    }
  }
  .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    font-weight: bold;
    font-size: 24px;
  }
  .comment-list{
    display: flex;
    margin-bottom: 10px;
    >img{
      width: 40px;
      height: 40px;
    }
    .comment-right{
      margin-left: 8px;
      padding-bottom: 20px;
      flex: 1;
      border-bottom: 1px solid #EBEBFF;
      .user-id{
        display: flex;
        align-items: center;
        span:nth-child(1){
          color: #333333;
          font-size: 14px;
          font-weight: bold;
        }
        span:nth-child(2){
          color: #666666;
          font-size: 12px;
          margin-left: 10px;
        }
      }
      .comment-content{
        line-height: 20px;
        font-size: 14px;
        color: #333333;
        margin-top: 12px;
      }
    }
  }
}
.music{
    padding: 11px 0 11px 10px;
    background: #fafafb;
    width: 855px;
    display: flex;
    align-items: center;
    margin-top: 12px;
    >div:nth-child(1){
      width: 62px;
      height: 62px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #d8d8d8;
    }
    >div:nth-child(2){
      height: 62px;
      line-height: 62px;
      padding-left: 10px;
      color: #333333;
      font-size: 16px;
      font-weight: bold;
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
</style>
