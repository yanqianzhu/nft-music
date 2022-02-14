<template>
  <div class="audio-box">
    <audio
      ref="audio"
      @loadedmetadata="onLoadedmetadata"
      @timeupdate="onTimeupdate"
      @waiting="onWaitting"
      @error="onError"
      @ended="onEnd"
      :src="getUrl(item.Path)"
    >
      您的浏览器不支持音频播放
    </audio>
    <div class="video-container">
      <main class="video-container-main">
        <img :src="contentBg" class="video-contentbg" />
        <div class="left-box">
          <header>{{ item.Name }}</header>
          <article ref="audioLeft">
            <section ref="lyricParent">
              <template v-if="state.lyricData.length > 0">
                <p
                  v-for="(item, index) in state.lyricData"
                  :key="index"
                  :class="state.tempIndex === index ? 'heightLight' : ''"
                >
                  {{ item.content }}
                </p>
              </template>
              <template v-else>
                <span>暂未找到歌词~</span>
              </template>
            </section>
          </article>
        </div>
        <aside class="audio-summary">
          <h3>原创：{{ item.Original }}</h3>
          <h3>演唱：{{ item.Singing }}</h3>
          <h3>分类：{{ musicType[item.Type] }}</h3>
          <h3>语种：{{ getLabelString(10073) }}</h3>
          <h3>曲风：{{ getLabelString(10071) }}</h3>
          <h3>心情：{{ getLabelString(10072) }}</h3>
          <h4 class="download-setting">
            下载设置：{{ item.DownloadSettings ? "免费下载" : "不允许下载" }}
          </h4>
          <h4 class="upload-time">上传时间：{{ item.CreateTime }}</h4>
          <h3 class="now-price">目前价格：￥{{ item.UnitPrice }}</h3>
          <h3 class="desc">
            描述：
            <p>{{ item.Describe }}</p>
          </h3>
          <p class="detail">
            <span class="in-detail" @click="toDetails(item.Id)">
              进入详情
              <svg-icon iconClass="detail" className="icon-detail" />
            </span>
          </p>
        </aside>
        <ul class="audio-count">
          <li class="audio-avatar" @click="navigate(item.Id)">
            <img :src="getUrl(item.Cover)" />
            <svg-icon
              iconClass="add"
              className="icon-item icon-avatar"
              @click.stop="setFollow(item)"
              v-if="IsFollowed"
            />
          </li>
          <li @click="setStatus(0)">
            <i class="iconfont icon-wodeguanzhu" :class="{ active: item.IsLike == 1 }"> </i>
            <span>{{ item.LikeCount }}</span>
          </li>
          <li @click="changeShowComment">
            <svg-icon iconClass="comment" className="icon-item" />
            <span>{{ item.CommentCount }}</span>
          </li>
          <li @click="setStatus(1)">
            <i class="iconfont icon-shoucangjia" :class="{ active: item.IsCollection == 1 }"> </i>
            <span>{{ item.CollectionCount }}</span>
          </li>
          <li>
            <svg-icon iconClass="share" className="icon-item" />
            <span>{{ item.ShareCount }}</span>
          </li>
        </ul>
      </main>
      <!-- 底部功能 -->
      <footer>
        <div class="func">
          <div class="left">
            <svg-icon
              :iconClass="state.audio.playing ? 'pause' : 'player'"
              className="icon-player"
              @click="onPlay"
            />
            <p>
              {{ timeChange(state.audio.currentTime) }} /
              <span>{{ state.audio.maxTime }}</span>
            </p>
          </div>
          <div class="right">
            <!-- 音量按钮 -->
            <IconButton
              width="40px"
              height="140px"
              :iconName="state.voiceBtn.status ? state.voiceBtn.icon : state.voiceBtn.selectedIcon"
              @funcToggle="btnVoice"
            >
              <el-slider
                v-model="state.audio.volume"
                :format-tooltip="voiceFormatTooltip"
                @input="onChangeVolume"
                vertical
                height="110px"
              ></el-slider>
            </IconButton>
            <!-- 播放方式按钮 -->
            <IconButton
              :iconName="state.playerTypeBtn[playerTypeIndex].icon"
              :tips="state.playerTypeBtn[playerTypeIndex].tips"
              @funcToggle="btnPlayerType"
            ></IconButton>
            <!-- 全屏缩放按钮 -->
            <!-- <IconButton
              :iconName="state.zoomBtn.status ? state.zoomBtn.icon : state.zoomBtn.selectedIcon"
              :tips="state.zoomBtn.status ? state.zoomBtn.tips : state.zoomBtn.selectedTips"
              @funcToggle="btnZoom"
            ></IconButton> -->
            <i class="iconfont icon-jubao" @click="reportDialogShow = true"></i>
          </div>
        </div>
        <el-slider
          v-model="state.audio.sliderTime"
          :max="state.audio.maxSliderTime"
          :format-tooltip="progressFormatTooltip"
          @change="changeCurrentTime"
        ></el-slider>
      </footer>
    </div>
    <comment class="audio-comment" ref="commentCom"></comment>
    <reportDialogVue v-model:reportDialogShow="reportDialogShow" :id="item.Id"></reportDialogVue>
  </div>
