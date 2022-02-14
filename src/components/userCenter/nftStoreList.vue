<template>
  <div class="nftstorelist">
    <div class="nftstore-content">
      <div class="main">
        <div class="nftstore-img">
          <img :src="getUrl(itemInfo.MusicCover)" alt="" />
          <i class="icon-like iconfont icon-dianzan"></i>
          <span>{{ itemInfo.IsCollection }}</span>
          <i class="icon-play iconfont icon-bofang"></i>
        </div>
        <h1>{{ itemInfo.NftTitle }}</h1>
        <div class="icon-Topping" v-if="itemInfo.IsTop == 1">置顶</div>
        <p style="margin-top: 34px;flex" v-if="itemInfo.IsTop == 0">
          拥有{{ itemInfo.HoldCount }}个
        </p>
        <p style="margin-top: 8px;flex" v-else>拥有{{ itemInfo.HoldCount }}个</p>
        <div
          class="flex flex-justify-content-between flex-align-items-center"
          style="margin-top: 6px"
        >
          <p>现有价格</p>
          <span>{{ itemInfo.OfferMinPrice }}</span>
        </div>
        <div
          class="flex flex-justify-content-between flex-align-items-center"
          style="margin-top: 6px"
        >
          <p>最新成交价</p>
          <span>{{ itemInfo.NewTranPrice }}</span>
        </div>
        <div class="flex flex-justify-content-between flex-align-items-center">
          <el-button type="text" @click="centerDialogVisible = true"
            ><img
              src="@/assets/images/nft-check.png"
              alt=""
              class="icon-see"
              @click="clickNft(itemInfo.Id)"
          /></el-button>
          <p class="work-details" @click="viewDetails(itemInfo.MusicId)">作品详情</p>
        </div>
      </div>
      <div class="btn-bottom" @click="operation">操作</div>
    </div>
    <el-dialog v-model="centerDialogVisible" custom-class="checkNft">
      <svg-icon
        iconClass="shanchu"
        className="icon-shanchu"
        @click="centerDialogVisible = false"
      ></svg-icon>
      <h1>NFT信息</h1>
      <div class="flex flex-justify-content-between" style="margin-top: 52px; width: 504px">
        <p style="margin-left: 22px">NFT名字</p>
        <p style="margin-right: 22px">{{ list.title }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">铸造者</p>
        <p style="margin-right: 22px">{{ list.minter }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">拥有者</p>
        <p style="margin-right: 22px">{{ list.owner }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">铸造时间</p>
        <p style="margin-right: 22px">{{ dateFormat(list.mintTime, "yyyy-MM-dd hh:mm:ss") }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 30px; width: 504px">
        <p style="margin-left: 22px">合约地址</p>
        <p style="margin-right: 22px">{{ list.contract }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">Token ID</p>
        <p style="margin-right: 22px">{{ list.tokenIdStr }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">区块链</p>
        <p style="margin-right: 22px">{{ list.blockChain }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">内容哈希</p>
        <p style="margin-right: 22px">{{ list.hash }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { checkNft } from "@/api/apiManagement/userManagement";
import { dateFormat, getUrl } from "@/utils/filter";

export default defineComponent({
  name: "nftstorelist",
  props: {
    type: Number,
    itemInfo: {
      type: Object,
    },
  },
  setup(props) {
    const data = {
      router: useRouter(),
    };
    const state = reactive({
      total: "",
      stroe: useStore(),
      list: [],
    });
    const centerDialogVisible = ref(false);
    const operation = () => {
      data.router.push({ name: "ManagementNFTStore" });
    };
    const viewDetails = (Id: number) => {
      data.router.push({ name: "musicDetails", params: { Id } });
    };

    //点击查看nft
    const clickNft = (index: number) => {
      checkNft({
        id: index,
      }).then((res) => {
        state.list = res.data;
      });
    };
    return {
      centerDialogVisible,
      operation,
      viewDetails,
      ...toRefs(state),
      clickNft,
      dateFormat,
      getUrl,
    };
  },
});
</script>

<style lang="scss" scoped>
.nftstorelist {
  margin-top: 24px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  .nftstore-content {
    width: 260px;
    border: 1px solid #ebebff;
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
      background-color: #ffffff;
      position: relative;
      top: -6px;
      box-shadow: 0px 0px 4px #000000;
    }
    .main {
      width: 260px;
      height: 427px;
      padding: 20px 20px 0 20px;
      box-sizing: border-box;
      .nftstore-img {
        width: 220px;
        height: 220px;
        position: relative;
        img {
          width: 220px;
          height: 220px;
          position: absolute;
        }
        .icon-like {
          width: 22px;
          height: 22px;
          font-size: 20px;
          padding: 5px;
          cursor: pointer;
          position: absolute;
          left: 12px;
          bottom: 13px;
          &.icon-dianzan {
            color: RGBA(255, 112, 112, 1);
          }
        }
        .icon-play {
          width: 31px;
          height: 31px;
          position: absolute;
          bottom: 5px;
          right: 9px;
          text-align: center;
          line-height: 31px;
          color: #fff;
        }
        span {
          font-size: 14px;
          color: #ffffff;
          position: absolute;
          left: 42px;
          bottom: 13px;
        }
      }
      h1 {
        font-size: 16px;
        color: #333333;
        margin-top: 10px;
      }
      .icon-Topping {
        width: 38px;
        height: 20px;
        background-color: #000000;
        border-radius: 2px;
        color: #ffffff;
        font-size: 12px;
        text-align: center;
        line-height: 20px;
        margin-top: 6px;
      }
      p {
        font-size: 14px;
        color: #777777;
      }
    }
    .btn-bottom {
      width: 260px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      color: #333333;
      background-color: #f7f8fa;
      border: 1px solid #ebebff;
      box-sizing: border-box;
    }
    .icon-see {
      width: 80px;
      color: 32px;
    }
    .work-details {
      font-size: 12px;
      color: #7faaff;
    }
  }
}
</style>
<style lang="scss">
.checkNft {
  width: 548px;
  height: 433px;
  background-image: url(@/assets/images/popupBackground.png) !important;
  background-size: 100% !important;
  background-color: transparent !important;
  position: relative;
  border: 0px solid rgba(8, 8, 8, 0.31);
  .el-dialog__header {
    display: none;
  }
  .icon-shanchu {
    position: absolute;
    top: 47px;
    right: 25px;
    cursor: pointer;
  }
  h1 {
    text-align: center;
    font-size: 28px;
    color: #ffffff;
    margin-top: 10px;
  }
  p {
    font-size: 14px;
    color: #ffffff;
  }
}
</style>
