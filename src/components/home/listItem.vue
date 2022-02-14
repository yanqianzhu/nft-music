<template>
  <div class="homepage-list-item flex-middle-between">
    <div class="audio-cover-box">
      <div class="audio-cover flex-center-center">
        <img :src="getUrl(itemInfo.Cover)" />
        <i class="iconfont" :class="[playStatus ? 'icon-zanting' : 'icon-bofang']" @click="play">
        </i>
        <!-- <i class="iconfont icon-zanting"> </i> -->
      </div>
      <img :src="coverBg" class="audip-cover-bg" />
    </div>
    <div class="audio-info-box" v-cloak>
      <p class="audio-info-name">{{ itemInfo.Name }}</p>
      <div class="audio-nft-info-box">
        <div class="tag-box ellipsis">
          <span v-for="item in itemInfo.Label" class="tag-item">{{ item }}</span>
        </div>
        <div class="audio-nft-other-box">
          <span class="sell-create-time">
            上架时间:{{ dateFormat(itemInfo.CreateTime, "yyyy-MM-dd hh:mm:ss") }}
          </span>
          <span class="sell-type">
            {{ itemInfo.State == 0 ? "——" : "NFT在售" }}
          </span>
          <div class="operate-box">
            <p class="todetails" @click="toDetails(itemInfo.Id)">查看详情</p>
            <p>
              <i
                class="iconfont icon-dianzan"
                :class="{ active: itemInfo.IsLike == 1 }"
                @click="setOperation(0)"
              ></i>
              <i
                class="iconfont icon-shoucangjia"
                @click="setOperation(1)"
                :class="{ active: itemInfo.IsCollection == 1 }"
              ></i>
              <el-popover placement="bottom-end" :width="320">
                <p class="shareTitle">复制链接粘贴给微信/QQ好友</p>
                <div class="copy">
                  <p>{{ getItemDetailsUrl() }}</p>
                  <button @click="copy">复制</button>
                </div>
                <template #reference>
                  <i class="iconfont icon-fenxiang"></i>
                </template>
              </el-popover>
            </p>
          </div>
        </div>
      </div>
      <div class="audi-income-box">
        版权收益NFT
        <span class="nft-sell"
          >{{
            itemInfo.IsCastingNft == 1
              ? `${itemInfo.CastingCount}个&nbsp;-&nbsp;${itemInfo.CopyrightProportion / 100}%`
              : "--&nbsp;--"
          }}
        </span>
        <span class="nft-create-time">
          {{
            itemInfo.IsCastingNft == 1
              ? dateFormat(itemInfo.FirstNftTime, "yy-MM-dd hh:mm")
              : "--&nbsp;--"
          }}
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, reactive, toRefs } from "vue";
// @ts-ignore
import coverBg from "@/assets/images/bg_audio_cover.png";
import { setMusicLikeStatusApi, setMusicCollectStatusApi } from "@/api/apiManagement/audio";
import { ElMessage } from "element-plus";
import { dateFormat, getUrl } from "@/utils/filter";
import { useRouter } from "vue-router";
import useClipboard from "vue-clipboard3";
import { useStore } from "vuex";
import emitter from "@/utils/mitt";