</template>

<script lang="ts">
export default {
  name: "Thumb",
};
</script>
<script lang="ts" setup>
import axios from "axios";
import { ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import IconButton from "./components/iconButton.vue";
// @ts-ignore
import timeChange from "@/views/collect/timeChange";
// @ts-ignore
import contentBg from "@/assets/images/bg_video.png";
import comment from "@/components/audioItem/comment.vue";
// @ts-ignore
import mp3Url from "@/assets/music/daan.mp3";
import { musicType } from "@/model/musicData";
import { ElMessage, inputEmits } from "element-plus";
import {
  getPlayInfoApi,
  setMusicCollectStatusApi,
  setMusicLikeStatusApi,
} from "@/api/apiManagement/audio";
import { onFormatLyric } from "@/utils/audio";
import { getUrl } from "@/utils/filter";
import { useStore } from "vuex";
import { follow } from "@/api/apiManagement/userManagement";
import reportDialogVue from "../public/reportDialog.vue";

const router = useRouter(); // 初始化路由
const route = useRoute(); // 初始化路由
const audio = ref(null); // 播放器ref
const lyricParent = ref(null); // 歌词容器ref
const audioUrl = ref(""); // 音乐资源url
const playerTypeIndex = ref(0); // 播放模式
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  index: Number,
});
const emit = defineEmits(["changeStatus"]);
const reportDialogShow = ref(false);
const state = reactive({
  router: useRouter(),
  // 声音开关
  voiceBtn: {
    status: true,
    icon: "voice-on",
    selectedIcon: "voice-off",
  },
  // 播放方式按钮
  playerTypeBtn: [
    {
      icon: "loop-list",
      tips: "列表播放",
    },
    {
      icon: "loop-single",
      tips: "单曲循环",
    },
    {
      icon: "loop-shuffle",
      tips: "随机播放",
    },
  ],
  // 缩放按钮
  zoomBtn: {
    status: true,
    icon: "zoom-on",
    selectedIcon: "zoom-off",
    tips: "进入全屏",
    selectedTips: "退出全屏",
  },
  icons: [
    {
      icon: "collect",
      count: props.item.LikeCount,
      callback: () => {},
    },
    {
      icon: "comment",
      count: props.item.CommentCount,
      callback: changeShowComment,
    },
    {
      icon: "share",
      count: props.item.ShareCount,
      callback: () => {},
    },
  ],
  // 播放器参数
  audio: {
    playing: false, // 播放状态
    currentTime: 0, // 当前时间
    maxTime: 0, // 最大时间
    sliderTime: 0, // 进度条当前值
    maxSliderTime: 0, // 进度条最大值
    volume: 50, // 音量
  },
  url: "", // 音乐资源
  lyricData: [], // 歌词数据
  tempIndex: 0, // 所播放歌词行数
  bWaitting: true,
  resUUID: "", // 资源唯一标识
  name: "", // 歌曲名字
  author: "", // 作者名字
  bgImage: "", // 背景图
  musicList: [], // 播放列表
  nextMusic: [], // 下一首的数据
  backMusic: [], // 上一首的数据
  tempPlayId: 1, // 当前播放的Id
  splitUrl: "http://192.168.0.224:8080/api/v1.0/cloud/auth",
  store: useStore(),
});

