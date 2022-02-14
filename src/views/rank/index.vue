<template>
  <div class="rank">
    <div class="banner">
      <img src="../../assets/images/rank.png" />
    </div>
    <div class="title">
      <span>热歌榜</span>
      <div>
        <img src="../../assets/images/play.png"/>
        <span>播放当前所有</span>
      </div>
    </div>
    <div class="select">
      <div>
        <el-select v-model="sortType" placeholder="Select" class="select-box" size="small" style="width: 100px;">
          <el-option
            v-for="item in sortTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            
          >
          </el-option>
        </el-select>
      </div>
      <el-popover
        placement="bottom-start"
        title="榜单规则"
        :width="200"
        trigger="hover"
        content="多音乐站内播放点赞热度最高的50首单曲"
      >
        <template #reference>
          <div>榜单规则</div>
        </template>
      </el-popover>
      
    </div>
    <div class="music-list">
      <div class="music-item" v-for="(item, index) in list" :key="index">
        <div class="rank-index">
          <img src="../../assets/images/rankindex.png" v-if="true" />
          <img class="up" src="../../assets/images/caret-down1.png" v-if="true" />
          <img class="down" src="../../assets/images/caret-down.png" v-else />
          <div class="none"></div>
          
          <span>11</span>
        </div>
        <div class="player">
          <img src="../../assets/images/bg_video.png" />
          <img src="../../assets/images/bg_audio_cover.png" />
          <i class="iconfont icon-bofang"></i>
        </div>
        <div class="music-info">
          <div class="music-title">{{item.Name}}</div>
          <div class="music-tag">
            <div class="tag-content">
              <div class="tag" v-for="(i, idx) in item.Labels" :key="idx" v-show="idx < 4">{{i.Lable}}</div>
            </div>
            <div class="music-time">上传时间：{{dateFormat(item.CreateTime, "yyyy-MM-dd HH:mm:ss")}}</div>
          </div>
          <div class="music-bottom">
            <div>版权收益NFT1</div>
            <div>10%/1000个</div>
            <div>{{dateFormat(item.CreateTime, "yyyy-MM-dd HH:mm:ss")}} </div>
          </div>
        </div>
        <div class="nft">
          NFT有售
        </div>
        <div class="action">
          <div class="action-btn">立即购买</div>
          <div class="action-list">
            <i class="iconfont icon-dianzan"></i>
            <i class="iconfont icon-shoucangjia"></i>
            <i class="iconfont icon-fenxiang"></i>
            <i class="iconfont icon-jubao"></i>
          </div>
        </div>
      </div>
      <superPaginationVue
        :total="page.total"
        v-model:currentPage="page.current"
        v-model:pageSize="page.pageSize"
      ></superPaginationVue>
    </div>
    <div class="comment-title">
      <span>评论</span>
      <span>共72565条评</span>
    </div>
    <div class="comment-box">
      <el-input
        v-model="comment"
        maxlength="300"
        placeholder="说说你的看法吧"
        show-word-limit
        resize="none"
        type="textarea"
      />
    </div>
    <div class="comment-action">
      <div>
        <svg-icon iconClass="emoji" className="icon-emoji"></svg-icon>
      </div>
      <div :class="comment ? 'active' : ''">发表评论</div>
    </div>
    <div class="hot-comment">
      <div class="hot-title">精彩评论</div>
      <div class="comment-list">
        <commmet-list />
      </div>
      <div class="hot-title">精彩评论</div>
      <div class="comment-list">
        <commmet-list />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from "vue";