type obj = {
  Opt: number;
  LikeId?: number;
  BizType?: number;
  MusicId?: number;
};
export default defineComponent({
  name: "listItem",
  props: {
    item: Object,
    index: Number,
  },
  setup(props: any, { emit }) {
    const data = reactive({
      tag: ["Demo", "流行", "安静", "国语", "Demo", "流行", "安静", "国语"],
      router: useRouter(),
      itemInfo: props.item,
      stroe: useStore(),
      playStatus: false,
    });
    // ---methods
    /**
     * @description 用户操作
     * @param type 0 点赞 1收藏
     * 无需登录 接口 musicOperation
     * @param 接口type 操作类型1:点赞，2：展示 3、播放 4：转发
     */
    async function setOperation(type: number) {
      if (!isLogin.value) {
        ElMessage.warning("请登录后在操作一遍~");
        data.stroe.commit("setLoginShow");
        return;
      }
      let status = type == 0 ? "IsLike" : "IsCollection";
      let obj: obj = {
        Opt: Number(!Boolean(data.itemInfo[status])),
      };
      if (type == 0) {
        obj.BizType = 1;
        obj.LikeId = data.itemInfo.Id;
      } else {
        obj.MusicId = data.itemInfo.Id;
      }
      await (type == 0 ? setMusicLikeStatusApi : setMusicCollectStatusApi)(obj)
        .then((res: any) => {
          if (res.code == 0) {
            data.itemInfo[status] = Number(!Boolean(data.itemInfo[status]));
          } else {
            ElMessage.error(res.msg);
          }
        })
        .catch((e) => {
          ElMessage.error(e.data.msg);
        });
    }
    function getItemDetailsUrl() {
      return `${window.location.origin}/musicDetails/${data.itemInfo.Id}`;
    }
    const { toClipboard } = useClipboard();
    const text = ref("");

    const copy = async () => {
      try {
        await toClipboard(getItemDetailsUrl());
        ElMessage.success("复制成功!");
      } catch (e) {
        console.error(e);
      }
    };
    const toDetails = (Id: number) => {
      data.router.push({ name: "musicDetails", params: { Id } });
    };
    const isLogin = computed(() => {
      return data.stroe.getters.isLogin;
    });
    function play() {
      emit("setPlayerList");
      // if(){}
      data.stroe.commit("setCurrenyPlayerIndex", props.index);
      emitter.emit("audioPlayer", props.item);
    }
    emitter.on("changePlayStatus", (item: any) => {
      console.log("changePlayStatus", item.Id == data.itemInfo.Id);
      data.playStatus = item.Id == data.itemInfo.Id;
    });
    onUnmounted(() => {
      emitter.off("changePlayStatus");
    });
    return {
      ...toRefs(data),
      coverBg,
      setOperation,
      dateFormat,
      toDetails,
      copy,
      text,
      getUrl,
      getItemDetailsUrl,
      play,
    };
  },
});
</script>
<style lang="scss" scoped>
.homepage-list-item {
  width: 1200px;
  height: 160px;
  padding: 20px 2% 20px 0px;
  .audio-cover-box {
    width: 148px;
    position: relative;
    flex-shrink: 0;
    .audio-cover {
      width: 120px;
      height: 120px;
      position: relative;
      z-index: 1;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        z-index: 0;
      }
      .iconfont {
        z-index: 1;
        color: #fff;
        cursor: pointer;
        padding: 5px;
        font-size: 25px;
      }
    }
    .audip-cover-bg {
      width: 120px;
      height: 120px;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 0;
    }
  }
  .audio-info-box {
    flex-grow: 1;
    padding-left: 15px;
    height: 100%;
    padding-bottom: 7px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: calc(100% - 148px);
    .audio-info-name {
      font-size: 20px;
      font-weight: 500;
      color: #333333;
    }
    .audio-nft-info-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .tag-box {
        flex-grow: 1;
        width: 30%;
        .tag-item {
          width: 50px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          display: inline-block;
          margin-left: 15px;
          color: #8395ff;
          border: 1px solid #8395ff;
          &:first-child {
            margin-left: 0px;
          }
        }
      }
      .audio-nft-other-box {
        width: 70%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sell-create-time {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        width: 220px;
        flex-shrink: 0;
      }

      .sell-type {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        width: 100px;
        flex-shrink: 0;
      }
      .operate-box {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        .todetails {
          margin-right: 50px;
          padding: 10px 0px;
          background: #f8f8f8;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          width: 130px;
          text-align: center;
        }
        .iconfont {
          font-size: 20px;
          padding: 5px;
          cursor: pointer;
          color: RGBA(205, 204, 204, 1);
          &.icon-dianzan {
            &.active,
            &:hover {
              color: #e92b4f;
            }
          }
          &.icon-shoucangjia {
            &.active,
            &:hover {
              color: #ffb802;
            }
          }
          &.icon-fenxiang {
            padding-right: 0;
          }
          &.icon-dianzan,
          &.icon-shoucangjia {
            margin-right: 30px;
          }
        }
      }
    }
    .audi-income-box {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      .nft-sell,
      .nft-create-time {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        margin-left: 15px;
      }
    }
  }
}
.shareTitle {
  font-size: 14px;
  color: #666666;
  margin-bottom: 18px;
}
.copy {
  width: 270px;
  height: 32px;
  background-color: #eff0f3;
  position: relative;
  border-radius: 4px;
  display: flex;

  button {
    width: 50px;
    height: 32px;
    background-color: #7faaff;
    color: #ffffff;
    font-size: 14px;
    border: 0 none;
    border-radius: 0px 4px 4px 0px;
    outline: none;
    &:hover {
      cursor: pointer;
    }
  }
  p {
    width: 220px;
    height: 32px;
    overflow-x: auto;
    color: #a2a3a7;
    white-space: nowrap;
    font-size: 14px;
    padding: 4px 8px;
  }
}
</style>
