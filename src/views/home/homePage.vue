<template>
  <div class="homepage-box" v-loading="loading">
    <div class="flex-middle-between">
      <p>
        筛选条件 <span>({{ total }}首)</span>
      </p>
      <p class="play-btn" @click="setPlayerList">
        <span class="bofang-box">
          <i class="iconfont icon-bofang"></i>
        </span>
        播放当前所有
      </p>
    </div>
    <div class="select-status-box">
      <span class="filter-clear" @click="cleanFilter" v-if="filterList.length > 0"> 清空所有 </span>
      <span v-for="item in filterList" class="filter-item" @click="deleteFiter(item)">
        {{ item.label }}
      </span>
    </div>
    <div class="select-box">
      <div v-for="item in selectList" class="select-item">
        <superElSelectVue
          :key="item.key"
          :label="item.label"
          :selectList="item.selectList"
          :icon="item.icon"
          :itemKey="item.key"
        >
        </superElSelectVue>
      </div>
    </div>
    <div class="sort-box">
      <div class="sort-item" @click="changeSort('sortHot')">
        热度排序
        <span class="sort-icon-box">
          <i class="iconfont icon-shengxu-copy" :class="{ active: sortHot == 1 }"></i>
          <i class="iconfont icon-jiangxu-copy" :class="{ active: sortHot == 2 }"></i>
        </span>
      </div>
      <div class="sort-item" @click="changeSort('sortTime')">
        上架时间
        <span class="sort-icon-box">
          <i class="iconfont icon-shengxu-copy" :class="{ active: sortTime == 1 }"></i>
          <i class="iconfont icon-jiangxu-copy" :class="{ active: sortTime == 2 }"></i>
        </span>
      </div>
    </div>
    <template v-if="total !== 0">
      <div class="">
        <listItemVue
          v-for="(item, index) in musicList"
          :item="item"
          :key="item.Id"
          :index="index"
          @setPlayerList="setPlayerList"
        ></listItemVue>
      </div>
      <superPaginationVue
        :total="total"
        v-model:currentPage="pageSize.Page"
        v-model:pageSize="pageSize.Size"
      ></superPaginationVue>
    </template>
    <template v-else>
      <div class="no-data">
        <img src="@/assets/images/no-data.png" alt="" srcset="" />
        <p>暂无数据~</p>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import superElSelectVue from "@/components/home/superElSelect.vue";
import { defineComponent, reactive, toRefs, watch, computed } from "vue";
import { LANGUAGE, MOOD, GENRE, TYPES } from "@/model/selectData";
import listItemVue from "@/components/home/listItem.vue";
import superPaginationVue from "@/components/public/superPagination.vue";
import emitter from "@/utils/mitt";
import { getHomePageMusicListApi } from "@/api/apiManagement/audio";
import { musicType } from "@/model/musicData";
import { useStore } from "vuex";
import { getUrl } from "@/utils/filter";