onGetMusicList();
/**
 * @description 评论图标点击事件，切换侧边抽屉显隐藏
 */
const commentCom: any = ref(null);
function changeShowComment() {
  commentCom.value.changeCommentShow();
}

/**
 * @description 前往详情页
 */
const toDetails = (Id: number) => {
  router.push({ name: "musicDetails", params: { Id } });
};

const navigate = (Id: number) => {
  state.router.push({ name: "userCenter", params: { userId: Id } });
};
/*
 * @description 获取音乐资源
 * function { onGetMusicList } 获取音乐列表
 * function { onGetLyric } 获取单曲音乐信息
 * function { onFormatLyric } 获取高亮行歌词
 * function { onUpDataLyric } 更新播放时间时更新高亮行歌词
 * function { onRefreshMusicData } 换歌更新数据
 */
function onGetMusicList() {
  state.musicList = [props.item];
  onRefreshMusicData();
}
function onGetLyric() {
  getPlayInfoApi({ MusicId: props.item.Id }).then((res) => {
    if (res.code == 0) {
      state.lyricData = onFormatLyric(res.data.Lyric);
    }
  });
}
onGetLyric();
function onUpDataLyric() {
  var curTime = parseInt(state.audio.currentTime);
  for (var index = 0; index < state.lyricData.length; index++) {
    if (state.tempIndex < index && parseInt(state.lyricData[index].time) == curTime) {
      state.tempIndex = index;
      break;
    }
  }
  if (state.tempIndex >= 8) {
    let tempTop = -40 * (state.tempIndex - 8) + "px";
    if (lyricParent.value) {
      lyricParent.value.style.top = tempTop;
      lyricParent.value.style.transition = "all 0.5s linear";
    }
  }
}
function onRefreshMusicData() {
  state.tempIndex = 0;
  state.backMusic.splice(0);
  state.nextMusic.splice(0);
  if (state.musicList.length > 0) {
    for (var index = 0; index < state.musicList.length; index++) {
      if (state.musicList[index].id < state.tempPlayId) {
        state.backMusic.push(state.musicList[index]);
      } else if (state.musicList[index].id > state.tempPlayId) {
        state.nextMusic.push(state.musicList[index]);
      } else {
        state.name = state.musicList[index].name;
        state.author = state.musicList[index].author;
        state.bgImage = state.musicList[index].image;
        state.url = state.musicList[index].Path;
        // state.url = mp3Url;
        state.resUUID = state.musicList[index].uuid;
      }
    }
  }
  if (playerTypeIndex.value == 2) {
    if (state.nextMusic.length == 0) {
      state.nextMusic.push(state.musicList[0]);
    }
    if (state.backMusic.length == 0) {
      state.backMusic.push(state.musicList[state.musicList.length - 1]);
    }
  }
}

const audioLeft = ref(0);
// function

/*
 * @description 播放方式
 * function { onGoBackLyric } 歌词回到第一行
 * function { onResetPlay } 单曲循环播放
 * function { onRandomPlay } 列表随机播放
 * function { onNext } 列表顺序播放
 */
function onGoBackLyric() {
  state.tempIndex = 0;
  if (lyricParent.value) {
    lyricParent.value.style.top = "0px";
  }
}
function onResetPlay() {
  state.audio.playing = true;
  state.audio.currentTime = 0;
  state.audio.sliderTime = 0;
  audio.value.play();
}
function onRandomPlay() {
  state.tempPlayId = Math.round(Math.random() * state.musicList.length);
  onRefreshMusicData();
}
function onNext() {
  console.log(state.tempPlayId);
  // state.tempPlayId = Number(state.tempPlayId)+1
  state.tempPlayId = state.tempPlayId + 1;
  console.log(state.musicList);
  console.log(state.tempPlayId);
  if (state.tempPlayId < state.musicList.length + 1) {
    onRefreshMusicData();
    return;
  }
  state.audio.playing = false;
}

