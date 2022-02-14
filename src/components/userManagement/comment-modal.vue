<template>
  <div>
    <el-drawer
      v-model="drawer"
      title=""
      :size="440"
    >
      <div class="music" style="width:400px;height:100%;overflow:hidden">
        <div class="send-box">
          <div class="input-box">
            <input v-model="text" placeholder="积极回复可吸引更多评论…" />
            <div :class="text ? 'active' : ''" @click="send">发布</div>
          </div>
        </div>
        <div class="music-info">
          <img :src="getUrl(musicInfo.cover)" />
          <div class="music-right">
            <div class="title">
              <span>{{musicInfo.name + '-' + musicInfo.singing}}</span>
              <span v-if="musicInfo.isPrivate">仅我可见</span>
            </div>
            <div class="tag">
              <template v-for="(item,index) in (musicInfo.labels)" :key="index">
                <span>{{item}}</span>
              </template>
            </div>
            <div class="time">{{dateFormat((musicInfo.CreateTime || musicInfo.createTime) * 1000, 'yy-MM-dd hh:mm')}}</div>

          </div>
        </div>
        <div class="select-title">
          <span>全部评论（{{totalcomment}}）</span>
          <div>
            <el-select v-model="sortType" placeholder="刷新" style="width:100px" class="select-box">
              <el-option
                v-for="item in sortTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="comment-list" v-infinite-scroll="load">
          <div class="comment-item" v-for="(item,index) in dataSource" :key="index">
            <div class="comment-icon">
              <img :src="getUrl(item.HeadShotPath)" />
            </div>
            <div class="comment-info" >
              <div>{{item.NickName}}<span>{{dateFormat(item.CreateTime, 'yyyy-MM-dd HH:mm')}}</span></div>
              <div>{{item.Comment}}</div>
              <div class="action">
                <div>
                  <i class="iconfont icon-pinglun"></i>
                  <span>回复</span>
                </div>
                <div @click="like(item, index)">
                  <i :class="item.IsLike ? 'active' : ''" class="icon-dianzan iconfont"></i>
                  <span>{{item.LikeCount}}</span>
                </div>
                <div>
                  <img style="width:12px;height:14px" src="../../assets/images/zhiding.png" />
                  <span>置顶</span>
                </div>
                <div>
                  <i class="iconfont icon-shanchu1"></i>
                  <span @click="delComment(item.Id, index)">删除</span>
                </div>
              </div>
              <div v-if="item.ReplyCount" class="more-comment" style="border-bottom: 1px solid #EBEBFF;padding-bottom: 18px;">
                <span>展开{{item.ReplyCount}}条回复</span>
                <img src="../../assets/images/caret-down1.png" />
              </div>
              <!-- <div class="comment-item">
                <div class="comment-icon"></div>
                <div class="comment-info">
                  <div>评论者名<span>2021-11-15</span></div>
                  <div>不错，继续加油！</div>
                  <div class="action">
                    <div>
                      <img src="../../assets/images/xiaoxi.png" />
                      <span>回复</span>
                    </div>
                    <div>
                      <img src="../../assets/images/love.png" />
                      <span>0</span>
                    </div>
                    <div>
                      <img style="width:12px;height:14px" src="../../assets/images/zhiding.png" />
                      <span>置顶</span>
                    </div>
                    <div>
                      <i class="iconfont icon-shanchu1"></i>
                      <span>删除</span>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <div class="nodata" v-if="allLoad">没有更多了～</div>
        </div>
        
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, ref, nextTick, watch } from "vue";
import { dateFormat, getUrl } from "@/utils/filter";
import { getCommentList, deleteComment } from "@/api/apiManagement/userManagement";
import { postCommentLikes } from '@/api/apiManagement/audio';
import { ElMessage } from "element-plus";
import { createCommentApi, setMusicLikeStatusApi } from "@/api/apiManagement/audio";
export default defineComponent({
  props: {
    musicInfo: {
      type: Object,
      require: true
    }
    
  },
  setup(props: any) {
    const state = reactive({
      drawer: false,
      dataSource: [],
      sortType: '',
      text: '',
      sortTypeList: [
        { label: "最新", value: 0 },
        { label: "最热", value: 1 },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      totalcomment: 0,
      init: true,
      allLoad: false,
      id: 0,
    })
    const resetCommet = () => {
      state.page = {
        current: 1,
        pageSize: 10,
        total: 0
      }
      state.init = true;
      state.allLoad = false;
      state.dataSource = [];
      getData();
    }
    function getData() {
      nextTick(() => {
        getCommentList({
          Page: state.page.current,
          Size: state.page.pageSize,
          MusicId: props.musicInfo.id
        }).then((res) => {
          state.init = false;
          const list = res.data.list || []
          state.dataSource = state.page.current == 1 ? list : state.dataSource.concat(list);
          state.page.total = res.data.total;
          state.totalcomment = res.data.total;
          if (state.dataSource.length == state.page.total) {
            state.allLoad = true;
          }
        })
      })
      
    }
    const load = () => {
      if (state.init || state.allLoad) return;
      state.page.current += 1;
    }
    watch(() => state.page.current, () => {
      getData();
    })
    const like = (obj: any, index: number) => {
      setMusicLikeStatusApi({LikeId: obj.Id, BizType: 2, Opt: obj.IsLike ? 0 : 1}).then((res: any) => {
        if (res.code == 0) {
          state.dataSource[index].IsLike = obj.IsLike ? 0 : 1;
          state.dataSource[index].LikeCount = obj.IsLike ? (obj.LikeCount + 1) : (obj.LikeCount - 1);
          ElMessage.success('操作成功')
        }
      })
    }
    const send = () => {
      createCommentApi({
        MusicId: props.musicInfo.id,
        Comment: state.text

      }).then((res: any) => {
        if (res.code == 0) {
          state.dataSource.unshift(res.data);
          state.totalcomment += 1;
          ElMessage.success("发布成功");
        }
      })
    }
    const delComment = (id: number, index: number) => {
      deleteComment({
        id
      }).then((res: any) => {
        if (res.code == 0) {
          state.dataSource.splice(index, 1)
          state.totalcomment -= 1;
          ElMessage.success('操作成功')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    return {
      ...toRefs(state),
      dateFormat,
      getUrl,
      resetCommet,
      load,
      like,
      send,
      delComment
    };
  },
});
</script>

<style lang="scss" scoped>
.icon-dianzan:hover{
  color: RGBA(255, 112, 112, 1);
}
.icon-dianzan.active{
  color: RGBA(255, 112, 112, 1);
}
.nodata {
    margin-top: 43px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    font-size: 14px;
    text-align: center;
  }
.send-box{
  position: absolute;
  width: 100%;
  height: 68px;
  background: #F8F9FD;
  left: 0;
  bottom: 0;
  padding: 13px 23px 12px 25px;
  .input-box{
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    // width: 412px;
    height: 43px;
    background: #EFF0F3;
    border-radius: 1px;
    padding-left: 13px;
    input{
      height: 36px;
      border: 0;
      outline: none;
      background: none;
      width: 300px;
    }
    div{
      width: 38px;
      height: 20px;
      background: #A2A3A7;
      border-radius: 2px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      line-height: 20px;
      cursor: pointer;
    }
    div.active{
      background: #000000;
    }
  }
}
.comment-item{
  display: flex;
  margin-top: 12px;
  .more-comment{
    display: flex;
    align-items: center;
    margin-top: 10px;
    cursor: pointer;
    span{
      color: #999999;
      font-size: 12px;
    }
    img{
      width: 10px;
      height: 10px;
      margin-left: 4px;
    }
  }
  .comment-icon{
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
    img{
      display: block;
      width: 40px;
      height: 40px;
    }
  }
  .comment-info{
    flex: 1;
    margin-left: 12px;
    >div:nth-child(1){
      
      font-size: 12px;
      color: #666666;
      span{
        margin-left: 6px;
      }
    }
    >div:nth-child(2){
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      margin-top: 6px;
    }
    .action{
      display: flex;
      align-items: center;
      margin-top: 15px;
      div{
        display: flex;
        align-items: center;
        margin-right: 30px;
        cursor: pointer;
        img{
          height: 16px;
          width: 16px;
          
        }
        span{
          margin-left: 2px;
          color: #333333;
          font-size: 12px;
        }
      }
    }
  }
}
.select-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 26px;
  span{
    font-weight: bold;
    font-size: 16px;
    color: #000000;
  }
}
  .music{
    display: flex;
    flex-direction: column;
    .comment-list{
      // flex: 1;
      overflow-y: auto;
      height: calc(100vh - 370px);
    }

  }
  .music-info{
    display: flex;
    img{
      width: 120px;
      height: 120px;
    }
    .music-right{
      flex: 1;
      margin-left: 14px;
      .title{
        display: flex;
        align-items: center;
        span:nth-child(1){
          font-weight: bold;
          color: #333333;
          font-size: 16px;
        }
        span:nth-child(2){
          padding: 0 6px;
          height: 20px;
          background: rgba(136, 136, 136, 0.1);
          border-radius: 2px;
          border: 1px solid #D0D0D0;
          line-height: 20px;
          font-size: 12px;
          margin-left: 18px;
          color: #333333;
        }
      }
      .tag{
        display: flex;
        align-items: center;
        margin-top: 16px;
        span{
          height: 26px;
          padding: 0 12px;
          line-height: 26px;
          background: #F1F1FF;
          border-radius: 2px;
          border: 1px solid #AEBAFF;
          font-size: 12px;
          color: #8395FF;
          margin-right: 14px;
        }
        
      }
      .time{
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          margin-top: 10px;
        }
    }
  }
</style>
