<template>
  <div class="comment-item">
    <div class="comment-icon"></div>
    <div class="comment-right">
      <div class="name">
        <span>评论者名</span>
        <span>2021-1-20 14:30</span>
      </div>
      <div class="comment-content">XXHHH评论XCCBBXXX内容XXX备份</div>
      <div class="comment-bottom">
        <div class="icon-item">
          <i class="iconfont icon-dianzan"></i>
          <span>0</span>
        </div>
        <div class="icon-item">
          <i class="iconfont icon-pinglun"></i>
          <span>取消</span>
        </div>
        <div class="icon-item">
          <i class="iconfont icon-jubao"></i>
        </div>
      </div>
      
      <div style="margin-top:20px">
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
          <div :class="comment ? 'active' : ''">发送</div>
        </div>
      </div>
      <div class="more-comment" style="padding-bottom: 18px;">
        <span>展开44条回复</span>
        <img src="../../assets/images/caret-down1.png" />
      </div>
      <div class="sub-comment">
        <div class="sub-item">
          <div class="sub-left">
            <span>我叫周新星</span>
            <span>MMMMMM评论EEEEE内容DDDCCCCXXXXXXXXXGGGSFFFFFFSSSSSSSHHHH...</span>
          </div>
          <div class="sub-right">
            <img src="../../assets/images/love.png" />
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      comment: ''
    })
    return {
      ...toRefs(state)
    };
  },
});
</script>
<style lang="scss" scoped>
i{
  color: RGBA(205, 204, 204, 1);
  // &:hover{
  //   color: RGBA(51, 51, 51, 1);
  // }
  // &:nth-child(1):hover{
  //   color: RGBA(255, 112, 112, 1);
  // }
  
}
.icon-item:nth-child(2):hover i{
  
  color: RGBA(51, 51, 51, 1);
}
.icon-item:nth-child(3):hover i{
  
  color: RGBA(51, 51, 51, 1);
}
.icon-item:nth-child(1):hover i{
  color: RGBA(255, 112, 112, 1);
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
.sub-comment{
  border: 1px solid #EDEDFF;
  border-radius: 4px;
  .sub-item{
    height: 54px;
    padding: 0 38px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .sub-left{
      display: flex;
      align-items: center;
      span:nth-child(1){
        color: #888888;
        font-size: 14px;

      }
      span:nth-child(2){
        width: 700px;
        overflow: hidden;
        margin-left: 12px;
      }
    }
    .sub-right{
      display: flex;
      align-items: center;
      img{
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      span{
        color: #333;
        font-size: 12px;
        margin-left: 4px;
      }
    }
  }
}
  .comment-item{
    display: flex;
    margin-top: 46px;
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
      background: #D8D8D8;
      border-radius: 20px;
    }
    .comment-right{
      flex: 1;
      margin-left: 8px;
      .name{
        display: flex;
        align-items: center;
        span:nth-child(1){
          color: #333;
          font-size: 14px;
          font-weight: bold;
        }
        span:nth-child(2){
          color: #666;
          font-size: 12px;
          margin-left: 12px;
        }
      }
      .comment-content{
        color: #333;
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
        margin-top: 12px;
      }
      .comment-bottom{
        margin-top: 12px;
        display: flex;
        .icon-item{
          display: flex;
          align-items: center;
          margin-right: 30px;
          cursor: pointer;
          img{
            width: 16px;
            height: 16px;
          }
          span{
            color: #333;
            font-size: 12px;
            margin-left: 2px;
          }
        }
      }
    }
  }
</style>
