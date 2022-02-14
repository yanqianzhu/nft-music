<template>
  <div class="user-nft-store">
    <div class="nft-sort">
      <span class="nft-sort-item"> 全部NFT </span>
      <span class="nft-sort-item" @click="setSortType('nameSort')">
        歌曲名字
        <svg class="icon" aria-hidden="true">
          <use
            :xlink:href="
              nameSort == 0 ? '#icon-shaixuan' : nameSort == 1 ? '#icon-asc' : '#icon-desc'
            "
          ></use>
        </svg>
      </span>
      <span class="nft-sort-item" @click="setSortType('holdingRatioSort')">
        持有比例
        <svg class="icon" aria-hidden="true">
          <use
            :xlink:href="
              holdingRatioSort == 0
                ? '#icon-shaixuan'
                : holdingRatioSort == 1
                ? '#icon-asc'
                : '#icon-desc'
            "
          ></use>
        </svg>
      </span>
      <!-- <span class="nft-sort-item" @click="isPrivate = !isPrivate">仅我可见</span> -->
    </div>
    <template v-if="nftStoreList.length <= 0">
      <div class="no-data">
        <img src="@/assets/images/no-data.png" />
        <p>暂无数据~</p>
      </div>
    </template>
    <template v-else>
      <div class="infinite-list">
        <nftstorelist
          :itemInfo="item"
          v-for="(item, index) in nftStoreList"
          :key="index"
          class="infinite-list-item"
        ></nftstorelist>
      </div>
      <superPaginationVue
        :pageSizes="[4, 8, 12, 16]"
        v-model:currentPage="PageSize.Page"
        v-model:pageSize="PageSize.Size"
        :total="total"
      ></superPaginationVue>
    </template>
  </div>
</template>
<script lang="ts">
import superElSelectVue from "@/components/home/superElSelect.vue";
import { defineComponent, reactive, toRefs, watch, computed } from "vue";
import { LANGUAGE, MOOD, GENRE, TYPES } from "@/model/selectData";
import nftstorelist from "@/components/userCenter/nftStoreList.vue";
import { getNftMusicList } from "@/api/apiManagement/userManagement";
import { useRoute } from "vue-router";
import superPaginationVue from "@/components/public/superPagination.vue";

export default defineComponent({
  name: "userNFTStore",
  components: { superElSelectVue, nftstorelist, superPaginationVue },
  setup() {
    const state = reactive({
      selectList: [
        { label: "作品类型", key: "types", icon: "icon-zuopinleixing", selectList: TYPES },
        { label: "曲风", key: "genre", icon: "icon-qufeng", selectList: GENRE },
        { label: "情绪", key: "mood", icon: "icon-qingxu", selectList: MOOD },
        { label: "语种", key: "language", icon: "icon-yuzhongqiehuan", selectList: LANGUAGE },
      ],
      route: useRoute(),
      nftStoreList: [],
      PageSize: {
        Page: 1,
        Size: 8,
      },
      total: 0,
      nameSort: 0, // 歌曲名字排序 0none 1asc 2desc
      holdingRatioSort: 0, // 持有比例排序
      isPrivate: false,
      SortTypeList: ["", "asc", "desc"],
    });
    const filterObj = computed(() => {
      let sort = getSort();
      return {
        ...state.PageSize,
        IsPrivate: Number(state.isPrivate),
        ...sort,
        State: -1,
      };
    });
    function getSort() {
      if (state.nameSort == 0 && state.holdingRatioSort == 0) {
        return { SortType: "", SortField: "" };
      }
      if (state.nameSort == 0 && state.holdingRatioSort !== 0) {
        return { SortType: state.SortTypeList[state.holdingRatioSort], SortField: "HoldCount" };
      }
      if (state.nameSort !== 0 && state.holdingRatioSort == 0) {
        return { SortType: state.SortTypeList[state.nameSort], SortField: "MusicTitle" };
      }
    }
    //获取nft仓库列表
    function getNftStoreList() {
      getNftMusicList({
        UserId: state.route.params.userId,
        ...filterObj.value,
      }).then((res: any) => {
        if (res.code == 0) {
          state.nftStoreList = res.data.list;
          state.total = res.data.total;
        } else {
          state.nftStoreList = [];
          state.total = 0;
        }
      });
    }
    function setSortType(key: string) {
      if (key == "nameSort") {
        state.holdingRatioSort = 0;
      } else {
        state.nameSort = 0;
      }
      if (state[key] == 2) {
        state[key] = 0;
        return;
      }
      state[key]++;
    }
    watch(
      () => filterObj.value,
      () => {
        getNftStoreList();
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return {
      ...toRefs(state),
      setSortType,
    };
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
    cursor: pointer;
    .nft-sort-item {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
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
  }
}
.nft-filter span {
  display: none;
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5%;
  flex-direction: column;
}
.infinite-list {
  display: grid;
  grid-template-columns: repeat(4, 260px);
  grid-row-gap: 10px;
  grid-column-gap: 27px;
}
</style>
