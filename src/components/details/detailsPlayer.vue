<template>
  <div class="detailsPlayer">
    <audio
      ref="audioref"
      @loadedmetadata="onLoadedmetadata"
      @timeupdate="onTimeupdate"
      @waiting="onWaitting"
      @error="onError"
      @ended="onEnd"
      :src="getUrl(musicInfo.Path)"
    >
      您的浏览器不支持音频播放
    </audio>
    <img src="@/assets/images/bg_video.png" class="bg-audio" />
    <div class="content-box">
      <p class="audio-name">{{ musicInfo.MusicName }}</p>
      <div class="operate-box">
        <i
          class="iconfont icon-dianzan"
          :class="{ active: itemInfo.IsLike == 1 }"
          @click="operate(0)"
        ></i>
        <i
          class="iconfont icon-shoucangjia"
          :class="{ active: itemInfo.IsCollection == 1 }"
          @click="operate(1)"
        ></i>
      </div>
      <div class="lrc-box" ref="lyricParent">
        <div class="lyric">
          <p v-for="(item, index) in lrcData" :class="{ heightLight: tempIndex === index }">
            {{ item.content }}
          </p>
        </div>
      </div>

      <div class="audio-slide-box">
        <div class="audio-operate-box">
          <div class="operate-left">
            <i
              class="iconfont"
              :class="platStatus ? 'icon-zanting' : 'icon-bofang'"
              @click="onPlay"
            ></i>
            {{ realFormatSecond(audio.currentTime) + "/" + audio.maxTime }}
          </div>
          <div class="operate-right">
            <div class="volume-box">
              <i class="iconfont icon-lababofang"></i>

              <el-slider
                v-model="audio.volume"
                vertical
                class="volume-slide"
                @input="changeVolume"
              ></el-slider>
            </div>
            <i class="iconfont icon-jubao" @click="reportDialogShow = true"></i>
          </div>
        </div>
        <el-slider
          v-model="audio.sliderTime"
          :max="audio.maxSliderTime"
          @change="changeCurrentTime"
          :show-tooltip="false"
          style="--el-slider-height: 6px; --el-slider-margin: 0px"
        ></el-slider>
      </div>
    </div>
  </div>
  <reportDialogVue v-model:reportDialogShow="reportDialogShow" :id="itemInfo.Id"></reportDialogVue>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch } from "vue";
//@ts-ignore
import { dateFormat, getUrl, realFormatSecond } from "@/utils/filter";
import { onFormatLyric } from "@/utils/audio";
import { useRoute } from "vue-router";
import { getPlayInfoApi } from "@/api/apiManagement/audio";
import { setMusicLikeStatusApi, setMusicCollectStatusApi } from "@/api/apiManagement/audio";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import reportDialogVue from "../public/reportDialog.vue";

