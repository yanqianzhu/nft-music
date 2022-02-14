<template>
  <div class="music-details-box">
    <main class="music-details-main">
      <div class="main-box">
        <div class="main-left">
          <div class="music-player">
            <detailsPlayerVue
              :musicInfo="musicInfo"
              v-if="Object.keys(musicInfo).length > 0"
            ></detailsPlayerVue>
          </div>
          <p class="music-author" @click="toUserPage">
            铸造者:
            <img
              :src="getUrl(currentBatch.HeadShotPath)"
              style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 1px solid #ebebff;
                margin-right: 10px;
                margin-left: 10px;
              "
            />
            <!-- <el-avatar :size="60" :src="getUrl(currentBatch.HeadShotPath)"> </el-avatar
            > -->
            {{ currentBatch.NickName }}
          </p>
          <div class="des-box">
            <div class="des-tabs">
              <div class="tabs-box">
                <p v-for="(item, index) in tabs" class="tabs-item" @click="tabsActiveIndex = index">
                  {{ item.label }}
                </p>
                <span class="bottom-slide" :style="{ left: linePos }"></span>
              </div>
              <div
                class="des-content"
                v-for="(item, index) in tabs"
                v-show="index == tabsActiveIndex"
              >
                <p class="des-label">{{ item.deslabel }}</p>
                <p class="describe">
                  <template v-if="index == 0">
                    {{ currentBatch.Describe }}
                  </template>
                  <template v-else-if="index == 1">
                    <p v-for="des in item.describe">
                      {{ des }}
                    </p>
                  </template>
                  <template v-else-if="index == 2">
                    {{ item.describe }}
                  </template>
                </p>
              </div>
            </div>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="铸造者信息" name="0">
                <template #title>
                  <span style="padding-left: 30px">铸造者信息</span>
                </template>
                <div class="collapse-content">
                  <div class="user-info">
                    <el-avatar :size="42" :src="getUrl(currentBatch.HeadShotPath)"></el-avatar>
                    <p class="multi-ellipsis--l2">
                      {{ currentBatch.Introduction }}
                    </p>
                  </div>
                  <div class="link-box">
                    <template v-for="item in linkList">
                      <span v-if="item.link !== ''" class="link-item" @click="openPage(item.link)">
                        <img :src="item.iconfont" />
                      </span>
                    </template>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="main-right">
          <p class="nft-name">
            <span>{{ musicInfo.MusicName }}</span>
            <span>版权收益NFT</span>
          </p>
          <p class="nft-count-box">
            <span class="count-item" v-for="(item, index) in nftNumList">
              <i class="iconfont" :class="item.iconfont"></i>
              {{ getNFTRender(index) }}
            </span>
          </p>
          <p class="sell-money">
            价格：
            <span>￥{{ price }}</span>
          </p>
          <div class="version-box">
            <p class="version-label">版本</p>
            <div class="version-item-box" :class="{ 'no-data-box': nftBatchList.length <= 0 }">
              <template v-if="nftBatchList.length > 0">
                <p
                  class="version-item ellipsis"
                  v-for="(item, index) in nftBatchList"
                  :class="{ active: nftBatchIndex == index }"
                  @click="nftBatchIndex = index"
                >
                  {{ item.Title }}
                </p>
              </template>
              <template v-else>
                <div class="no-data">
                  <img src="@/assets/images/no-data.png" />
                  <p>暂无数据</p>
                </div>
              </template>
            </div>
          </div>
          <div class="trade-box">
            <p class="trade-label">
              <span :class="{ active: tradeType == 0 }" @click="changeTradeType(0)">出售</span>
              <span :class="{ active: tradeType == 1 }" @click="changeTradeType(1)">求购</span>
            </p>
            <div class="order-box">
              <p class="title-box">
                <span v-for="item in orderTable">{{ item }}</span>
              </p>
              <div
                class="order-content-box"
                :class="{
                  'no-data-box': (tradeType == 0 ? sellListData : buyListData).length <= 0,
                }"
                v-infinite-scroll="tradeType == 0 ? getSellList : getBuyList"
              >
                <template
                  v-if="
                    (tradeType == 0 ? sellListData : buyListData).length &&
                    (tradeType == 0 ? sellListData : buyListData).length > 0
                  "
                >
                  <p
                    v-for="(item, index) in tradeType == 0 ? sellListData : buyListData"
                    class="order-item title-box"
                    @click="setOrderIndex(index)"
                    :class="{ active: tradeType == 0 ? index == sellIndex : index == buyIndex }"
                  >
                    <span class="ellipsis">{{ item.one_percent_price / 100 }}</span>
                    <span class="ellipsis">{{ item.unit_price }}</span>
                    <span class="ellipsis">{{ item.count }}</span>
                    <span class="ellipsis">{{ getDiffTime(item.create_time, item.end_time) }}</span>
                    <span class="user ellipsis">
                      <img :src="getUrl(item.head_shot_path)" />
                      {{ item.nick_name }}
                    </span>
                  </p>
                </template>
                <template v-else>
                  <div class="no-data">
                    <img src="@/assets/images/no-data.png" />
                    <p>暂无数据</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <template v-if="sellListData.length > 0">
            <div class="sell-user-info">
              <el-avatar :size="42" :src="getUrl(currentSellItem.head_shot_path)"></el-avatar>
              <div>
                <p>
                  {{ currentSellItem.nick_name }}
                  <span>最低售价</span>
                </p>
                <p>
                  出售{{ currentSellItem.num }}个{{
                    currentBatch.CopyrightProportion / 100
                  }}%版本，每个CNY &nbsp;￥{{ currentSellItem.unit_price }}
                  <img :src="nftMessage" @click="getNftInfo(currentSellItem.user_music_nft_id)" />
                </p>
              </div>
            </div>
            <div class="lave-count-box">
              <span>数量</span>
              <el-input-number
                v-model="num"
                :min="1"
                :max="currentSellItem.count"
                controls-position="right"
              />
              <span class="jian">件</span>
              <span>库存{{ currentSellItem.count }}个</span>
            </div>
          </template>
          <div class="btn-box" :class="{ 'no-data-box': nftBatchList.length <= 0 }">
            <span class="buy" @click="operation(0)">立即购买</span>
            <span class="bid" @click="operation(1)">求购</span>
            <span class="sell" @click="operation(2)">出售</span>
          </div>
        </div>
      </div>
      <div>
        <commentVue></commentVue>
      </div>
    </main>
    <el-dialog v-model="buyDialogShow" title="确认订单" width="470px" :close-on-click-modal="false">
      <div class="bid-dialog-container dialog">
        <p class="title flex-middle-between">
          <span>产品</span>
          <span>单价(元)</span>
        </p>
        <div class="batch-info">
          <img :src="getUrl(musicInfo.Cover)" />
          <div>
            <p>{{ currentBatch.Title }}</p>
            <p class="flex-middle-between">
              <span>{{ num }}个</span>
              <span>￥{{ currentSellItem.unit_price }}</span>
            </p>
          </div>
        </div>
        <div class="flex-middle-between sum-box">
          <span> 合计 </span>
          <span class="sum"
            >￥ <span>{{ num * currentSellItem.unit_price }}</span></span
          >
        </div>
        <div class="flex pay-way">
          <span> 付款方式 </span>
          <div>
            <div class="ali-pay">
              <img src="@/assets/images/alipay.png" class="alipay-img" />
              <img src="@/assets/images/pay-check.png" class="pay-check" />
            </div>
          </div>
        </div>
        <div>
          <el-checkbox
            v-model="buyData.checkStatus"
            style="
              --el-checkbox-checked-font-color: #000;
              --el-checkbox-checked-input-border-color: #000;
              --el-checkbox-checked-background-color: #000;
              --el-checkbox-input-border-color-hover: #000;
            "
          >
            勾选此框，即表示我同意贝多音乐的服务条款
          </el-checkbox>
        </div>
        <p class="btn-box">
          <span class="btn" @click="orderNftInfo(2)"> 确认付款 </span>
        </p>
      </div>
      <el-dialog
        v-model="buyConfrimDialogShow"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        width="30%"
        title="确认订单状态"
        append-to-body
      >
        <div class="dialog">
          <h2 class="confrim-title">请确认您是否支付？</h2>
          <div class="btn-box">
            <span @click="closeBuyConfrim" class="cancel">暂未支付</span>
            <span @click="closeBuyConfrim" class="btn">我已支付</span>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog v-model="bidDialogShow" title="求购" width="470px" :close-on-click-modal="false">
      <div class="bid-dialog-container dialog">
        <p class="title">
          <span>产品</span>
        </p>
        <div class="batch-info">
          <img :src="getUrl(musicInfo.Cover)" />
          <div>
            <p>{{ currentBatch.Title }}</p>
          </div>
        </div>
        <div class="flex-middle-between">
          <span> 求购数量 </span>
          <el-input-number v-model.number="bidData.num" controls-position="right" />
        </div>
        <div class="flex-middle-between">
          <span> 求购单价 </span>
          <el-input v-model.number="bidData.price" type="number" class="price">
            <template #prefix> ￥ </template>
          </el-input>
        </div>
        <div class="flex-middle-between sum-box">
          <span> 合计 </span>
          <span class="sum"
            >￥ <span>{{ bidData.price * bidData.num }}</span></span
          >
        </div>
        <div class="flex-middle-between">
          <p>出价到期时间</p>
          <el-date-picker
            v-model="bidData.date"
            type="datetime"
            placeholder="请选择出价到期时间"
            :shortcuts="shortcuts"
            class="date"
          >
          </el-date-picker>
        </div>
        <div>
          <el-checkbox
            v-model="bidData.checkStatus"
            style="
              --el-checkbox-checked-font-color: #000;
              --el-checkbox-checked-input-border-color: #000;
              --el-checkbox-checked-background-color: #000;
              --el-checkbox-input-border-color-hover: #000;
            "
          >
            勾选此框，即表示我同意贝多音乐的服务条款
          </el-checkbox>
        </div>
        <p class="btn-box">
          <span class="btn" @click="orderNftInfo(0)"> 发布求购 </span>
        </p>
      </div>
    </el-dialog>
    <el-dialog v-model="sellDialogShow" title="出售" width="470px" :close-on-click-modal="false">
      <div class="sell-dialog-container dialog">
        <p class="title">
          <span>选择出售版本</span>
        </p>
        <el-select v-model="sellData.batchId" placeholder="请选择出售版本">
          <el-option
            v-for="(item, index) in userBatchList"
            :key="item.id"
            :label="item.title"
            :value="index"
          >
            <span>{{ item.title }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.holdCount }}个</span>
          </el-option>
        </el-select>
        <p class="title">设置价格</p>
        <div class="flex-middle-between" v-if="sellBarchItem !== null">
          <span> 出售数量 </span>
          <el-input
            v-model.number="sellData.num"
            :max="sellBarchItem.holdCount"
            :placeholder="'最大出售' + sellBarchItem.holdCount"
          >
            <template #suffix> 个 </template>
          </el-input>
        </div>
        <div class="flex-middle-between">
          <span> 出售单价 </span>
          <el-input v-model.number="sellData.price" type="number" class="price">
            <template #prefix> ￥ </template>
          </el-input>
        </div>
        <div class="flex-middle-between sum-box">
          <span> 预计销售收入 </span>
          <span class="sum"
            >￥ <span>{{ sellData.num * sellData.price }}</span></span
          >
        </div>
        <div class="flex-middle-between">
          <p>出售到期时间</p>
          <el-date-picker
            v-model="sellData.date"
            type="datetime"
            placeholder="请选择出售到期时间"
            :shortcuts="shortcuts"
            class="date"
          >
          </el-date-picker>
        </div>
        <div>
          <el-checkbox
            v-model="sellData.checkStatus"
            style="
              --el-checkbox-checked-font-color: #000;
              --el-checkbox-checked-input-border-color: #000;
              --el-checkbox-checked-background-color: #000;
              --el-checkbox-input-border-color-hover: #000;
            "
          >
            勾选此框，即表示我同意贝多音乐的服务条款
          </el-checkbox>
        </div>
        <p class="btn-box">
          <span class="btn" @click="orderNftInfo(1)"> 确认出售 </span>
        </p>
      </div>
    </el-dialog>
    <el-dialog v-model="centerDialogVisible" custom-class="checkNft">
      <svg-icon
        iconClass="shanchu"
        className="icon-shanchu"
        @click="centerDialogVisible = false"
      ></svg-icon>
      <h1>NFT信息</h1>
      <div class="flex flex-justify-content-between" style="margin-top: 52px; width: 504px">
        <p style="margin-left: 22px">NFT名字</p>
        <p style="margin-right: 22px">{{ nftInfo.title }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">铸造者</p>
        <p style="margin-right: 22px">{{ nftInfo.minter }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">拥有者</p>
        <p style="margin-right: 22px">{{ nftInfo.owner }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">铸造时间</p>
        <p style="margin-right: 22px">{{ dateFormat(nftInfo.mintTime, "yyyy-MM-dd hh:mm:ss") }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 30px; width: 504px">
        <p style="margin-left: 22px">合约地址</p>
        <p style="margin-right: 22px">{{ nftInfo.contract }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">Token ID</p>
        <p style="margin-right: 22px">{{ nftInfo.tokenIdStr }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">区块链</p>
        <p style="margin-right: 22px">{{ nftInfo.blockChain }}</p>
      </div>
      <div class="flex flex-justify-content-between" style="margin-top: 13px; width: 504px">
        <p style="margin-left: 22px">内容哈希</p>
        <p style="margin-right: 22px">{{ nftInfo.hash }}</p>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch, provide } from "vue";
//@ts-ignore
import nftMessage from "@/assets/images/nft-message.png";
//@ts-ignore
import wymusic from "@/assets/images/wymusic.png";
//@ts-ignore
import qqmusic from "@/assets/images/qqmusic.png";
//@ts-ignore
import kuaishou from "@/assets/images/kuaishou.png";
//@ts-ignore
import kugou from "@/assets/images/kugou.png";

import commentVue from "@/components/comment/index.vue";
import detailsPlayerVue from "@/components/details/detailsPlayer.vue";
import {
  getMusicInfoApi,
  getMusicInfoById,
  getMusicNftListByMusicIdApi,
  getSellNftInfoApi, // 获取卖单列表
  getBuyNftInfoApi, // 获取卖单列表
} from "@/api/apiManagement/audio";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { dateFormat, getUrl } from "@/utils/filter";
import { buyNftInfoApi, sellNftInfoApi, getUserNftListApi } from "@/api/apiManagement/musicNFT";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { musciMakeList } from "@/model/musicData";
import { checkNft } from "@/api/apiManagement/userManagement";
import { orderCreateApi, orderStateApi } from "@/api/apiManagement/C2CNft";

export default defineComponent({
  name: "musicDetails",
  components: {
    commentVue,
    detailsPlayerVue,
  },
  setup() {
    const data = reactive({
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      tabsActiveIndex: 0,
      activeNames: "0",
      num: 1,
      tradeType: 0, // 0 出售 1 求购
      tabs: [
        {
          label: "NFT描述",
          deslabel: "灵感描述：",
          describe: "",
        },
        {
          label: "创作人",
          deslabel: "创作人：",
          describe: "",
        },
        {
          label: "作品简介",
          deslabel: "作品简介：",
          describe: "",
        },
      ],
      linkList: [
        { iconfont: wymusic, link: "" },
        { iconfont: qqmusic, link: "" },
        { iconfont: kuaishou, link: "" },
        { iconfont: kugou, link: "" },
      ],
      nftNumList: [
        { iconfont: "icon-chiyoukehu", text: "889个持有者" },
        { iconfont: "icon-cengdie", text: "总共1556份" },
        { iconfont: "icon-NFT", text: `已铸造50%` },
        { iconfont: "icon-wodeguanzhu", text: "158个点赞" },
        { iconfont: "icon-shoucangjia", text: "128个收藏者" },
      ],
      sellListData: [],
      buyListData: [],
      route: useRoute(),
      router: useRouter(),
      musicInfo: {}, // 音乐详情
      nftBatchList: [], // nft 批次列表
      nftBatchIndex: 0, // nft 批次当前激活
      sellPage: 1,
      buyPage: 1,
      sellIndex: 0,
      buyIndex: 0,
      buyDialogShow: false, // 购买弹窗
      sellDialogShow: false, // 出售弹窗
      bidDialogShow: false, // 出价弹窗
      // orderTable: ["1%价值参考", "版本", "单价(元)", "数量", "销售时间", "持有者"],
      orderTable: ["1%价值参考(元)", "单价(元)", "数量", "销售时间", "持有者"],
      shortcuts: [
        {
          text: "三天",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
            return date;
          },
        },
        {
          text: "七天",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            return date;
          },
        },
        {
          text: "一个月",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
            return date;
          },
        },
      ],
      bidData: {
        batchId: "", // 版本批次id
        num: 0,
        price: 0,
        date: "",
        checkStatus: false,
      },
      sellData: {
        batchId: 0, // 版本批次 index
        num: 0,
        price: 0,
        date: "",
        checkStatus: false,
      },
      buyData: {
        checkStatus: false,
      },
      userBatchList: [],
      store: useStore(),
      centerDialogVisible: false,
      nftInfo: {
        blockChain: "",
        contract: "",
        hash: "",
        mintTime: 0,
        minter: "",
        owner: "",
        title: "",
        tokenIdStr: "",
      },
      buyConfrimDialogShow: false,
      buyTimer: {},
      orderNo: "", // 购买订单的订单号
    });
    provide("musicInfo", data.musicInfo);
    const linePos = computed(() => {
      return data.tabsActiveIndex * 120 + "px";
    });
    const currentBatch = computed(() => {
      if (data.nftBatchList.length && data.nftBatchList.length > 0) {
        return data.nftBatchList[data.nftBatchIndex];
      } else {
        return {};
      }
    });
    const currentSellItem = computed(() => {
      return data.sellListData[data.sellIndex] || {};
    });
    const currentBuyItem = computed(() => {
      return data.buyListData[data.buyIndex] || {};
    });
    const isLogin = computed(() => {
      return data.store.getters.isLogin;
    });
    // 出售选中的nft批次
    const sellBarchItem = computed(() => {
      return data.userBatchList[data.sellData.batchId] || {};
    });
    const price = computed(() => {
      return data.sellListData.length && data.sellListData.length > 0
        ? data.sellListData[0].unit_price
        : "--";
    });
    //------------- methods
    function openPage(link: string) {
      window.open(link);
    }
    function setOrderIndex(index: number) {
      if (data.tradeType == 0) {
        data.sellIndex = index;
      } else {
        data.buyIndex = index;
      }
    }
    function getNFTRender(index: number) {
      switch (index) {
        case 0:
          let holdUserCnt = 0;
          data.nftBatchList.forEach((item) => {
            holdUserCnt += Number(item.HoldUserCnt);
          });
          return `${holdUserCnt}个持有者`;
        case 1:
          let CastingCount = 0;
          data.nftBatchList.forEach((item) => {
            CastingCount += Number(item.CastingCount);
          });
          return `总共${CastingCount}份`;
        case 2:
          let CopyrightProportion = 0;
          data.nftBatchList.forEach((item) => {
            CopyrightProportion += Number(item.CopyrightProportion) / 100;
          });
          return `已铸造${CopyrightProportion}%`;
        case 3:
          //TODO
          //@ts-ignore
          return `${data.musicInfo.LikeCount}个点赞`;
        case 4:
          //@ts-ignore
          return `${data.musicInfo.CollectionCount}个收藏`;
        default:
          return data.nftNumList[index].text;
      }
    }
    function getSellList() {
      const id = data.nftBatchList[data.nftBatchIndex].Id;
      console.log("id:", data.route.params.Id, id);
      getSellNftInfoApi({
        musicId: data.route.params.Id,
        musicNftId: data.nftBatchList[data.nftBatchIndex].Id,
        Page: data.sellPage,
        Size: 20,
      }).then((res: any) => {
        if (res.code == 0) {
          data.sellListData = res.data.list || [];
          data.sellPage++;
        }
      });
    }
    function getBuyList() {
      getBuyNftInfoApi({
        musicId: data.route.params.Id,
        musicNftId: data.nftBatchList[data.nftBatchIndex].Id,
        Page: data.buyPage,
        Size: 20,
      }).then((res: any) => {
        if (res.code == 0) {
          data.buyListData = res.data.list || [];
          data.buyPage++;
        }
      });
    }
    // 切换显示的买卖单
    function changeTradeType(type: number) {
      data.tradeType = type;
      type == 0 ? (data.sellPage = 1) : (data.buyPage = 1);
      type == 0 ? getSellList() : getBuyList();
    }
    async function operation(type: number) {
      console.log("isLogin", isLogin.value);
      if (!isLogin.value) {
        data.store.commit("setLoginShow");
        return;
      }
      if (data.nftBatchList.length <= 0) {
        return;
      }
      switch (type) {
        case 0:
          data.buyDialogShow = true;
          break;
        case 1:
          data.bidDialogShow = true;
          break;
        case 2:
          data.sellDialogShow = true;
          getUserBatch();
          break;
        default:
          break;
      }
    }
    async function orderNftInfo(type: number) {
      if (type == 2) {
        if (data.buyData.checkStatus) {
          await pay();
        } else {
          ElMessage.warning("请先同意相关协议！");
        }
        return;
      }
      let orderData = type == 0 ? data.bidData : data.sellData;
      if (orderData.checkStatus) {
        (type == 0 ? buyNftInfoApi : sellNftInfoApi)({
          musicId: Number(data.route.params.Id),
          musicNftId: type == 0 ? currentBatch.value.Id : sellBarchItem.value.musicNftId,
          count: orderData.num,
          unitPrice: orderData.price,
          validTime: (orderData.date as unknown as Date).getTime() / 1000,
          timeType: 2,
        }).then((res: any) => {
          console.log(res);
          if (res.code == 0) {
            ElMessage.success("发布成功！");
            type == 0 ? data.bidDialogShow : (data.sellDialogShow = false);
            orderData = {
              batchId: 0,
              num: 0,
              price: 0,
              date: "",
              checkStatus: false,
            };
            switch (type) {
              case 0:
                data.bidDialogShow = false;
                break;
              case 1:
                data.sellDialogShow = false;
                break;
              case 2:
                data.buyDialogShow = false;
                break;
            }
            data.sellPage = 1;
            data.buyPage = 1;
            getBuyList();
            getSellList();
          }
        });
      } else {
        ElMessage.warning("请先同意相关协议！");
      }
    }
    // 支付
    async function pay() {
      console.log(currentSellItem.value);
      await orderCreateApi({ buyCount: data.num, sellOfferId: currentSellItem.value.Id }).then(
        (res: any) => {
          if (res.code == 0) {
            window.open(res.data.payUrl);
            data.buyConfrimDialogShow = true;
            data.orderNo = res.data.orderNo;
            data.buyTimer = setInterval(getOrderState, 1000);
          } else {
            ElMessage.error(res.msg);
          }
        }
      );
    }
    function getOrderState() {
      orderStateApi({ orderNo: data.orderNo }).then((res) => {
        console.log(res);
      });
    }
    function closeBuyConfrim() {
      data.buyConfrimDialogShow = false;
      data.buyDialogShow = false;
      //@ts-ignore
      clearInterval(data.buyTimer);
    }
    // 计算时间差值
    function getDiffTime(startTime: number, endTime: number) {
      let result = endTime - startTime;
      // 计算天数
      let days = Math.floor(result / (24 * 3600));
      let hours = Math.floor((result - days * 24 * 3600) / 3600);
      return days > 0 ? `${days}天` : `${hours}时`;
    }
    // 获取用户拥有的批次列表信息
    async function getUserBatch() {
      await getUserNftListApi({ musicId: Number(data.route.params.Id) }).then((res: any) => {
        if (res.code === 0) {
          data.userBatchList = res.data || [];
        }
      });
    }
    function getCreater() {
      let creater: string[] = [];
      musciMakeList.forEach((item) => {
        if (data.musicInfo[item.value] !== "") {
          creater.push(`${item.label}:${data.musicInfo[item.value]}`);
        }
      });
      return creater;
    }
    function getNftInfo(id: number) {
      //点击查看nft
      checkNft({
        id: id,
      }).then((res: any) => {
        if (res.code == 0) {
          data.nftInfo = res.data;
          data.centerDialogVisible = true;
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
    function toUserPage() {
      // console.log(currentBatch.value);
      data.router.push({ name: "userCenter", params: { userId: currentBatch.value.UserId } });
    }
    async function init() {
      let Id = data.route.params.Id as unknown as number;
      axios
        .all([
          // 获取 音乐详情
          await getMusicInfoById({ Id }),
          // 获取nft批次列表
          await getMusicNftListByMusicIdApi({ MusicId: Id }),
        ])
        .then(
          axios.spread((res2: any, res3) => {
            data.musicInfo = res2.data;
            //@ts-ignore
            data.tabs[1].describe = getCreater(data.musicInfo);
            //@ts-ignore
            data.tabs[2].describe = data.musicInfo.InspirationDescription;
            data.linkList = [
              { iconfont: wymusic, link: data.musicInfo.WangyiyunUrl },
              { iconfont: qqmusic, link: data.musicInfo.QqUrl },
              { iconfont: kuaishou, link: data.musicInfo.KuwoUrl },
              { iconfont: kugou, link: data.musicInfo.KugouUrl },
            ];
            data.nftBatchList = res3.data || [];
          })
        )
        .then(() => {
          if (data.nftBatchList.length && data.nftBatchList.length > 0) {
            getSellList();
          }
        });
    }
    init();
    //-------watch
    watch(
      () => data.sellDialogShow,
      () => {
        data.sellData = {
          batchId: 0,
          num: 0,
          price: 0,
          date: "",
          checkStatus: false,
        };
      }
    );
    watch(
      () => data.bidDialogShow,
      () => {
        data.bidData = {
          batchId: "",
          num: 0,
          price: 0,
          date: "",
          checkStatus: false,
        };
      }
    );
    watch(
      () => data.nftBatchIndex,
      (val, old) => {
        console.log("nftBatchIndex", data.nftBatchIndex);
        data.sellPage = 1;
        data.buyPage = 1;
        getSellList();
        getBuyList();
      }
    );
    return {
      ...toRefs(data),
      nftMessage,
      linePos,
      getNFTRender,
      openPage,
      operation,
      getUrl,
      currentBatch,
      setOrderIndex,
      getSellList,
      getBuyList,
      orderNftInfo,
      currentSellItem,
      changeTradeType,
      sellBarchItem,
      getDiffTime,
      price,
      getCreater,
      dateFormat,
      getNftInfo,
      closeBuyConfrim,
      toUserPage,
    };
  },
});
</script>
<style lang="scss" scoped>
.music-details-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  .no-data-box {
    display: flex !important;
    align-items: center;
    justify-content: center;
    span {
      cursor: not-allowed !important;
    }
    .no-data {
      img {
        width: 57px;
        height: 58px;
      }
      p {
        margin-top: 15px;
        font-size: 14px;
        font-weight: 300;
        color: #999999;
      }
    }
  }
  .music-details-main {
    min-width: 1200px;
    width: 62.5%;
    .main-box {
      display: flex;
      justify-content: space-between;
      height: 1100px;
      .main-left {
        width: 41%;
        flex-shrink: 0;
        .music-player {
          height: 550px;
        }
        .music-author {
          font-size: 18px;
          font-weight: 600;
          color: #333333;
          display: flex;
          align-items: center;
          margin-top: 20px;
          margin-bottom: 20px;
          .el-avatar {
            margin-right: 12px;
            margin-left: 6px;
          }
        }
        .des-box {
          border: 1px solid #ededff;
          .des-tabs {
            .tabs-box {
              display: flex;
              border-bottom: 1px solid #ededff;
              position: relative;
              .tabs-item {
                width: 120px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                cursor: pointer;
              }
              .bottom-slide {
                width: 120px;
                height: 2px;
                background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
                border-radius: 2px;
                position: absolute;
                bottom: 0;
                transition: all 0.5s;
              }
            }
            .des-content {
              padding: 10px 20px 10px 30px;
              font-size: 12px;
              font-weight: 400;
              color: #666666;
              height: 200px;
              overflow-y: auto;
              .des-label {
                font-size: 14px;
                font-weight: 500;
                color: #333333;
                margin-bottom: 15px;
              }
            }
          }
          .collapse-content {
            padding: 20px 20px 0px 30px;
            height: 135px;
            .user-info {
              display: flex;
              .el-avatar {
                flex-shrink: 0;
                margin-right: 15px;
              }
            }
            .link-box {
              border-radius: 2px;
              display: flex;
              margin-top: 30px;
              .link-item {
                width: 48px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #ededff;
                img {
                  width: 24px;
                }
                &:hover {
                  cursor: pointer;
                  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
                }
              }
            }
          }
        }
      }
      .main-right {
        flex-grow: 1;
        padding: 10px 30px;
        .nft-name {
          font-size: 28px;
          font-weight: 500;
          color: #333333;
          margin-bottom: 30px;
        }
        .nft-count-box {
          display: flex;
          justify-content: space-between;
          .count-item {
            font-size: 12px;
            font-weight: 400;
            color: #333333;
            .iconfont {
              font-size: 12px;
              color: RGBA(216, 216, 216, 1);
              margin-right: 3px;
            }
          }
        }
        .sell-money {
          height: 60px;
          line-height: 60px;
          padding-left: 20px;
          font-size: 18px;
          font-weight: 500;
          color: #333333;
          background: #f7f8fa;
          border-radius: 4px;
          border: 1px solid #ededff;
          margin-top: 30px;
          margin-bottom: 20px;
          span {
            font-size: 26px;
            font-weight: 600;
          }
        }
        .version-box {
          border-radius: 4px;
          border: 1px solid #ededff;
          margin-bottom: 25px;
          .version-label {
            height: 48px;
            border-bottom: 1px solid #ededff;
            line-height: 48px;
            padding-left: 20px;
          }
          .version-item-box {
            height: 170px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(3, 180px);
            grid-row-gap: 18px;
            grid-column-gap: 45px;
            padding: 20px;

            .version-item {
              width: 180px;
              height: 32px;
              background: #fbfdff;
              border-radius: 4px;
              border: 1px solid #ededff;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 32px;
              padding-left: 15px;
              cursor: pointer;
              user-select: none;
              &.active {
                background: #000;
                color: #fbfdff;
              }
            }
          }
        }
        .trade-box {
          border-radius: 4px;
          border: 1px solid #ededff;
          .trade-label {
            border-bottom: 1px solid #ededff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              width: 50%;
              text-align: center;
              height: 48px;
              line-height: 48px;
              cursor: pointer;
              user-select: none;
              &.active {
                border-bottom: 1px solid #7eb6ff;
              }
            }
          }
          .order-box {
            height: 320px;
            .order-content-box {
              height: 274px;
              overflow-y: auto;
            }
            .title-box {
              font-size: 14px;
              font-weight: 500;
              color: #333333;
              height: 46px;
              line-height: 46px;
              padding: 0px 10px;
              border-bottom: 1px solid #ededff;
              display: grid;
              grid-template-columns: repeat(5, 20%);
              &.order-item {
                font-weight: 400;
                cursor: pointer;
                &.active {
                  color: rgba(71, 151, 255, 1);
                  border: 1px solid rgba(71, 151, 255, 1);
                  span {
                    color: rgba(71, 151, 255, 1);
                  }
                }
              }
              span {
                &.user {
                  display: flex;
                  align-items: center;
                  img {
                    width: 30px;
                    height: 30px;
                    margin-right: 5px;
                  }
                }
              }
            }
          }
        }
        .sell-user-info {
          display: flex;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          margin-top: 35px;
          .el-avatar {
            margin-right: 5px;
          }
          p {
            span {
              font-size: 12px;
              font-weight: 400;
              color: #666666;
              margin-left: 5px;
            }
            img {
              width: 72px;
              height: 17px;
              margin-left: 15px;
            }
          }
        }
        .lave-count-box {
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          margin-top: 30px;
          .jian {
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            margin-left: 15px;
            margin-right: 20px;
          }
        }
        .btn-box {
          margin-top: 40px;
          span {
            width: 140px;
            height: 38px;
            border-radius: 2px;
            display: inline-block;
            font-size: 14px;
            font-weight: 400;
            margin-right: 30px;
            line-height: 38px;
            text-align: center;
            cursor: pointer;
            user-select: none;
            &.buy {
              color: #fbfdff;
              background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
            }
            &.bid {
              color: #fbfdff;
              background: rgba(0, 0, 0, 0.8);
            }
            &.sell {
              border: 1px solid #eeeeee;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.music-details-box {
  .music-details-main {
    .main-right {
      .lave-count-box {
        .el-input-number {
          width: 88px;
          margin-left: 15px;
        }
        .el-input__inner {
          height: 32px;
          line-height: 32px;
          padding-left: 10px;
          padding-right: 20px;
        }
        .el-input-number__increase,
        .el-input-number__decrease {
          width: 20px;
          height: 16px;
        }
        .el-input-number__decrease {
          bottom: 5px;
        }
        .el-input-number__increase {
          top: 5px;
          .el-icon {
            top: -2px;
          }
        }
      }
    }
  }
  .bid-dialog-container {
    padding-top: 10px;
    .title {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .batch-info {
      display: flex;
      padding: 10px;
      background: #fafafb;
      border-radius: 2px;
      border: 1px solid #ededff;
      margin-bottom: 15px;
      img {
        width: 80px;
        height: 80px;
        margin-right: 8px;
        border-radius: 5px;
        flex-shrink: 0;
      }
      div {
        flex-grow: 1;
      }
    }
    .flex-middle-between {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 10px;
      .price,
      .date {
        width: 200px;
      }
      &.sum-box {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
        .sum {
          font-size: 12px;
          font-weight: 500;
          color: #333333;
          span {
            font-size: 18px;
          }
        }
      }
    }
    .pay-way {
      display: flex;
      align-items: center;
      .ali-pay {
        width: 110px;
        height: 38px;
        background: #008fd6;
        border-radius: 4px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 25px;
        cursor: pointer;
        .alipay-img {
          width: 67px;
          height: 25px;
        }
        .pay-check {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 17px;
          height: 17px;
        }
      }
    }
  }
  .sell-dialog-container {
    .title {
      font-size: 14px;
      font-weight: 500;
      color: #888888;
      margin-bottom: 10px;
    }
    .el-select {
      width: 100%;
      height: 32px;
      margin-bottom: 10px;
      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .flex-middle-between {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 10px;
      .el-input {
        width: 200px;
      }
      .price,
      .date {
        width: 200px;
      }
      &.sum-box {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
        .sum {
          font-size: 12px;
          font-weight: 500;
          color: #333333;
          span {
            font-size: 18px;
          }
        }
      }
    }
  }
}
.dialog {
  .confrim-title {
    margin-top: 30px;
    margin-bottom: 60px;
  }
  .btn-box {
    border-top: 1px solid #eee;
    display: flex;
    justify-content: end;
    padding-top: 10px;
    .cancel {
      width: 85px;
      height: 32px;
      font-size: 14px;
      font-weight: 400;
      line-height: 32px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      margin-right: 10px;
      border: 1px solid #ccc;
    }
    .btn {
      width: 85px;
      height: 32px;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 32px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
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