import { getRecommendMusicList } from "@/api/apiManagement/rank";
import superPaginationVue from "@/components/public/superPagination.vue";
import { dateFormat } from "@/utils/filter";
import commmetList from "@/components/rank/comment-list.vue";
export default defineComponent({
  components: {
    superPaginationVue,
    commmetList
  },
  setup() {
    const state = reactive({
      sortType: 0,
      comment: '',
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      list: [],
      sortTypeList: [
        { label: "1天", value: 0 },
        { label: "7天", value: 1 },
        { label: "30天", value: 2 },
      ],
    })
    onMounted(() => {
      getData()
    })
    watch(() => [state.sortType, state.page.pageSize], () => {
      if (state.page.current == 1) return getData();
      state.page.current = 1;

    })
    watch(() => state.page.current, (n) => {
      getData();
    })
    const getData = () => {
      getRecommendMusicList({
        Page: state.page.current,
        Size: state.page.pageSize
      }).then((res) => {
        state.list = res.data.list;
        state.page.total = res.data.total;
      })
    }
    return {
      ...toRefs(state),
      dateFormat
    };
  },
});
</script>
<style lang="scss" scoped>
  .rank{
    width: 1200px;
    padding-top: 20px;
    padding-bottom: 20px;
    .hot-comment{
      .hot-title{
        padding: 40px 0 28px;
        color: #333;
        font-size: 24px;
        font-weight: bold;
        border-bottom: 1px solid #EBEBFF;
      }
      .comment-list{
        // padding-bottom: ;
      }
      
      
    }
    .comment-action{
      display: flex;
      justify-content: flex-end;
      align-self: center;
      padding-top: 18px;
      >div:nth-child(1){
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      div:nth-child(2){
        cursor: pointer;
        width: 71px;
        height: 26px;
        background: #F3F3F3;
        border-radius: 2px;
        line-height: 26px;
        text-align: center;
        color: #A5A0A1;
        font-size: 12px;
        margin-left: 18px;
      }
      div:nth-child(2).active{
        color: #FFFFFF;
        background: #000000;
      }
    }
    .comment-title{
      padding: 50px 0 18px;
      display: flex;
      align-items: center;
      span:nth-child(1){
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }
      span:nth-child(2){
        color: #999;
        font-size: 14px;
        margin-left: 12px;
      }
    }
    .music-item{
      padding: 20px 26px;
      background: #F8F8F8;
      display: flex;
      
      .action{
        width: 200px;
        margin-left: 100px;
        padding-top: 20px;
        .action-btn{
          width: 124px;
          height: 39px;
          background: #EFEFEF;
          border-radius: 20px;
          line-height: 39px;
          text-align: center;
          color: #333;
          font-weight: bold;
          font-size: 14px;
          margin: 0 auto;
          cursor: pointer;
        }
        .action-list{
          display: flex;
          align-items: center;
          margin-top: 28px;
          i{
            font-size: 20px;
            color: RGBA(205, 204, 204, 1);
            margin-right: 30px;
            cursor: pointer;
          }
          i:hover{
            color: RGBA(51, 51, 51, 1);
          }
          i:nth-child(1):hover{
            color: RGBA(255, 112, 112, 1);
          }
        }
      }
      .nft{
        line-height: 120px;
        margin-left: 90px;
        color: #333;
        font-weight: bold;
      }
      .music-bottom{
        display: flex;
        align-items: center;
        margin-top: 20px;
        div:nth-child(1){
          font-size: 14px;
          color: #333333;
        }
        div:nth-child(2){
          color: #999;
          font-size: 14px;
          margin-left: 17px;
        }
        div:nth-child(3){
          color: #999;
          margin-left: 10px;
          font-size: 14px;
        }
      }
      .music-tag{
        display: flex;
        margin-top: 20px;
        display: flex;
        align-items: center;
        .music-time{
          
          font-size: 12px;
          color: #333;
          margin-left: 50px;
        }
        .tag-content{
          // display: flex;
          // align-items: center;
          width: 242px;
          // overflow-x: scroll;
          white-space: nowrap;
          .tag{
            height: 26px;
            background: #F1F1FF;
            display: inline-block;
            border-radius: 2px;
            border: 1px solid #AEBAFF;
            line-height: 26px;
            padding: 0 12px;
            font-size: 12px;
            color: #8395FF;
            margin-right: 14px;

          }
          .tag:last-child{
            margin-right: 0;
          }
        }
      }
      .music-info{
        padding-top: 2px;
        margin-left: 14px;
        .music-title{
          color: #333333;
          line-height: 25px;
          height: 25px;
          font-size: 18px;
         
          font-weight: bold;
        }
      }
      .player{
        height: 120px;
        width: 148px;
        margin-left: 24px;
        position: relative;
        .iconfont{
          z-index: 100;
          color: #fff;
          cursor: pointer;
          padding: 5px;
          font-size: 25px;
          position: absolute;
          left: 40px;
          top: 40px;
        }
        img:nth-child(1){
          width: 120px;
          height: 120px;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 3;
        }
        img:nth-child(2){
          width: 120px;
          height: 120px;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 2;
        }
      }
      .rank-index{
        display: flex;
        align-items: center;
        flex-direction: column;
        align-items: center;
        width: 40px;
        img:nth-child(1){
          width: 40px;
          height: 37px;
        }
        .none{
          width: 13px;
          height: 2px;
          background: #999999;
        }
        .up,.down{
          margin-top: 3px;
          height: 10px;
          width: 10px;
        }
        span{
          font-size: 14px;
          color: #888;
          margin-top: 4px;
        }
      }
    }
    .select{
      display: flex;
      align-items: center;
      padding: 22px 0 35px;
      >div:nth-child(2){
        width: 80px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #F5F4F4;
        border-radius: 2px;
        margin-left: 34px;
        color: #888;
        font-size: 14px;
      }
    }
    .banner{
      img{
        display: block;
        width: 100%;
        height: auto;
      }
    }
    .title{
      padding: 35px 0 23px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #EBEBFF;
      >span{
        line-height: 45px;
        font-weight: bold;
        font-size: 32px;
        height: 45px;
      }
      >div{
        width: 160px;
        padding: 0 20px;
        cursor: pointer;
        height: 46px;
        background: #000000;
        box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
        border-radius: 23px;
        display: flex;
        align-items: center;
        img{
          width: 24px;
          height: 24px;
        }
        span{
          font-size: 14px;
          color: #fff;
          margin-left: 12px;
        }
      }
    }
  }
</style>
