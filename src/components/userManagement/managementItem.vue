<template>
  <div class="management-item flex-middle-between">
    <input id="demoInput" style="position: fixed;left:-100px;top:-100px;opacity:0">
    <commentModal :musicInfo="musicInfo" ref="comment" />
    <div class="action-btn" v-if="type==1" @click="findDetails(itemInfo.id)">查看详情</div>
    
    <div class="type-sold-out" v-if="type == 3 && itemInfo.State == 10062">
      <el-image style="width: 150px; height: 116px" :src="soldOut" fit="cover"></el-image>
    </div>
    <el-image :src="getUrl(itemInfo.MusicCover || itemInfo.cover || itemInfo.Cover)" fit="cover" class="music-picture"></el-image>
    <div class="item-data">
      <!-- <div class="player"><i style="font-size: 12px;" class="iconfont icon-bofang"/>11.22</div> -->
      <div class="music-name flex-middle-between">
        <div class="flex">
        <!-- {{itemInfo.musicNftTitle}} -->
          <span v-if="type==3">{{itemInfo.MusicTitle}}-{{itemInfo.MusicTitle}}</span>
          <span v-else class="">{{itemInfo.NftTitle || (itemInfo.name + '-' + itemInfo.singing)}}</span>
          <div class="status-box">
            <span class="success" v-if="itemInfo.State == 1 && type == 2">出售中</span>
            <span class="normal" v-if="itemInfo.State == 0 && type == 2">未出售</span>
            <span class="success" v-if="itemInfo.State == 10064">已上架</span>
            <span class="success" v-if="itemInfo.applyState == 10031">已发布</span>
            <span class="warning" v-if="itemInfo.applyState == 10032">审核中</span>
            <span class="error" v-if="itemInfo.applyState == 10033">未通过</span>
            <span class="error" v-if="itemInfo.State == 10062">已售罄</span>
            <span class="warning" v-if="itemInfo.State == 10061">铸造中</span>
            <span class="normal" v-if="itemInfo.State == 10065">未上架</span>
            <span class="normal" v-if="itemInfo.IsPrivate || itemInfo.isPrivate"> 仅我可见 </span>
            <span class="top" v-if="itemInfo.IsTop || itemInfo.isTop"> 置顶 </span>
          </div>
          
          <!-- <span v-if="type == 3" class="nft-batch"> {{itemInfo.NftTitle}} </span> -->
        </div>
        <span class="music-create-time" v-if="type == 3 || type == 1">{{dateFormat((itemInfo.CreateTime || itemInfo.createTime) * 1000, 'yy-MM-dd hh:mm')}}</span>
      </div>
      <div class="progress-box" v-if="type == 1">
        剩余比例
        <el-progress :percentage="parseInt((itemInfo.remainCopyrightProportion/100)+'')" class="progress" />
      </div>
      <div class="progress-box" v-if="type == 3">
        铸造占比
        <el-progress :percentage="itemInfo.CopyrightProportion/100" class="progress" color="RGBA(44, 208, 128, 1)">
          <template #default="scope"> 版权收益{{ (itemInfo.CopyrightProportion/100).toFixed(2) }}% </template>
        </el-progress>
      </div>
      <div class="types-box" v-if="type == 1">
        <template v-for="(item, index) in (itemInfo.labels || [])" :key="index">
          <span v-if="item">{{item}}</span>
        </template>
        
      </div>
      <p class="nft-label" v-if="type == 2"><span>拥有:</span>{{itemInfo.HoldCount}}个</p>
      <p class="nft-label" v-if="type == 2"><span>现在价格:</span>{{itemInfo.OfferMinPrice}}</p>
      <div class="operate-box flex-middle-between">
        <div class="count-box" v-if="type == 1">
          <span>
            <i class="iconfont icon-bofang"></i>
            {{itemInfo.playCount}}
          </span>
          <span>
            <i class="iconfont icon-dianzan"></i>
            {{itemInfo.likeCount}}
          </span>
          <span>
            <i class="iconfont icon-pinglun"></i>
            {{itemInfo.commentCount}}
          </span>
          <span>
            <i class="iconfont icon-shoucangjia"></i>
            {{itemInfo.collectionCount}}
          </span>
        </div>
        <p class="nft-label" v-if="type == 2"><span> 最新成交价格: </span>{{itemInfo.NewTranPrice}}</p>
        <p class="nft-label" v-if="type == 3">
          已售{{itemInfo.CastingCount - itemInfo.FreezeCount - itemInfo.HoldCount}}nft &nbsp;&nbsp;<span>/&nbsp;&nbsp;剩余{{itemInfo.FreezeCount + itemInfo.HoldCount}}nft </span>
        </p>
        <div class="more-box">
          <span v-if="type == 1" @click="toNFTIncome(itemInfo.id)">铸造NFT</span>
          <span @click="changeAccessShow(itemInfo)" v-if="type == 1">权限设置</span>
          <el-popover placement="bottom" trigger="hover">
            <template #reference>
              <span>{{ type == 1 ? "更多" : "操作" }}</span>
            </template>
            <div class="work-popover-box">
              <p v-if="type == 1" @click="findDetails(itemInfo.id)">修改</p>
              <!-- <p v-if="type == 1">分享</p> -->
              <!-- 置顶nft -->
              <p v-if="type == 2 && itemInfo.IsTop == 1" @click="setNftTop(itemInfo.Id || itemInfo.id, 0)">取消置顶</p>
              <p v-if="type == 2 && itemInfo.IsTop == 0" @click="setNftTop(itemInfo.Id || itemInfo.id, 1)">置顶</p>
              <!-- <p v-if="type == 1" @click="showModal">查看评论</p> -->
              <!-- 置顶音乐 -->
              <p v-if="type == 1 && itemInfo.isTop == 1" @click="musicTop(itemInfo.id, 0)">取消置顶</p>
              <p v-if="type == 1 && itemInfo.isTop == 0" @click="musicTop(itemInfo.id, 1)">置顶</p>
              <p v-if="type == 2 && itemInfo.State == 0" @click="sell(itemInfo.MusicId, itemInfo.MusicNftId)">出售NFT</p>
              <p v-if="type == 2 && itemInfo.State == 1" @click="cancelSell">取消出售NFT</p>
              <el-popover v-if="type == 2 || 1" placement="left" trigger="hover" width="320">
                <template #reference>
                  <p v-if="type == 2 || 1">分享NFT</p>
                  
                </template>
                <div class="share-box">
                  <div class="share">复制链接粘贴给微信/QQ好友</div>
                  <div>
                    <div class="share-btn">
                      <span>{{pathUrl + (itemInfo.MusicId || itemInfo.id)}}</span>
                      <button @click="copy(itemInfo.MusicId || itemInfo.id)">复制</button>
                    </div>
                  </div>
                </div>
              </el-popover>
              
              <!-- <p v-if="type == 2">转移NFT</p> -->
              <p v-if="type == 2 && itemInfo.IsPrivate == 0" @click="setNftPrivate(itemInfo.Id, 1)">设为仅我可见</p>
              <p v-if="type == 2 && itemInfo.IsPrivate == 1" @click="setNftPrivate(itemInfo.Id, 0)">取消仅我可见</p>
              <!-- <p v-if="type == 3">销售数据</p> -->
              <!-- <p v-if="type == 3" @click="clickAction(itemInfo)">回收比例</p> -->
              <p v-if="type == 3 && itemInfo.State == 10061 && itemInfo.State != 10064" :class="itemInfo.State == 10061 ? 'dis' : ''">上架</p>
              <p v-if="type == 3 && itemInfo.State == 10064">下架</p>
              <p v-if="type == 3" @click="edit(itemInfo.MusicId)">改价/编辑</p>
              <!-- <p @click="clickAction({name: 1})" v-for="item in moreList">{{ item }}</p> -->
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Edit } from "@element-plus/icons";
import { ElProgress, ElPopover, ElImage, ElMessage } from "element-plus";
import { defineComponent, reactive, toRefs, ref } from "vue";
import { useRouter } from "vue-router";
import { dateFormat, getUrl } from "@/utils/filter";
import commentModal from "./comment-modal.vue";
import { setUserNftTop, setUserNftPrivate, setMusicTop } from '@/api/apiManagement/userManagement';
// @ts-ignore
import soldOut from "@/assets/images/sold-out.png";
import store from "@/store";
export default defineComponent({
  name: "workItem",
  components: {
    Edit,
    ElProgress,
    ElPopover,
    ElImage,
    commentModal
  },
  props: {
    type: Number,
    itemInfo: {
      type: Object,
    },
    visible: {
      type: Boolean
    },
  },
  setup(props, content) {
    const state = reactive({
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      workDataList: ["icon-bofang", "icon-dianzan", "icon-pinglun", "icon-shoucangjia"],
      moreList: ["置顶", "取消出售", "分享", "置顶"],
      router: useRouter(),
      pathUrl: location.origin + '/musicDetails/',
      musicInfo: {}
    });
    function changeAccessShow(item: any) {
      content.emit("changeAccessShow", item);
    }
    const comment = ref();
    const showModal = () => {
      state.musicInfo = props.itemInfo;
      comment.value.id = props.itemInfo.id;
      
      comment.value.resetCommet();
      comment.value.drawer = true;
    }
    const toNFTIncome = (id: number) => {
      state.router.push({ name: "NFTIncome",params:{id} });
    };
    const clickAction = (obj: object): void => {
      content.emit('update:visible', true)
      content.emit('changeSelectItem', obj)
    }
    const musicTop = (id: number, istop: number): void => {
      setMusicTop({
        musicId: id,
        isTop: istop
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('操作成功');
          content.emit('setNftTop')
        }
      })
    }
    const setNftTop = (id: number, istop: number): void => {
      setUserNftTop({
        Id: id,
        IsTop: istop
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('操作成功');
          content.emit('setNftTop')
        }
      })
    }
    const setNftPrivate = (id: number, isPrivate: number): void  => {
      setUserNftPrivate({
        Id: id,
        IsPrivate: isPrivate
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success('操作成功');
          content.emit('setNftTop')
        }
      })
    }
    const copy = (id: number): void => {
      // http://localhost/musicDetails/1
      let demoInput:any = document.getElementById('demoInput');
      demoInput.value = state.pathUrl + id;
      demoInput.select();
      document.execCommand('copy');
      ElMessage.success('复制成功')
    }
    const findDetails = (id: number): void => {
      let url = '';
      if (props.itemInfo.type == 10041) {
        url = '/publication/singer';
      } else if (props.itemInfo.type == 10042) {
        url = '/publication/cover'
      } else if (props.itemInfo.type == 10043) {
        url = '/publication/accompaniment'
      } else {
        url = '/publication/singer';
      }
      state.router.push(url + '?id=' + id)
    }
    const edit = (id: number): void => {
      state.router.push('/NFTIncome/' + id)
    }
    const sell = (id: number, MusicNftId: number) => {
      content.emit('sell', id, MusicNftId)
    }
    const cancelSell = () => {
      content.emit('cancel')
    }
    return {
      ...toRefs(state),
      changeAccessShow,
      soldOut,
      toNFTIncome,
      showModal,
      comment,
      dateFormat,
      clickAction,
      setNftTop,
      setNftPrivate,
      copy,
      getUrl,
      findDetails,
      musicTop,
      sell,
      edit,
      cancelSell
    };
  },
});
</script>

