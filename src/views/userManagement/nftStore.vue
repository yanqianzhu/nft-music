<template>
  <h2 class="nftstore-title">NFT仓库</h2>
  <div v-loading="loading">
    <div class="tabs-box flex-middle-between">
      <ul>
        <li
          v-for="(item, index) in tabsData"
          :key="item"
          :class="{ active: index == activeIndex }"
          @click="activeIndex = index"
        >
          {{ item }}
        </li>
        <div class="slide" :style="{ left: linePos }"></div>
      </ul>
    </div>
    <div class="container-box">
      <div class="filter-box">
        <div class="status-box">
          <span
            class="status-item"
            @click="changeSort('MusicTitle')"
            :class="{ active: SortField == 'MusicTitle' }"
          >
            歌曲名字
            <span>
              <i
                :class="SortField == 'MusicTitle' && SortType == 'asc' ? 'active' : ''"
                class="iconfont icon-shengxu-copy"
              ></i>
              <i
                :class="SortField == 'MusicTitle' && SortType == 'desc' ? 'active' : ''"
                class="iconfont icon-jiangxu-copy"
              ></i>
            </span>
          </span>
          <span
            class="status-item"
            @click="changeSort('HoldCount')"
            :class="{ active: SortField == 'HoldCount' }"
          >
            持有数量
            <span>
              <i
                :class="SortField == 'HoldCount' && SortType == 'asc' ? 'active' : ''"
                class="iconfont icon-shengxu-copy"
              ></i>
              <i
                :class="SortField == 'HoldCount' && SortType == 'desc' ? 'active' : ''"
                class="iconfont icon-jiangxu-copy"
              ></i>
            </span>
          </span>
        </div>
      </div>
      <div v-if="dataSource.length">
        <managementItemVue
          v-for="item in dataSource"
          :key="item"
          @sell="sell"
          :itemInfo="item"
          :type="2"
          @cancel="cancelSell"
          @setNftTop="setNftTop"
        ></managementItemVue>
        <superPaginationVue
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
        ></superPaginationVue>
      </div>
      <nodata v-else />
      <sellModal  @getData="getData" ref="sellModal" />
      <pendingOrder ref="order" />
    </div>
  </div>
</template>

<script lang="ts">
import { toRef, defineComponent, reactive, toRefs, watch, computed, onMounted, ref } from "vue";
import { Search, ArrowDownBold } from "@element-plus/icons";
import { getNftMusicList } from "@/api/apiManagement/userManagement";
import superPaginationVue from "@/components/public/superPagination.vue";
import { ElIcon, ElSelect, ElDialog, ElImage, ElRadioGroup, ElRadio } from "element-plus";
import managementItemVue from "@/components/userManagement/managementItem.vue";
import nodata from "@/components/userManagement/nodata.vue";
import sellModal from "@/components/userManagement/sellModal.vue";
import pendingOrder from "@/components/userManagement/pendingOrder.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    managementItemVue,
    ArrowDownBold,
    Search,
    superPaginationVue,
    ElIcon,
    ElSelect,
    ElDialog,
    ElImage,
    ElRadioGroup,
    ElRadio,
    nodata,
    sellModal,
    pendingOrder
  },
  setup() {
    const data = reactive({
      tabsData: ["全部NFT", "出售中", "未出售", "仅我可见"],
      total: 0,
      tabsState: [-1, 1, 0, 2],
      activeIndex: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      SortField: "",
      SortType: "", //asc升序desc降序
      dataSource: [],
      stroe: useStore(),
      order: null,
    });
    const linePos = computed(() => {
      return data.activeIndex * 100 + "px";
    });
    onMounted(() => {
      getData();
    });
    const sellModal = ref();
    function getData() {
      interface searchForm {
        Page: number;
        Size: number;
        State?: number;
        IsPrivate?: number;
        UserId: number;
        SortField?: string;
        SortType?: string;
      }
      const obj: searchForm = {
        Page: data.currentPage,
        Size: data.pageSize,
        UserId: data.stroe.getters.userInfo.UserId,
      };
      if (data.activeIndex > 0 && data.activeIndex < 3) {
        obj.State = data.tabsState[data.activeIndex];
      } else if (data.activeIndex == 3) {
        obj.IsPrivate = 1;
      }
      if (data.SortField) {
        obj.SortField = data.SortField;
        obj.SortType = data.SortType;
      }
      getNftMusicList(obj).then((res) => {
        data.dataSource = res.data.list || [];
        data.total = res.data.total;
      });
    }
    watch(
      () => data.currentPage,
      (val, old) => {
        getData();
      }
    );
    watch(
      () => [data.SortField, data.SortType, data.activeIndex, data.pageSize],
      () => {
        if (data.currentPage == 1) {
          getData();
        } else {
          data.currentPage = 1;
        }
      }
    );
    const changeSort = (type: string): void => {
      if (data.SortField == type) {
        if (data.SortType == "asc") {
          data.SortType = "desc";
          data.SortField = type;
        } else if (data.SortType == "desc") {
          data.SortType = "";
          data.SortField = "";
        } else {
          data.SortType == "desc";
          data.SortField = type;
        }
      } else {
        data.SortType = "asc";
        data.SortField = type;
      }
    };
    const setNftTop = (): void => {
      getData();
    };
    const sell = (id: number, MusicNftId: number) => {
      sellModal.value.musicId = id;
      sellModal.value.visible = true;
      sellModal.value.num = null;
      sellModal.value.price = null;
      sellModal.value.MusicNftId = MusicNftId;
      sellModal.value.time = Date.now();
      sellModal.value.getUserBatch();
    };
    const cancelSell = () => {
      data.order.visible = true;
    }
    return { ...toRefs(data), linePos, changeSort, setNftTop, sellModal, sell, getData, cancelSell };
  },
});
</script>