/*
 * @description 播放器事件舰艇
 * function { onLoadedmetadata } 提示音频的元数据已加载并计算当前播放时间和进度条的值
 * function { onTimeupdate } 当视频播放位置已经改变，显示视频当前播放位置（一秒计）
 * function { onError } 音乐播放错误执行事件
 * function { onWaitting } 音乐加载执行事件
 * function { onEnd } 音乐播放结束执行事件
 */
function onLoadedmetadata(res: { target: { duration: number } }) {
  state.bWaitting = false;
  console.log("loadedmetadata");
  state.audio.maxTime = timeChange(res.target.duration);
  state.audio.maxSliderTime = res.target.duration * 1000;
  onGetLyric();
}
function onTimeupdate(res: { target: { currentTime: number } }) {
  console.log("timeupdate");
  if (!state.bWaitting) {
    state.audio.currentTime = res.target.currentTime;
    state.audio.sliderTime = res.target.currentTime * 1000;
    onUpDataLyric();
  }
}
function onWaitting(res: any) {
  console.log("onWaitting");
  console.log(res);
}
function onError(res: any) {
  console.log("onError");
  console.log(res);
}
function onEnd(res: any) {
  // 播放下一曲
  console.log("onEnd");
  console.log(res);
  if (playerTypeIndex.value === 1) {
    audio.value.loop = true;
  } else {
    audio.value.loop = false;
  }
  // 歌词返回
  onGoBackLyric();
  onPlayModel();
}

function getAudioPlaying() {
  return state.audio.playing;
}
/*
 * @description 音乐播放
 * function { onPlay } 播放开关
 * function { onBack } 上一曲
 */
function onPlay() {
  state.audio.playing = !state.audio.playing;
  // 播放
  if (state.audio.playing) {
    // state.audio.currentTime = 0;
    // state.audio.sliderTime = 0;
    audio.value.play();
    return;
  }
  // 暂停
  audio.value.pause();
}
function onBack() {
  state.tempPlayId = state.tempPlayId - 1;
  if (state.tempPlayId > 0) {
    onRefreshMusicData();
  }
}
/*
 * @description 声音控制
 * function { btnVoice } 静音开关
 * function { onChangeVolume } 改变音量
 */
function btnVoice() {
  state.voiceBtn.status = !state.voiceBtn.status;
  if (state.voiceBtn.status) {
    // 开启声音
    audio.value.volume = 1;
    state.audio.volume = 100;
    return;
  }
  // 关闭声音
  audio.value.volume = 0;
  state.audio.volume = 0;
}
function onChangeVolume() {
  audio.value.volume = state.audio.volume / 100;
}

/*
 * @description 播放方式控制
 * function { btnPlayerType } 改变播放方式
 * function { onPlayModel } 检验播放方式
 * function { onChangePlayState } 改变播放方式处理数据
 */
function btnPlayerType() {
  if (playerTypeIndex.value < 2) {
    playerTypeIndex.value++;
    return;
  }
  playerTypeIndex.value = 0;
}
function onPlayModel() {
  switch (playerTypeIndex.value) {
    case 0: // 全部循环
      console.log("全部循环");
      onNext();
      break;
    case 1: // 单曲循环
      console.log("单曲循环");
      onGoBackLyric();
      onResetPlay();
      break;
    case 2: // 随机循环
      console.log("随机循环");
      onRandomPlay();
      break;
  }
}
function onChangePlayState() {
  state.backMusic.splice(0);
  state.nextMusic.splice(0);
  if (state.musicList.length > 0) {
    for (var index = 0; index < state.musicList.length; index++) {
      if (state.musicList[index].id < state.tempPlayId) {
        state.backMusic.push(state.musicList[index]);
      } else if (state.musicList[index].id > state.tempPlayId) {
        state.nextMusic.push(state.musicList[index]);
      }
    }
  }
  if (playerTypeIndex.value !== 0) {
    if (state.nextMusic.length == 0) {
      state.nextMusic.push(state.musicList[0]);
    }
    if (state.backMusic.length == 0) {
      state.backMusic.push(state.musicList[state.musicList.length - 1]);
    }
  }

  if (!state.audio.playing) {
    onPlayModel();
  }
}

