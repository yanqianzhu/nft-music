<template>
  <div class="income-box" v-loading="loading">
    <div class="income-container">
      <div class="flex-middle-between">
        <span class="back flex flex-align-items-center" @click="goback">
          <i class="iconfont icon-leftArr"> </i>返回
        </span>
        <!-- <p class="save-draft" @click="saveDraftShow = true">保存草稿箱</p> -->
      </div>
      <h1 class="page-title">铸造音乐版权收益nft</h1>
      <div class="audio-data-box flex flex-justify-content-between">
        <div class="audio-data-left">
          <el-affix target=".audio-data-left" :offset="80">
            <div class="audio-cover-box">
              <el-image
                style="height: 255px"
                :src="getUrl(MusicInfo.Cover)"
                fit="cover"
                class="audio-cover"
              ></el-image>
              <p class="flex-middle-between">
                <span> <i class="iconfont icon-bofang"></i>{{ MusicInfo.PlayCount }} </span>
                <span> <i class="iconfont icon-dianzan"></i>{{ MusicInfo.LikeCount }} </span>
                <span> <i class="iconfont icon-pinglun"></i>{{ MusicInfo.CommentCount }} </span>
              </p>
              <!-- <div class="flex flex-align-items-center flex-justify-content-center">
                <p class="to-data">数据详情<i class="iconfont icon-zhankai1"></i></p>
              </div> -->
            </div>
          </el-affix>
        </div>
        <div class="audio-data-right">
          <div class="word-information item-box">
            <h2>作品信息</h2>
            <div>
              <editFormVue
                v-model:renderList="renderList"
                :data="MusicInfo"
                v-if="!loading"
                @saveDraft="saveDraft"
              ></editFormVue>
            </div>
          </div>
          <div class="work-money item-box">
            <h2>作品售价信息</h2>
            <div class="work-money-box flex flex-justify-content-between">
              <div class="work-money-item">
                <h3>版权比例</h3>
                <el-input placeholder="填写出售版权比例" v-model="copyRightRatio" type="number">
                  <template #suffix>
                    <span>%</span>
                  </template>
                </el-input>
                <p class="money-tips">
                  请填写要出售版权收益比例，剩余{{ 100 - Number(copyRightRatio) }}%
                </p>
              </div>
              <div class="work-money-item">
                <h3>铸造数量</h3>
                <el-input placeholder="填写铸造NFT数量" v-model="nftAmount" type="number">
                  <template #suffix>
                    <span>个</span>
                  </template>
                </el-input>
                <p class="money-tips">
                  剩余最大铸造数量“{{
                    copyRightRatio || 100 - Number(copyRightRatio)
                  }}万”枚，每1%最大可铸造一万枚NFT
                </p>
              </div>
              <div class="work-money-item">
                <h3>单个价格</h3>
                <el-input placeholder="填写NFT单枚价格" v-model="nftUnivalent" type="number">
                  <template #suffix>
                    <span>元</span>
                  </template>
                </el-input>
                <p class="money-tips">
                  建议你设置的价格，要确保投资人能够获 利，将有助于整个生态和销售
                </p>
              </div>
            </div>
            <div class="sell-total-box">
              <h3>预计销售收入</h3>
              <p class="sell-total ellipsis">
                <span class="chy">￥</span>
                {{ income }}
              </p>
              <div class="sell-setting flex flex-justify-content-between">
                <div class="setting-item">
                  <p class="flex-middle-between">
                    <span class="item-sell-label">立即上架并出售</span>
                    <el-switch v-model="isSell" />
                  </p>
                  <p class="item-sell-tips">
                    关闭上架后，铸造完成的NFT会进入NFT仓库，入库后可随时出售/转赠/重铸
                  </p>
                </div>
                <div class="setting-item">
                  <p class="flex-middle-between">
                    <span class="item-sell-label">出售收益时限</span>
                    <el-switch v-model="timeLimit" />
                  </p>
                  <el-input
                    class="item-sell-tips"
                    v-if="timeLimit"
                    placeholder="填写授权年限（整数）"
                    v-model="sellMoon"
                    type="number"
                  >
                    <template #suffix>
                      <span>月</span>
                    </template>
                  </el-input>
                  <p class="item-sell-tips" v-else>
                    关闭代表永久转让版权收益给版权收益NFT持有者，有效时限从铸造成功开始计时，到期后权益回收，投资人投资的版权收益NFT将过期，失去分配版权收益的权利
                  </p>
                </div>
              </div>
              <p class="sell-des">
                <span class="des-label">NFT销售描述</span>
                <tipsVue>
                  <template #container>
                    <span class="tips-title">
                      <svg class="icon icon-warning" aria-hidden="true">
                        <use xlink:href="#icon-jingshi"></use>
                      </svg>
                      销售描述标准
                    </span>
                  </template>
                  <template #tips>
                    <div class="tips-content">
                      <ul class="tips-first-ul-box">
                        <li>
                          1.我们主张你所销售的价格，一定让购买者在一定时间内能回本，更希望您能写出这些回报依据是什么。
                        </li>
                        <li>2. 我们甚至建议您能写出您预期的年回报收益率。</li>
                        <li>
                          3.
                          如果这首歌已经有比较好的收益数据或者平台播放量或者您是有多次成功经验的创作者，我们都希望您能把您的营收故事讲明白，这将有利于您的NFT销售。
                        </li>
                      </ul>
                    </div>
                  </template>
                </tipsVue>
              </p>
              <div class="word-des-box">
                <el-input
                  v-model="workDes"
                  class="work-des"
                  type="textarea"
                  rows="8"
                  maxlength="1000"
                  placeholder="（描述将展现在作品的详情页信息页面上，可能会影响投资者的决策，请谨慎填写）"
                >
                </el-input>
                <span class="maxlength">您还可以输入{{ desSurplus }}字</span>
              </div>
            </div>
          </div>
          <p class="check-box flex-center-center">
            <el-checkbox
              v-model="checkCopyRight"
              style="--el-color-primary: #000"
              label="我已确保你销售的版权比例，一定归我所有，一旦销售成功产生收益，我将承担相应的法律责任"
            ></el-checkbox>
          </p>
          <p class="check-box flex-center-center">
            <el-checkbox
              v-model="checkSell"
              style="--el-color-primary: #000"
              label="我已确认不会一首歌出售多次或多平台出售，我将承当相应的法律责任"
            ></el-checkbox>
          </p>
          <p class="flex-center-center">
            <el-button type="primary" class="submit" @click="casting">立即铸造</el-button>
          </p>
          <p class="copyright-statement">我们将使用ERC1155协议为您铸造NFT在全球知名区块链上存证</p>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="saveDraftShow" title="提示" width="470px" custom-class="save-draft-dialog">
    <div class="dialog-content">
      <img src="@/assets/images/save-draft.png" />
      <p class="success-tip">草稿箱保存成功</p>
      <p class="tolink">
        已存至
        <router-link :to="{ name: 'nftBatchManagement' }" custom v-slot="{ navigate }">
          <span class="to-nftBatchManagement" @click="navigate"
            >&lt;管理中心-nft批次铸造管理&gt;</span
          >
        </router-link>
      </p>
      <span class="sure" @click="saveDraftShow = false"> 我知道了 </span>
    </div>
  </el-dialog>
  <el-dialog
    v-model="castImmediately"
    width="470px"
    custom-class="box-forging"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div
      class="forging-content flex"
      v-loading="castingLoading"
      element-loading-text="提交审核中..."
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
    >
      <img src="@/assets/images/forging.png" />
      <div>
        <h1>铸造审核提交成功！</h1>
        <div class="icon-title">
          <p>作品正在审核，请等待审核完成。可在批次铸造管理中查询进度</p>
          <span @click="gocheck">前往<img src="@/assets/images/icon-go.png" alt="" /></span>
        </div>
        <div class="gohome" @click="gohome">返回首页</div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
  onBeforeMount,
  nextTick,
  watch,
} from "vue";
import mainHeaderVue from "@/components/header/mainHeader.vue";
import footerVue from "@/components/footer/index.vue";
import { ElImage, ElInput, ElSwitch, ElButton, ElMessage } from "element-plus";
import tipsVue from "@/components/publication/form/tips.vue";
import { getMusicInfoById, musicNftCastingApi, musicNftDraftApi } from "@/api/apiManagement/audio";
import editFormVue from "@/components/casting/editForm.vue";
import { useRoute, useRouter } from "vue-router";
import { getUrl } from "@/utils/filter";
import router from "@/router/index";
import { musicNFTApi } from "@/api/apiManagement/musicNFT";

