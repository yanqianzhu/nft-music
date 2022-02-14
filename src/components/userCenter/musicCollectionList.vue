<template>
  <div class="musiccollection">
    <div class="icon-content flex flex-justify-content-between">
      <div class="flex">
        <div class="icon-radio">
          <img :src="getUrl(itemInfo.cover)" alt="" />
        </div>
        <div class="music-list">
          <h1>{{ itemInfo.musicName }}</h1>
          <div class="icon-type ellipsis">
            <span v-for="item in itemInfo.label">{{ item }}</span>
          </div>
          <div class="icon-bottom flex">
            <div class="icon-like flex">
              <i class="iconfont icon-dianzan"></i>
              <p>{{ itemInfo.likeCount }}</p>
            </div>
            <div class="icon-comment flex">
              <i class="iconfont icon-pinglun"></i>
              <p>{{ itemInfo.commentCount }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-buy" @click="viewDetails(itemInfo.musicId)">查看详情</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { getUrl } from "@/utils/filter";
export default defineComponent({
  name: "nftstorelist",
  props: {
    itemInfo: {
      type: Object,
    },
  },
  setup() {
    const data = {
      router: useRouter(),
    };
    const viewDetails = (Id: number) => {
      data.router.push({ name: "musicDetails", params: { Id } });
    };
    return { viewDetails, getUrl };
  },
});
</script>

<style lang="scss" scoped>
.musiccollection {
  width: 1120px;
  margin-top: 51px;
  .icon-content {
    width: 1120px;
    height: 160px;
    padding-top: 19px;
    box-sizing: border-box;
    &:hover {
      background-color: #f8f8f8;
      .btn-buy {
        background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
        color: #ffffff;
      }
    }
    .icon-radio {
      width: 120px;
      height: 120px;
      img {
        width: 100%;
      }
    }
    .music-list {
      margin-left: 42px;
      h1 {
        font-size: 16px;
        color: #333333;
        margin-bottom: 17px;
      }
      span {
        padding: 2px 13px;
        border: solid 1px #ebebff;
        border-radius: 2px;
        font-size: 12px;
        color: #8395ff;
        margin-right: 14px;
      }
      .icon-like {
        margin-top: 27px;
        i {
          color: RGBA(255, 112, 112, 1);
        }
        p {
          font-size: 14px;
          color: #333333;
          margin-left: 10px;
        }
      }
      .icon-comment {
        margin-top: 27px;
        margin-left: 30px;
        p {
          font-size: 14px;
          color: #333333;
          margin-left: 10px;
        }
      }
    }
    .btn-buy {
      display: flex;
      width: 124px;
      height: 39px;
      background-color: #f8f8f8;
      border-radius: 19.5px;
      margin-top: 50px;
      font-size: 14px;
      color: #333333;
      padding-left: 34px;
      box-sizing: border-box;
      line-height: 39px;
      margin-right: 20px;
      cursor: pointer;
    }
  }
}
</style>
