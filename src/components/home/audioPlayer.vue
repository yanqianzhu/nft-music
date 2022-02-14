<template>
  <div
    class="audio-player"
    ref="audioPlayerBox"
    :class="{ hidden: !audioShow }"
    v-if="playerList.length > 0"
  >
    <audio
      ref="audioref"
      @loadedmetadata="onLoadedmetadata"
      @timeupdate="onTimeupdate"
      @waiting="onWaitting"
      @error="onError"
      @ended="onEnd"
      @playing="playing"
      autoplay
      :src="getUrl(musicInfo.MusicUrl)"
    >
      您的浏览器不支持音频播放
    </audio>
    <div class="audio-player-info" v-show="audioShow">
      <el-image class="player-cover" :src="getUrl(musicInfo.Cover)" fit="cover"></el-image>
      <div class="player-info-box">
        <p class="ellipsis">{{ musicInfo.Name }}</p>
        <div class="player-change-box">
          <i class="iconfont icon-shangyishou" @click="cutSong(false)"></i>
          <p class="player-icon-box" @click="onPlay">
            <i class="iconfont" :class="platStatus ? 'icon-zanting' : 'icon-bofang'"></i>
          </p>
          <i class="iconfont icon-xiayishou" @click="cutSong(true)"></i>
        </div>
        <p class="player-time">
          {{ realFormatSecond(audio.currentTime) + "/" + audio.maxTime }}
        </p>
        <el-slider
          v-model="audio.sliderTime"
          :max="audio.maxSliderTime"
          @change="changeCurrentTime"
          :show-tooltip="false"
          style="
            --el-slider-height: 4px;
            --el-slider-button-wrapper-size: 8px;
            --el-slider-button-wrapper-offset: -8px;
            --el-slider-margin: 0px;
          "
        ></el-slider>
      </div>
    </div>
    <div class="lrc-box" ref="lyricParent" v-show="audioShow">
      <template v-if="lrcLoading">
        <div>歌词加载中...</div>
      </template>
      <template v-else>
        <div class="lyric">
          <p v-for="(item, index) in lrcData" :class="{ heightLight: tempIndex === index }">
            {{ item.content }}
          </p>
        </div>
      </template>
    </div>
    <div class="player-opearte" v-show="audioShow">
      <i
        class="iconfont"
        :class="playModeList[modeIndex].iconfont"
        :title="playModeList[modeIndex].label"
        @click="setModeIndex"
      ></i>
      <div class="voice-box">
        <i class="iconfont icon-lababofang"></i>
        <el-slider
          v-model="audio.volume"
          :format-tooltip="voiceFormatTooltip"
          :show-tooltip="false"
          @input="changeVolume"
          style="
            --el-slider-height: 4px;
            --el-slider-button-wrapper-size: 8px;
            --el-slider-button-wrapper-offset: -8px;
            --el-slider-margin: 0px;
          "
        ></el-slider>
      </div>
    </div>
    <div class="hide-btn" @click="changeShow">
      <i class="iconfont" :class="audioShow ? 'icon-shouqi1' : 'icon-zhankai1'"></i>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, computed } from "vue";
import { onFormatLyric } from "@/utils/audio";
import { getUrl, RandomNumBoth, realFormatSecond } from "@/utils/filter";
//@ts-ignore
import daan from "@/assets/music/daan.mp3";
import { useStore } from "vuex";
import { getPlayInfoApi } from "@/api/apiManagement/audio";
import emitter from "@/utils/mitt";