export default defineComponent({
  name: "NFTIncome",
  components: {
    editFormVue,
    mainHeaderVue,
    ElButton,
    footerVue,
    ElImage,
    ElInput,
    ElSwitch,
    tipsVue,
  },
  setup() {
    // --------data
    const data = reactive({
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      isSell: false, // 是否立即上架并出售
      isEdit: false, // 是否开启编辑态
      checkCopyRight: false,
      checkSell: false,
      workDes: "",
      maxLength: 1000,
      copyRightRatio: "", //版权比例
      nftAmount: "", //铸造数量
      nftUnivalent: "", // 单个价格
      timeLimit: false, // 出售时间限制
      sellMoon: "", // 出售的月份
      MusicInfo: {},
      loading: true,
      router: useRouter(),
      route: useRoute(),
      saveDraftShow: false,
      castImmediately: false,
      renderList: {},
      castingLoading: false,
      svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `,
    });
    //------computed
    // 标签输入剩余字数
    const desSurplus = computed(() => {
      return data.maxLength - data.workDes.length;
    });
    // 预计收入
    const income = computed(() => {
      return BigInt(Number(data.nftAmount) * Number(data.nftUnivalent));
    });
    //--------methods
    async function init() {
      data.loading = false;
      await getMusicInfoById({ Id: Number(data.route.params.id) })
        .then((res) => {
          console.log("res", res);
          data.MusicInfo = ref(res.data);
          nextTick(() => {
            data.loading = false;
          });
        })
        .catch((e) => {
          ElMessage.error(e.data.msg);
        });
    }
    init();
    async function casting() {
      if (data.isEdit) {
        ElMessage.warning("请先保存修改后在进行铸造~");
        return;
      }
      if (!data.checkCopyRight && !data.checkSell) {
        ElMessage.error("请确认勾选相关协议");
        return;
      }
      data.castingLoading = true;
      data.castImmediately = true;
      await musicNFTApi({
        musicId: data.MusicInfo.Id,
        copyrightProportion: Number(data.copyRightRatio),
        unitPrice: Number(data.nftUnivalent),
        castingCount: Number(data.nftAmount),
        copyrightYear: data.timeLimit ? Number(data.sellMoon) : -1,
        describe: data.workDes,
        isShelf: Number(data.isSell),
        type: 10081,
      }).then((res) => {
        console.log("musicNftCasting", res);
        if (res.code == 0) {
          // ElMessage.success("铸造成功!");
          data.castingLoading = false;
        } else {
          ElMessage.error(res.msg);
          data.castingLoading = false;
          data.castImmediately = false;
        }
      });
    }
    const goback = () => {
      data.router.go(-1);
    };
    //锻造成功返回主页
    const gohome = () => {
      router.push("/home/homePage");
    };
    //锻造成功进批次管理查看
    const gocheck = () => {
      router.push("/management/nftBatchManagement");
    };
    function saveDraft(draftData: object) {
      console.log("saveDraft", draftData);
      // musicNftDraftApi({
      //   ...draftData,
      //   CopyrightProportion: Number(data.copyRightRatio) * 100,
      //   UnitPrice: Number(data.nftUnivalent) * 100,
      //   CastingCount: Number(data.nftAmount),
      //   CopyrightYear: data.timeLimit ? Number(data.sellMoon) : -1,
      //   Describe: data.workDes,
      //   IsShelf: Number(data.isSell),
      //   Type: 10081, // 版权收益nft
      // }).then((res) => {
      //   console.log(res);
      // });
    }
    //--------watch
    watch(
      () => data.renderList,
      (val) => {
        console.log("data.renderList", val);
      }
    );
    //-------------------生命周期
    onBeforeMount(async () => {});

    return {
      ...toRefs(data),
      desSurplus,
      income,
      casting,
      goback,
      saveDraft,
      getUrl,
      open,
      gohome,
      gocheck,
    };
  },
});
</script>
<style lang="scss" scoped>
@mixin borderBottom() {
  border-bottom: 1px solid #f4f4ff;
}
@mixin bordertop() {
  border-top: 1px solid #f4f4ff;
}
.income-box {
  display: flex;
  justify-content: center;
  background-color: RGBA(0, 0, 0, 0);
  .income-container {
    width: 1200px;
    padding: 30px;
    background-color: RGBA(255, 255, 255, 1);
    .page-title {
      font-size: 34px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 35px;
      margin-top: 15px;
      text-align: center;
    }
    .back {
      font-size: 16px;
      font-weight: 400;
      color: #888888;
      cursor: pointer;
      .icon-leftArr {
        font-size: 24px;
        margin-right: 12px;
      }
    }
    .save-draft {
      padding: 5px 15px;
      background: #f5f4f4;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      cursor: pointer;
    }
    .audio-data-box {
      .audio-data-left {
        width: 300px;
        flex-shrink: 0;
        .audio-cover-box {
          width: 300px;
          height: 400px;
          padding: 30px;
          padding-bottom: 20px;
          border: 1px solid #efeff6;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          border-radius: 6px;
          .flex-middle-between {
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            margin-top: 20px;
            margin-bottom: 20px;
            span {
              display: flex;
              align-items: center;
            }
            .iconfont {
              font-size: 16px;
              margin-right: 10px;
              &.icon-dianzan {
                color: RGBA(255, 112, 112, 1);
              }
            }
          }
          .to-data {
            width: 120px;
            height: 32px;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            background: #ffffff;
            border-radius: 2px;
            border: 1px solid #d8d8d8;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .icon-zhankai1 {
              margin-left: 10px;
              font-size: 12px;
            }
          }
        }
      }
      .audio-data-right {
        flex-grow: 1;
        .item-box {
          box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
          border-radius: 6px;
          border: 1px solid #f4f4ff;
          margin-bottom: 30px;
          padding: 30px;
        }
        h2 {
          font-size: 24px;
          font-weight: 600;
          color: #333333;
          margin-bottom: 20px;
        }
        // -------------------------表单
        .work-introduction {
          padding: 30px 0px;
          @include borderBottom;
          @include bordertop;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          h3 {
            padding-bottom: 20px;
            font-size: 18px;
            font-weight: 500;
            color: #333333;
          }
        }
        //--------------------------
        .submit-box {
          padding-top: 20px;
          .submit-btn {
            background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
            border-radius: 2px;
            width: 120px;
            height: 36px;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            outline: none;
            border: none;
            cursor: pointer;
          }
        }
        .work-money {
          .work-money-box {
            @include borderBottom;
            padding-top: 35px;
            padding-bottom: 20px;
            margin-bottom: 40px;
            .work-money-item {
              width: 240px;
              h3 {
                font-size: 18px;
                font-weight: 500;
                color: #333333;
                margin-bottom: 15px;
              }
              .money-tips {
                font-size: 12px;
                font-weight: 400;
                color: #666666;
                margin-top: 10px;
              }
            }
          }
        }
        .sell-total-box {
          h3 {
            font-size: 20px;
            font-weight: 500;
            color: #333333;
          }
          .sell-total {
            margin-top: 15px;
            font-size: 32px;
            font-weight: 500;
            color: #333333;
            margin-bottom: 50px;
            .chy {
              font-size: 20px;
              font-weight: 500;
              color: #888888;
              margin-right: 18px;
            }
          }
          .sell-setting {
            height: 125px;
            .setting-item {
              width: 326px;
            }
            margin-bottom: 30px;
            .item-sell-label {
              font-size: 20px;
              font-weight: 500;
              color: #333333;
            }
            .item-sell-tips {
              font-size: 14px;
              font-weight: 400;
              color: #888888;
              margin-top: 20px;
            }
          }
          .sell-des {
            margin-bottom: 30px;
            .des-label {
              font-size: 20px;
              font-weight: 500;
              color: #333333;
              margin-right: 25px;
            }
          }
          .word-des-box {
            position: relative;
            .maxlength {
              position: absolute;
              right: 12px;
              bottom: 5px;
              font-size: 12px;
              font-weight: 400;
              color: #909399;
              background-color: #ffffff;
            }
          }
          .work-des {
            height: 200px;
          }
        }
        .check-box {
          margin-bottom: 20px;
        }
        .submit {
          width: 180px;
          height: 40px;
          background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          border: none;
          outline: none;
        }
        .copyright-statement {
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          margin-bottom: 90px;
          margin-top: 25px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.work-des {
  .el-textarea__inner {
    resize: none;
    height: 100%;
    padding-bottom: 25px;
  }
}
.el-input__inner {
  padding-right: 20px;
}
.tips-title {
  color: rgba(255, 0, 0, 1);
  font-size: 14px;
  .icon {
    font-size: 14px;
    margin-right: 10px;
  }
}
.tips-content {
  max-width: 640px;
  .tips-first-ul-box {
    padding: 10px 20px;
    li {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      padding-bottom: 12px;
      .tips-ul li {
        padding-top: 12px;
        font-size: 12px;
        font-weight: 500;
        color: #333333;
      }
    }
  }
}
.save-draft-dialog {
  height: 308px;
  position: relative;
  .dialog-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 80px;
      height: 80px;
    }
    .success-tip {
      font-size: 22px;
      font-weight: 500;
      color: #333333;
    }
    .tolink {
      font-size: 16px;
      font-weight: 400;
      color: rgba($color: #666666, $alpha: 0.9);
      .to-nftBatchManagement {
        color: #666666;
        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
    .sure {
      position: absolute;
      bottom: 10px;
      right: 30px;
      width: 85px;
      height: 32px;
      line-height: 32px;
      display: inline-block;
      color: #fff;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      text-align: center;
      cursor: pointer;
    }
  }
}
.el-dialog__header {
  border-bottom: 0;
}
.box-forging {
  width: 800px;
  height: 390px;
  .forging-content {
    img {
      width: 277px;
      height: 169px;
      margin-left: 40px;
      margin-top: 68px;
    }
    h1 {
      font-size: 48px;
      color: #000000;
      margin-left: 68px;
      margin-top: 58px;
    }
    .icon-title {
      width: 315px;
      height: 56px;
      position: relative;
      line-height: 28px;
      margin-top: 12px;
      margin-left: 68px;
      p {
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }
      span {
        font-size: 16px;
        color: #63a5ff;
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        cursor: pointer;
        img {
          width: 15px;
          height: 10px;
          padding: 0;
          margin: 0;
          margin-left: 9px;
        }
      }
    }
    .gohome {
      width: 100px;
      height: 36px;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 36px;
      border-radius: 2px;
      margin-top: 30px;
      margin-left: 68px;
      cursor: pointer;
    }
  }
}
</style>