<style lang="scss" scoped>
.nftstore-title {
  padding-left: 35px;
  margin-bottom: 20px;
  margin-top: 30px;
}
.sort-box {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  padding-bottom: 35px;
  .el-input {
    width: 336px;
    .input-suffix {
      font-size: 16px;
    }
  }
  .sort-item {
    margin-right: 30px;
  }
}
.total {
  font-size: 18px;
  font-weight: 400;
  color: #333333;
  padding-bottom: 5px;
}
.tabs-box {
  padding-right: 4%;
  border-bottom: 1px solid #ebebff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .slide {
    width: 100px;
    height: 3px;
    background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
    border-radius: 2px;
    position: absolute;
    bottom: 0;
    transition: all 0.5s;
  }
  .work-search {
    width: 180px;
    height: 32px;
    margin-bottom: 10px;
  }
  ul {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    height: 100%;
    list-style: none;
    margin-left: 35px;
    position: relative;
    li {
      width: 100px;
      text-align: center;
      cursor: pointer;
      padding-bottom: 15px;
      position: relative;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      height: 40px;
      &.active {
        font-size: 16px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
.container-box {
  padding-left: 35px;
  padding-right: 40px;
  .filter-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .status-box {
      height: 65px;
      display: flex;
      align-items: center;
      .status-item {
        font-size: 14px;
        font-weight: 400;
        color: #888888;
        margin-right: 40px;
        padding: 5px 5px 5px 0px;
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 36px;
        span {
          display: flex;
          flex-direction: column;
          position: relative;
          top: 1px;
          padding-left: 15px;
          .iconfont {
            color: RGBA(221, 221, 221, 1);
            font-size: 6px;
          }
          .iconfont.active {
            color: #333333;
          }
        }
        &:hover {
          color: #000;
        }
        &.active {
          font-size: 14px;
          font-weight: 600;
          color: #333333;
        }
        .icon-shaixuan {
          position: relative;
          top: 2px;
        }
        & {
          .iconfont {
            position: relative;
          }
        }
      }
    }
  }
}
.assess-dialog {
  .music-info {
    display: flex;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    background-color: RGBA(250, 250, 251, 1);
    padding: 10px 13px;
    .el-image {
      margin-right: 10px;
    }
  }
  h4 {
    margin-top: 25px;
  }
  .btn-box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    span {
      display: inline-block;
      width: 65px;
      height: 32px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      &.save {
        background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
        color: #fff;
        margin-left: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.sort-box {
  .el-input__inner {
    height: 32px;
  }
  .el-input__suffix {
    right: 12px;
    .el-input__suffix-inner {
      align-items: center;
      cursor: pointer;
    }
  }
}
.tabs-box {
  .el-input__inner {
    line-height: 32px;
    height: 32px;
    padding-right: 25px;
  }
  .el-input__suffix-inner {
    height: 32px;
  }
}
.select-box {
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    display: flex;
  }
}
</style>