type requistMusicListData = {
  IsCastingNFT?: number; //有无nft
  Label?: string[]; //语种，曲风，心情。
  MusicType?: number[]; //作品类型
  Page: number; //当前页
  Size: number; //查询大小
  SortField?: string; //排序字段，m.create_time/m.like_count
  SortType?: string; //排序方式asc,desc 不排序为空
};
type platerItem = {
  url: string;
  lrc: string;
};
export default defineComponent({
  name: "homePage",
  components: { superElSelectVue, listItemVue, superPaginationVue },
  setup() {
    const data = reactive({
      musicList: [],
      total: 0,
      sortHot: 0, // 0 all 1升序 2降序
      sortTime: 0, // 同上
      sortList: ["", "asc", "desc"],
      loading: false,
      sortObj: {
        SortField: "",
        SortType: "",
      },
      pageSize: {
        Page: 1,
        Size: 10,
      },
      filterList: [], // 筛选展示 list
      store: useStore(),
    });
    const selectList = [
      { label: "有无NFT", key: "nft", icon: "", selectList: ["有NFT", "无NFT"] },
      { label: "作品类型", key: "types", icon: "icon-zuopinleixing", selectList: TYPES },
      { label: "曲风", key: "genre", icon: "icon-qufeng", selectList: GENRE },
      { label: "情绪", key: "mood", icon: "icon-qingxu", selectList: MOOD },
      { label: "语种", key: "language", icon: "icon-yuzhongqiehuan", selectList: LANGUAGE },
    ];
    //------computed
    // 有无nft
    const castingNFT = computed(() => {
      let list = data.filterList.filter((item) => item.key == "nft").map((item) => item.label);
      if (list.length == 0 || list.length == 2) {
        return -1;
      }
      return list[0] == "有NFT" ? 1 : 0;
    });
    // 曲风 list
    const GenreList = computed(() => {
      return data.filterList.filter((item) => item.key == "genre").map((item) => item.label) || [];
    });
    // 语种 list
    const LanguageList = computed(() => {
      return (
        data.filterList.filter((item) => item.key == "language").map((item) => item.label) || []
      );
    });
    // 心情 list
    const MoodList = computed(() => {
      return data.filterList.filter((item) => item.key == "mood").map((item) => item.label) || [];
    });
    // 作品类型 lsit
    const MusicTypeList = computed(() => {
      let list = data.filterList.filter((item) => item.key == "types").map((item) => item.label);
      let result: number[] = [];
      for (const key in musicType) {
        list.forEach((item) => {
          if (item == musicType[key]) {
            result.push(Number(key));
            return;
          }
        });
      }
      return result || [];
    });
    const filterObj = computed(() => {
      return {
        IsCastingNFT: castingNFT.value,
        Genre: GenreList.value,
        Language: LanguageList.value,
        Mood: MoodList.value,
        MusicType: MusicTypeList.value,
        ...data.sortObj,
        ...data.pageSize,
      };
    });
    //----------methods
    function getMusicList(obj: requistMusicListData) {
      data.loading = true;
      getHomePageMusicListApi(obj)
        .then((res: any) => {
          console.log("getMusicList", res);
          if (res.code == 0) {
            data.musicList = res.data.list || [];
            data.total = res.data.total || 0;
          }
        })
        .catch((e) => {
          console.log("getMusicListError", e);
        })
        .then(() => {
          data.loading = false;
        });
    }
    getMusicList(filterObj.value);
    //改变 排序
    function changeSort(paramsKey: string) {
      if (paramsKey == "sortHot") {
        data.sortTime = 0;
        data.sortObj.SortField = "like_count";
      } else {
        data.sortHot = 0;
        data.sortObj.SortField = "create_time";
      }
      data[paramsKey] += 1;
      if (data[paramsKey] > 2) {
        data[paramsKey] = 0;
      }
      data.sortObj.SortType = data.sortList[data[paramsKey]];
    }
    // 清空筛选
    function cleanFilter() {
      const length = data.filterList.length;
      for (let index = 0; index < length; index++) {
        const element = data.filterList[index];
        deleteFiter(element);
      }
    }
    // 删除一个筛选条件
    function deleteFiter(item: { label: string; isSelect: Boolean }) {
      emitter.emit("deleteFilter", item);
    }
    function setPlayerList() {
      data.store.commit("setPlayerList", data.musicList);
    }
    //---------watch
    watch(
      () => filterObj.value,
      () => {
        getMusicList(filterObj.value);
      },
      { deep: true }
    );
    // watch(
    //   () => data.pageSize,
    //   (val, old) => {
    //     console.log(val, old);
    //     data.pageSize = val;
    //   }
    // );
    //---------------eventBus
    emitter.on("addFilter", (item) => {
      data.filterList.push(item);
    });
    emitter.on("deleteFilter", (item) => {
      data.filterList.splice(data.filterList.indexOf(item), 1);
    });
    return { ...toRefs(data), selectList, changeSort, cleanFilter, deleteFiter, setPlayerList };
  },
});
</script>
<style lang="scss" scoped>
.homepage-box {
  // height: calc(100vh - 72px);
  width: 1200px;
  padding-top: 15px;
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5%;
    flex-direction: column;
  }
  .play-btn {
    background: #000000;
    box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
    border-radius: 21px;
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .bofang-box {
      border-radius: 50%;
      width: 24px;
      height: 24px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      .iconfont {
        color: #000;
      }
    }
  }
  .select-box {
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
    .select-item {
      margin-left: 2%;
      &:first-child {
        margin-left: 0px;
      }
    }
  }
  .select-status-box {
    margin-top: 10px;
    min-height: 27px;
    .filter-clear {
      font-size: 12px;
      font-weight: 400;
      color: #000000;
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        color: #7eb6ff;
      }
    }
    .filter-item {
      width: 68px;
      height: 22px;
      display: inline-block;
      position: relative;
      font-size: 12px;
      font-weight: 400;
      color: #000000;
      background: #f8f8f8;
      border-radius: 2px;
      line-height: 22px;
      padding-left: 8px;
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 5px;
      &:after {
        content: "x";
        position: absolute;
        height: 12px;
        width: 10px;
        right: 5px;
        top: 0px;
        color: RGBA(132, 132, 132, 1);
      }
    }
  }
  .sort-box {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    display: flex;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebebff;
    .iconfont {
      font-size: 6px;
      &.active {
        color: RGBA(136, 136, 136, 1) !important;
      }
    }
    .sort-item {
      display: flex;
      align-items: center;
      margin-right: 50px;
      cursor: pointer;
      user-select: none;
      .sort-icon-box {
        display: flex;
        flex-direction: column;
        position: relative;
        top: 1px;
        padding-left: 15px;
        .iconfont {
          color: RGBA(221, 221, 221, 1);
        }
      }
    }
  }
}
</style>