/*
 * @description 全屏控制
 * function { btnZoom } 全屏开关
 */
function btnZoom() {
  state.zoomBtn.status = !state.zoomBtn.status;
  if (state.zoomBtn.status) {
    // 进入全屏
    return;
  }
  // 退出全屏
}

/*
 * @description 进度条事件
 * function { changeCurrentTime } 变更播放进度触发事件
 * function { progressFormatTooltip } 初始化播放进度
 * function { voiceFormatTooltip } 音量初始化
 */
//
function changeCurrentTime() {
  console.log(state.tempIndex);
  audio.value.currentTime = state.audio.sliderTime / 1000;
  var curTime = parseInt(audio.value.currentTime);
  let playOver = true;
  for (var index = 0; index < state.lyricData.length; index++) {
    if (parseInt(state.lyricData[index].time) > curTime) {
      playOver = false;
      state.tempIndex = index - 1;
      if (state.tempIndex < 0) {
        state.tempIndex = 0;
      }
      break;
    } else if (parseInt(state.lyricData[index].time > curTime)) {
      playOver = false;
      state.tempIndex = index;
      break;
    }
  }
  if (playOver) {
    state.tempIndex = state.lyricData.length - 1;
  }
  console.log(state.tempIndex);
}
function progressFormatTooltip(value: number) {
  return timeChange(value / 1000);
}
function voiceFormatTooltip(value: any) {
  return value;
}
//-------------
//获取曲风
function getLabelString(type: number) {
  if (!props.item.Lables || props.item.Lables.length == 0) {
    return "";
  }
  const genreList = props.item.Lables.filter((item: { Type: number }) => item.Type == type);
  let result = genreList
    .map((element: { Lable: any }) => {
      return element.Lable;
    })
    .join(",");
  return result;
}
// 关注
async function setFollow(item: object) {
  if ((await state.store.dispatch("loginCheck")) as unknown as Boolean) {
    follow({
      followId: Number(item.UserId),
      action: !Boolean(item.IsFollowed),
    }).then((res: any) => {
      if (res.code == 0) {
        ElMessage.success("操作成功!");
        item.IsFollowed = Number(!Boolean(item.IsFollowed));
      } else {
        ElMessage.error(res.msg);
      }
    });
  }
}
const IsFollowed = computed(() => {
  return Boolean(props.item.IsFollowed) && props.item.UserId == state.store.getters.userInfo.UserId;
});

