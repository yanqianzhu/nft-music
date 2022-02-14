<template>
  <div class="nftStore-item flex-middle-between">
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
      <p class="nft-label"><span>拥有:</span>100</p>
      <p class="nft-label"><span>现在价格:</span>100</p>
      <div class="operate-box flex-middle-between">
        <p class="nft-label"><span> 最新成交价格: </span>100</p>
        <div class="more-box">
          <el-popover placement="bottom" trigger="hover">
            <template #reference>
              <span>操作</span>
            </template>
            <div class="work-popover-box">
              <p v-for="item in moreList">{{ item }}</p>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ElPopover } from "element-plus";
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "nftStoreItem",
  components: {
    ElPopover,
  },
  setup() {
    const state = reactive({
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      moreList: ["置顶", "出售NFT", "分享NFT", "转移NFT", "设为仅我可见"],
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.nftStore-item {
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
    .nft-label {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #888888;
        margin-right: 5px;
      }
    }
    .operate-box {
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
