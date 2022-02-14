<template>
  <div class="work-item flex-middle-between">
    <el-image :src="url" fit="cover" class="music-picture"></el-image>
    <div class="item-data">
      <div class="music-name flex-middle-between">
        <div class="flex">
          <span class="">歌曲名</span>
          <div class="status-box">
            <span class="success">已发布</span>
            <span class="error">已发布</span>
            <span class="warning">已发布</span>
            <span class="normal">已发布</span>

            <span class="normal"> 仅我可见 </span>
            <span class="top"> 置顶 </span>
          </div>
        </div>
        <span class="music-create-time">2021-11-17 15：40</span>
      </div>
      <div class="progress-box">
        剩余比例
        <el-progress :percentage="50" class="progress" />
      </div>
      <div class="types-box">
        <span>公开可看</span>
        <span>原创歌曲</span>
      </div>
      <div class="operate-box flex-middle-between">
        <div class="count-box">
          <span v-for="i in workDataList">
            <i class="iconfont" :class="i"></i>
            996
          </span>
        </div>
        <div class="more-box">
          <span @click="toNFTIncome">铸造NFT</span>
          <span @click="changeAccessShow">权限设置</span>
          <el-popover placement="bottom" trigger="hover">
            <template #reference>
              <span>更多</span>
            </template>
            <div class="work-popover-box">
              <p v-for="item in moreList">{{ item }}</p>
              <p>置顶</p>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Edit } from "@element-plus/icons";
import { ElProgress, ElPopover } from "element-plus";
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "workItem",
  components: {
    Edit,
    ElProgress,
    ElPopover,
  },
  setup(props, content) {
    const state = reactive({
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      workDataList: ["icon-bofang", "icon-dianzan", "icon-pinglun", "icon-shoucangjia"],
      moreList: ["修改", "查看评论", "分享"],
      router: useRouter(),
    });
    function changeAccessShow() {
      content.emit("changeAccessShow");
    }
    const toNFTIncome = () => {
      console.log(123123)
      state.router.push({ name: "NFTIncome",params:{id:129} });
    };
    return {
      ...toRefs(state),
      changeAccessShow,
      toNFTIncome,
    };
  },
});
</script>

<style lang="scss" scoped>
.work-item {
  padding: 20px 0px;
  border-bottom: 1px solid #ebebff;
  .music-picture {
    width: 140px;
    height: 140px;
    flex-shrink: 0;
  }
  .item-data {
    padding: 4px 0px 0px 25px;
    flex-grow: 1;
    height: 140px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .music-name {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      .music-create-time {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
    }
    .flex {
      .status-box {
        padding-left: 20px;
        @mixin statusItem {
          padding: 2px 7px;
          font-size: 12px;
          font-weight: 400;
          border-radius: 2px;
          border: 1px solid #d0d0d0;
          margin-right: 12px;
          text-align: center;
          user-select: none;
        }
        .success {
          @include statusItem();
          color: RGBA(44, 208, 128, 1);
          background: RGBA(44, 208, 128, 0.1);
          border: 1px solid RGBA(44, 208, 128, 1);
        }
        .error {
          @include statusItem();
          background: rgba(255, 112, 112, 0.1);
          border: 1px solid #ff7070;
          color: #ff7070;
        }
        .warning {
          @include statusItem();
          color: rgba(255, 171, 24, 1);
          background: #fff9ef;
          border: 1px solid #ffd48a;
        }
        .normal {
          @include statusItem();
          color: #333333;
          background: rgba(136, 136, 136, 0.1);
          border: 1px solid #d0d0d0;
        }
        .top {
          @include statusItem();
          background: #000000;
          color: #fff;
        }
      }
    }
    .progress-box {
      display: flex;
      .progress {
        width: 260px;
        margin-left: 15px;
      }
    }
    .types-box {
      span {
        display: inline-block;
        margin-right: 15px;
        width: 50px;
        height: 26px;
        background: #f1f1ff;
        border-radius: 2px;
        border: 1px solid #aebaff;
        font-size: 12px;
        font-weight: 400;
        line-height: 26px;
        text-align: center;
        color: #8395ff;
      }
    }
    .operate-box {
      .count-box {
        font-size: 14px;
        color: #333333;
        display: flex;
        flex-direction: row;
        span {
          margin-right: 30px;
          display: flex;
          align-items: center;
        }
        .iconfont {
          margin-right: 10px;
          font-size: 18px;
          &.icon-dianzan {
            color: RGBA(255, 112, 112, 1);
          }
        }
      }
      .more-box {
        margin-left: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        span {
          margin-left: 20px;
          cursor: pointer;
          user-select: none;
          &:hover {
            color: RGBA(93, 163, 255, 1);
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.work-popover-box {
  p {
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    padding-left: 5px;
    &:hover {
      background-color: RGBA(245, 244, 244, 1);
    }
  }
}
</style>
