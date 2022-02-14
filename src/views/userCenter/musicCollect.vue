<template>
  <div class="user-nft-store">
    <div class="nft-sort">
      <span class="nft-sort-item"> 全部收藏 </span>
      <span class="nft-sort-item" @click="setSortIndex">
        热度指数
        <svg class="icon" aria-hidden="true">
          <use
            :xlink:href="
              sortIndex == 0 ? '#icon-shaixuan' : sortIndex == 1 ? '#icon-asc' : '#icon-desc'
            "
          ></use>
        </svg>
      </span>
    </div>
    <div class="nft-filter">
      <superElSelectVue
        v-for="(item, index) in selectList"
        :key="item.key"
        :label="item.label"
        :selectList="item.selectList"
        :icon="item.icon"
        :type="index"
      >
        <template v-slot:label="scope">
          <span>
            {{ item.label }}
            <el-icon>
              <arrow-up-bold v-if="scope.isShow" />
              <arrow-down-bold v-else />
            </el-icon>
          </span>
        </template>
      </superElSelectVue>
    </div>
    <template v-if="collectionList.length <= 0">
      <div class="no-data">
        <img src="@/assets/images/no-data.png" alt="" srcset="" />
        <p>暂无数据~</p>
      </div>
    </template>
    <template v-else>
      <div class="infinite-list">
        <div v-for="(item, index) in collectionList" :key="index" class="infinite-list-item">
          <musiccollectionlist :itemInfo="item"></musiccollectionlist>
        </div>
      </div>
      <superPaginationVue
        v-model:currentPage="PageSize.Page"
        v-model:pageSize="PageSize.Size"
        :total="total"
      ></superPaginationVue>
    </template>
  </div>
</template>
<script lang="ts">
import { reactive, defineComponent, watch, toRefs, computed, onUnmounted } from "vue";
import superElSelectVue from "@/components/home/superElSelect.vue";
import { LANGUAGE, MOOD, GENRE, TYPES } from "@/model/selectData";
import { ElIcon } from "element-plus";
import { ArrowDownBold, ArrowUpBold } from "@element-plus/icons";
import nftstorelist from "@/components/userCenter/nftStoreList.vue";
import { getCollectionMusicList } from "@/api/apiManagement/audio";
import musiccollectionlist from "@/components/userCenter/musicCollectionList.vue";
import { useRoute } from "vue-router";
import emitter from "@/utils/mitt";
import { musicTypeMap } from "@/model/musicData";
import superPaginationVue from "@/components/public/superPagination.vue";

type requistMusicListData = {
  Page: number; //当前页
  Size: number; //查询大小
  SortField?: string; //排序字段，m.create_time/m.like_count
  SortType?: string; //排序方式asc,desc 不排序为空
  UserId: number;
  Genre: string;
  Language: string;
  Mood: string;
  MusicType: string;
};
export default defineComponent({
  name: "userMusicCollect",
  components: {
    superElSelectVue,
    ElIcon,
    ArrowDownBold,
    ArrowUpBold,
    nftstorelist,
    musiccollectionlist,
    superPaginationVue,
  },
  setup() {
    const data = reactive({
      collectionList: [],
      route: useRoute(),
      quantity: "",
      PageSize: {
        Page: 1,
        Size: 10,
      },
      Genre: [], // 曲风
      Mood: [], // 心情
      Language: [], // 语种
      MusicType: [], // 音乐类型
      SortTypeList: ["", "asc", "desc"],
      SortField: "",
      sortIndex: 0,
      total: 0,
    });
    const selectList = [
      { label: "作品类型", key: "types", icon: "icon-zuopinleixing", selectList: TYPES },
      { label: "曲风", key: "genre", icon: "icon-qufeng", selectList: GENRE },
      { label: "情绪", key: "mood", icon: "icon-qingxu", selectList: MOOD },
      { label: "语种", key: "language", icon: "icon-yuzhongqiehuan", selectList: LANGUAGE },
    ];
    //----------------computed
    const filterList = computed(() => {
      return {
        MusicType: data.MusicType.join(","),
        Mood: data.Mood.join(","),
        Language: data.Language.join(","),
        Genre: data.Genre.join(","),
        SortType: data.SortTypeList[data.sortIndex],
        SortField: data.SortField,
        ...data.PageSize,
      };
    });
    //----------------methods
    function setSortIndex() {
      if (data.sortIndex == 2) {
        data.sortIndex = 0;
        data.SortField = "";
        return;
      }
      data.SortField = "like_count";
      data.sortIndex++;
    }
    async function getMusicList() {
      await getCollectionMusicList({
        UserId: data.route.params.userId,
        ...filterList.value,
      }).then((res: any) => {
        if (res.code == 0) {
          data.collectionList = res.data.list;
          data.total = res.data.total;
        } else {
          data.collectionList = [];
          data.total = 0;
        }
      });
    }
    getMusicList();
    emitter.on("addFilter", (item: any) => {
      switch (item.type) {
        case 0:
          data.MusicType.push(musicTypeMap[item.label]);
          break;
        case 1:
          data.Genre.push(item.label);
          break;
        case 2:
          data.Mood.push(item.label);
          break;
        case 3:
          data.Language.push(item.label);
          break;
        default:
          break;
      }
    });
    emitter.on("deleteFilter", (item: any) => {
      switch (item.type) {
        case 0:
          data.MusicType.splice(data.MusicType.indexOf(musicTypeMap[item.label]), 1);
          break;
        case 1:
          data.Genre.splice(data.Genre.indexOf(item.label), 1);
          break;
        case 2:
          data.Mood.splice(data.Mood.indexOf(item.label), 1);
          break;
        case 3:
          data.Language.splice(data.Language.indexOf(item.label), 1);
          break;
        default:
          break;
      }
    });
    // ----------- watch
    watch(
      () => filterList.value,
      (val, old) => {
        console.log(val, old);
        getMusicList();
      },
      {
        deep: true,
      }
    );
    onUnmounted(() => {
      emitter.off("deleteFilter");
      emitter.off("addFilter");
    });
    return { selectList, ...toRefs(data), setSortIndex };
  },
});
</script>
<style lang="scss" scoped>
.user-nft-store {
  .nft-sort {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    margin-top: 30px;
    margin-bottom: 25px;
    &:hover {
      cursor: pointer;
    }
    .nft-sort-item {
      font-size: 16px;
      font-weight: 400;
      // color: #333333;
      cursor: pointer;
      margin-right: 40px;
      .iconfont {
        font-size: 14px;
      }
    }
  }
}
.nft-filter {
  span {
    background-color: #f5f4f4;
    margin-right: 30px;
    padding: 5px 10px;
    border-radius: 2px;
    &:hover {
      cursor: pointer;
    }
  }
}
.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
  .infinite-list-item {
    width: 1100px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    & + .list-item {
      margin-top: 10px;
    }
  }
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5%;
  flex-direction: column;
}
</style>