export default defineComponent({
  name: "audioPlayer",
  setup() {
    const data = reactive({
      playModeList: [
        { iconfont: "icon-xunhuanbofang", label: "列表循环" },
        { iconfont: "icon-danquxunhuan", label: "单曲循环" },
        { iconfont: "icon-suiji", label: "随机播放" },
      ],
      modeIndex: 0, // 0 列表 1单曲 2随机
      lrcData: [],
      currentIndex: 0, // 当前播放
      // 播放器参数
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
      tempIndex: 0, // 所播放歌词行数
      audioref: null,
      audioShow: true,
      audioPlayerBox: null,
      store: useStore(),
      lrcLoading: false, // lrc loading
    });
    //----------methods
    // 获取解析歌词
    function onGetLyric() {
      data.lrcData = onFormatLyric(musicInfo.value.lyric);
    }
    function voiceFormatTooltip(value: any) {
      return value;
    }
    function setModeIndex() {
      if (data.modeIndex == 2) {
        data.modeIndex = 0;
        return;
      }
      data.modeIndex++;
    }
    function onLoadedmetadata(res: { target: { duration: number } }) {
      data.bWaitting = false;
      data.audio.maxTime = realFormatSecond(res.target.duration);
      data.audio.maxSliderTime = res.target.duration * 1000;
      onGetLyric();
    }
    function onTimeupdate(res: { target: { currentTime: number } }) {
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
      cutSong(true);
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
    function changeShow() {
      data.audioShow = !data.audioShow;
    }
    function playing() {
      data.audio.playing = true;
      emitter.emit("changePlayStatus", musicInfo.value);
    }
    /**
     * @description 切歌
     * @param true 下一首 false 上一首
     *  0 列表 1单曲 2随机
     */
    function cutSong(type: boolean) {
      switch (data.modeIndex) {
        case 2:
          data.currentIndex = RandomNumBoth(0, playerList.value.length - 1);
          break;
        default:
          if (type) {
            if (data.currentIndex == playerList.value.length - 1) {
              data.currentIndex = 0;
            } else {
              data.currentIndex++;
            }
          } else {
            if (data.currentIndex == 0) {
              data.currentIndex = playerList.value.length - 1;
            } else {
              data.currentIndex--;
            }
          }
          break;
      }
    }
    /**
     * @description audio 重载
     */
    function audioLoad() {
      data.audioref.load();
      data.audio.playing = false;
      data.tempIndex = 0;
      onPlay();
    }

    // ------------computed
    const platStatus = computed(() => {
      return data.audio.playing;
    });
    const playerList = computed(() => {
      return data.store.getters.playerList;
    });
    const musicInfo = computed(() => {
      return playerList.value[data.currentIndex];
    });
    const currentPlayerIndex = computed(() => {
      return data.store.getters.currentPlayerIndex;
    });
    //-------------watch
    watch(
      () => data.tempIndex,
      (val) => {
        if (val >= 3) {
          let tempTop = 21 * (val - 1);
          data.lyricParent.scrollTop = tempTop;
        } else if (val == 0) {
          data.lyricParent.scrollTop = 0;
        }
      }
    );
    watch(
      () => data.audioShow,
      (val, old) => {
        if (val) {
          setTimeout(() => {
            data.audioPlayerBox.style.minWidth = "1200px";
          }, 450);
        } else {
          data.audioPlayerBox.style.minWidth = "50px";
        }
      }
    );
    watch(
      () => data.currentIndex,
      (val, old) => {
        data.store.commit("setCurrenyPlayerIndex", val);
      }
    );
    watch(
      () => currentPlayerIndex.value,
      (val) => {
        data.currentIndex = val;
      }
    );
    watch(musicInfo, (val) => {
      data.lrcLoading = true;
      getPlayInfoApi({ MusicId: val.Id })
        .then((res: any) => {
          if (res.code == 0) {
            val.lyric = res.data.Lyric;
            onGetLyric();
            audioLoad();
          }
        })
        .then(() => {
          data.lrcLoading = false;
          console.log(musicInfo.value);
        });
    });
    emitter.on("audioPlayer", (item) => {
      console.log(item);
    });
    return {
      ...toRefs(data),
      voiceFormatTooltip,
      setModeIndex,
      onLoadedmetadata,
      onTimeupdate,
      onWaitting,
      onError,
      onEnd,
      daan,
      onPlay,
      realFormatSecond,
      platStatus,
      changeVolume,
      changeCurrentTime,
      changeShow,
      playerList,
      cutSong,
      musicInfo,
      getUrl,
      playing,
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

.audio-player {
  width: 100%;
  height: 120px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 201;
  background-color: #fff;
  padding: 15px 0px;
  padding-left: 50px;
  border: 1px solid #eee;
  box-shadow: 5px 0px 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  overflow-y: hidden;
  transition: ease 0.5s width;
  &.hidden {
    width: 50px;
    padding: 0;
  }
  audio {
    display: none;
  }
  .audio-player-info {
    display: flex;
    width: 25%;
    flex-shrink: 0;
    .player-cover {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }
    .player-info-box {
      padding-left: 15px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-shrink: 0;
      max-width: calc(100% - 80px);
      .player-change-box {
        display: flex;
        align-items: center;
        .icon-shangyishou,
        .icon-xiayishou {
          font-size: 22px;
          cursor: pointer;
          &:hover {
            color: rgb(85, 196, 135);
          }
        }
        .player-icon-box {
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 25px;
          height: 25px;
          background-color: rgba($color: #000000, $alpha: 0.1);
          margin-right: 15px;
          margin-left: 15px;
          cursor: pointer;
          &:hover {
            background-color: rgba($color: #000000, $alpha: 0.2);
          }
          .iconfont {
            font-size: 13px;
            &.icon-zanting {
              font-size: 12px;
            }
          }
        }
      }
      .player-time {
        text-align: right;
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
  .lrc-box {
    flex-grow: 1;
    overflow-y: scroll;
    height: 90px;
    position: relative;
    scroll-behavior: smooth;
    max-width: 49%;
    &::-webkit-scrollbar {
      display: none;
    }
    .lyric {
      position: relative;
      p {
        text-align: center;
        margin-bottom: 5px;
        font-size: 12px;
        font-weight: 400;
        color: rgba($color: #000000, $alpha: 0.8);
        &.heightLight {
          font-weight: 600 !important;
          font-size: 14px;
          font-weight: 400;
          color: rgba($color: #000000, $alpha: 1);
        }
      }
    }
  }
  .player-opearte {
    width: 20%;
    margin-right: 9%;
    display: flex;
    .iconfont {
      font-size: 16px;
    }
    .voice-box {
      display: flex;
      flex-grow: 1;
      align-items: center;
      .icon-lababofang {
        flex-shrink: 0;
        font-size: 16px;
        margin-right: 13px;
        margin-left: 40px;
      }
      .el-slider {
        flex-grow: 1;
      }
    }
  }
  .hide-btn {
    width: 50px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
    justify-content: center;
  }
}
</style>
<style lang="scss">
.audio-player {
  .el-slider__button {
    width: 8px !important ;
    height: 8px !important;
  }
}
</style>