<style lang="scss" scoped>
.share-box{
  // width: 300px;
  padding: 10px;
  .share{
    margin-bottom: 10px;
    width: 300px;
    font-size: 14px;
    color: #666666;
    
  }
  .share-btn{
      width: 270px;
      height: 32px;
      background-color: #eff0f3;
      position: relative;
      border-radius: 4px;
      display: flex;
      span{
        width: 220px;
        height: 32px;
        overflow-x: auto;
        color: #a2a3a7;
        white-space: nowrap;
        font-size: 14px;
        padding: 4px 8px;
      }
      button{
        width: 50px;
        height: 32px;
        background-color: #7faaff;
        color: #ffffff;
        font-size: 14px;
        border: 0 none;
        border-radius: 0px 4px 4px 0px;
        outline: none;
      }
    }
}

.dis{
  background: #F5F4F4;
  color: #D8D8D8;
}
.management-item {
  padding: 20px 0px;
  border-bottom: 1px solid #ebebff;
  position: relative;
  .action-btn{
    position: absolute;
    width: 124px;
    height: 40px;
    text-align: center;
    background: #EFEFEF;
    cursor: pointer;
    border-radius: 20px;
    line-height: 40px;
    text-align: center;
    right: 0;
    font-size: 14px;
    font-weight: bold;
    z-index: 10;
    color: #333333;
  }
  .type-sold-out {
    position: absolute;
    z-index: 1;
    right: 0px;
    top: 0px;
    left: 0px;
    bottom: 0px;
    background-color: rgba($color: #fff, $alpha: 0.7);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10%;
  }
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
    position: relative;
    .player{
      position: absolute;
      width: 60px;
      height: 20px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      left: -70px;
      bottom: 12px;
      cursor: pointer;
    }
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
      align-items: center;
      .nft-batch {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
      }
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
        padding: 0 10px;
        // width: 50px;
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