// 点赞 、收藏 0点赞1收藏
function setStatus(type: number) {
  let opt: any;
  let fun;
  if (type == 0) {
    opt = { BizType: 1, LikeId: props.item.Id, Opt: Number(!Boolean(props.item.IsLike)) };
    fun = setMusicLikeStatusApi;
  } else {
    opt = { MusicId: props.item.Id, Opt: Number(!Boolean(props.item.IsCollection)) };
    fun = setMusicCollectStatusApi;
  }
  fun(opt).then((res: any) => {
    if (res.code == 0) {
      emit("changeStatus", {
        value: opt.Opt,
        index: props.index,
        key: type == 0 ? "IsLike" : "IsCollection",
      });
    } else {
      ElMessage.error(res.msg);
    }
  });
}
</script>
<style lang="scss" scoped>
// element样式修改
:deep(.el-slider__bar) {
  background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
}
:deep(.el-slider__button) {
  width: 15px;
  height: 15px;
  background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
  border: none;
}
</style>
<style lang="scss" scoped>
@mixin hiddenScrollBar {
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
// 歌词高亮样式
.heightLight {
  color: red !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}
.audio-box {
  display: flex;
  flex-direction: row;
  height: 100%;
  .audio-comment {
    width: 40%;
    background: rgba(248, 249, 253, 1);
  }
}
.video-container {
  width: 100%;
  height: 100%;
  // background: url("@/assets/images/bg_video.png") no-repeat;
  // background-size: 100%;
  position: relative;
  .video-contentbg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
  }
  .video-container-main {
    width: 100%;
    height: 100%;
    display: flex;
    .left-box,
    aside {
      width: 50%;
      height: 100%;
      user-select: none;
    }
    .left-box {
      header {
        padding: 30px 0;
        font-size: 22px;
        font-weight: 500;
        color: #ffffff;
        position: relative;
        text-align: center;
      }
    }
    article {
      width: 100%;
      user-select: none;
      padding: 0px 80px;
      overflow-y: scroll;
      position: relative;
      height: 80%;
      display: flex;
      flex-direction: column;
      text-align: center;
      &::-webkit-scrollbar {
        display: none;
      }

      section {
        position: relative;
        // top: 0;
        // left: 50%;
        transform: translateX(0%);
        // overflow-y: scroll;
        @include hiddenScrollBar;
        p {
          font-size: 14px;
          font-weight: 300;
          color: #ffffff;
          line-height: 40px;
          transition: all 0.5s;
        }
      }
    }
    aside {
      padding: 0 8% 0 6%;
      position: relative;
      background: url("@/assets/images/bg_music.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 5.83%;
        width: 1px;
        bottom: 10%;
        background: rgba(234, 230, 230, 0.7);
      }
      h3,
      h4 {
        margin: 0;
        padding: 0;
        text-align: left;
        color: #fff;
        font-weight: 400;
      }
      h3 {
        font-size: 16px;
        margin-bottom: 16px;
      }
      h4 {
        font-size: 14px;
      }
      .download-setting {
        margin: 11px 0 15px;
      }
      .upload-time {
        padding-bottom: 23px;
        border-bottom: 1px dashed rgba($color: #fff, $alpha: 0.5);
      }
      .now-price {
        margin: 22px 0 10px;
      }
      .desc {
        p {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 300;
          color: #fff;
          overflow: hidden; /** 隐藏超出的内容 **/
          display: -webkit-box; /** 将对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 5; /**显示行数设置,示例为2行**/
        }
      }
      .detail {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 8px;
        font-weight: 300;
        color: #fff;
        .in-detail {
          display: flex;
          align-items: center;
          font-size: 12px;
          cursor: pointer;
          &:hover {
            color: #7faaff;
          }
          .icon-detail {
            margin-left: 5px;
            font-size: 20px;
          }
        }
      }
    }
    .audio-count {
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 1%;
      bottom: 16%;
      align-items: center;
      .audio-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        position: relative;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .icon-avatar {
          position: absolute;
          bottom: -10px;
          left: 10px;
        }
      }
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 22px;
        margin-top: 17px;
        cursor: pointer;
        .icon-item,
        .iconfont {
          font-size: 20px;
          color: #d6d6d3;
        }
        .iconfont {
          &.icon-wodeguanzhu {
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
        span {
          font-size: 12px;
          font-weight: 300;
          color: #ffffff;
        }
      }
    }
  }
  footer {
    width: 100%;
    height: 100px;
    padding: 20px;
    position: absolute;
    bottom: 0;
    .func {
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        .icon-player {
          font-size: 30px;
          position: relative;
          margin-right: 5px;
          cursor: pointer;
          opacity: 0.7;
          &:hover {
            opacity: 1;
          }
        }
        p {
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          user-select: none;
          span {
            opacity: 0.6;
          }
        }
      }
      .right {
        display: flex;
        .icon-jubao {
          color: #d6d6d3;
          position: relative;
          top: 13px;
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }
  }
}
@media screen and (max-width: 1600px) {
  .video-container .video-container-main article {
    height: 70%;
  }
  .video-container .video-container-main aside h3 {
    margin-bottom: 10px;
  }
  .video-container .video-container-main aside {
    justify-content: flex-start;
    padding-top: 20px;
  }
  .video-container .video-container-main aside .download-setting {
    margin: 0;
    margin-bottom: 10px;
  }
  .video-container .video-container-main aside .upload-time {
    padding-bottom: 10px;
  }
  .video-container .video-container-main aside .now-price {
    margin: 10px 0 10px;
  }
  .video-container .video-container-main aside .desc {
    margin: 0px;
  }
}
</style>