type obj = {
  Opt: number;
  LikeId?: number;
  BizType?: number;
  MusicId?: number;
};
export default defineComponent({
  name: "detailsPlayer",
  props: { musicInfo: Object },
  components: {
    reportDialogVue,
  },
  setup(props) {
    const data = reactive({
      lrcData: [],
      audioref: null,
      audio: {
        playing: false, // 播放状态
        currentTime: 0, // 当前时间
        maxTime: "0", // 最大时间
        sliderTime: 0, // 进度条当前值
        maxSliderTime: 0, // 进度条最大值
        volume: 50, // 音量
      },
      bWaitting: true,
      lyricParent: null,
      tempIndex: 0,
      route: useRoute(),
      stroe: useStore(),
      itemInfo: props.musicInfo,
      reportDialogShow: false,
    });
    const isLogin = computed(() => {
      return data.stroe.getters.isLogin;
    });
    //-----methods
    async function onGetLyric() {
      await getPlayInfoApi({ MusicId: data.route.params.Id }).then((res: any) => {
        if (res.code == 0) {
          data.lrcData = onFormatLyric(res.data.Lyric);
        }
      });
    }
    function onLoadedmetadata(res: any) {
      data.bWaitting = false;
      console.log("loadedmetadata");
      data.audio.maxTime = realFormatSecond(res.target.duration);
      data.audio.maxSliderTime = res.target.duration * 1000;
      data.audioref.volume = data.audio.volume / 100;
      onGetLyric();
      console.log(data.lyricParent.scrollTop);
    }
    function onTimeupdate(res: any) {
      console.log("timeupdate");
      if (!data.bWaitting) {
        data.audio.currentTime = res.target.currentTime;
        data.audio.sliderTime = res.target.currentTime * 1000;
        onUpDataLyric();
      }
    }
    function onUpDataLyric() {
      var curTime = parseInt(data.audio.currentTime + "");
      for (let index = 0; index < data.lrcData.length; index++) {
        let nowTime, nextTime, lastTime;
        nowTime = parseInt(data.lrcData[index].time);
        if (index == 0) {
          lastTime = parseInt(data.lrcData[index].time);
        } else {
          lastTime = parseInt(data.lrcData[index - 1].time);
        }
        if (index == data.lrcData.length - 1) {
          nextTime = parseInt(data.lrcData[index].time);
        } else {
          nextTime = parseInt(data.lrcData[index + 1].time);
        }
        if (curTime >= lastTime && curTime <= nextTime) {
          data.tempIndex = index;
          break;
        }
      }
    }
    function onWaitting(res: any) {
      console.log("onWaitting");
      console.log(res);
    }
    function onError(res: any) {
      console.log("onError");
      console.log(res);
      data.audio.playing = false;
      data.audioref.pause();
    }
    function onEnd() {
      // 播放下一曲
      console.log("onEnd");
      data.audioref.play();
    }
    function onPlay() {
      data.audio.playing = !data.audio.playing;
      // 播放
      if (data.audio.playing) {
        data.audioref.play();
        return;
      }
      // 暂停
      data.audioref.pause();
    }
    function changeVolume() {
      data.audioref.volume = data.audio.volume / 100;
    }
    function changeCurrentTime() {
      console.log(data.tempIndex);
      data.audioref.currentTime = data.audio.sliderTime / 1000;
      onUpDataLyric();
    }
    async function operate(type: number) {
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
    watch(
      () => data.tempIndex,
      (val) => {
        if (val >= 7) {
          let tempTop = 24 * (val - 7);
          data.lyricParent.scrollTop = tempTop;
        } else if (val == 0) {
          data.lyricParent.scrollTop = 0;
        }
      }
    );
    const platStatus = computed(() => {
      return data.audio.playing;
    });
    return {
      ...toRefs(data),
      onLoadedmetadata,
      onTimeupdate,
      onWaitting,
      onError,
      onEnd,
      onPlay,
      realFormatSecond,
      platStatus,
      changeVolume,
      changeCurrentTime,
      getUrl,
      operate,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.el-slider__bar) {
  background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
}
:deep(.el-slider__button) {
  width: 15px;
  height: 15px;
  background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
  border: none;
}
.detailsPlayer {
  position: relative;

  .bg-audio {
    width: 100%;
    height: 550px;
    object-fit: fill;
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    z-index: 0;
  }
  .content-box {
    position: relative;
    z-index: 1;
    height: 550px;
    padding: 30px 0px 20px 0px;
    display: flex;
    flex-direction: column;
  }
  .audio-name {
    height: 30px;
    font-size: 22px;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 20px;
    text-align: center;
  }
  .operate-box {
    position: absolute;
    right: 20px;
    top: 20px;
    .iconfont {
      font-size: 22px;
      margin-left: 15px;
      color: #d6d6d3;
      cursor: pointer;
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
    }
  }
  .lrc-box {
    overflow-y: scroll;
    // height: 400px;
    flex-grow: 1;
    position: relative;
    scroll-behavior: smooth;
    max-width: 100%;
    // 背景模糊
    // &:after {
    //     content: "";
    //     width: 100%;
    //     height: 100%;
    //     position: absolute;
    //     left: 0;
    //     top: 0;
    //     background: inherit;
    //     filter: blur(2px);
    //     z-index: 2;
    // }
    &::-webkit-scrollbar {
      display: none;
    }
    .lyric {
      position: relative;
      p {
        text-align: center;
        margin-bottom: 5px;
        color: rgba($color: #ffffff, $alpha: 0.8);
        font-size: 14px;
        font-weight: 300;
        &.heightLight {
          font-weight: 600 !important;
          font-size: 18px;
          font-weight: 500;
          color: rgba($color: #ffffff, $alpha: 1);
        }
      }
    }
  }
  .audio-slide-box {
    padding: 0px 20px;
    .audio-operate-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      margin-bottom: 16px;
      .operate-left {
        font-size: 12px;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        .iconfont {
          margin-right: 15px;
          font-size: 18px;
          cursor: pointer;
        }
      }
      .operate-right {
        display: flex;
        .iconfont {
          margin-left: 25px;
          font-size: 16px;
          cursor: pointer;
        }
        .volume-box {
          position: relative;
          &:hover {
            .volume-slide {
              display: block;
            }
          }
          .volume-slide {
            display: none;
            position: absolute;
            bottom: 0px;
            height: 130px;
            left: 15px;
            padding-bottom: 30px;
            &:hover {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
