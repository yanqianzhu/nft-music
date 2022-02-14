<template>
  <h2 class="nftstore-title">NFT铸造批次管理</h2>
  <el-dialog v-model="visible" title="概览" width="470px">
    <div class="overview">
        <div>
          <span>NFT名字</span>
          <span>{{selectItem.NftTitle}}</span>
        </div>
        <div>
          <span>歌曲名字</span>
          <span>{{selectItem.MusicTitle}}</span>
        </div>
        <div>
          <span>铸造时间</span>
          <span>{{dateFormat(selectItem.CreateTime * 1000, 'yy-MM-dd hh:mm')}}</span>
        </div>
        <div>
          <span>原铸造比例</span>
          <span>{{(selectItem.CopyrightProportion/100).toFixed(2)}}%</span>
        </div>
        <div>
          <span>剩余比例</span>
          <span>{{(100 - selectItem.CopyrightProportion/100).toFixed(2)}}%</span>
        </div>
        <div>
          <span>剩余数量</span>
          <span>{{selectItem.FreezeCount + selectItem.HoldCount}}个</span>
        </div>
        <p>
          <span>确认回收后，剩余比例将会回到您持有比例中，您可以进行重新铸造</span>
        </p>
    </div>
    <template #footer>
        <span class="dialog-footer">
        <el-button type="primary" @click="visible = false"
            >确认回收</el-button
        >
        </span>
    </template>
  </el-dialog>
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
    <div class="container-box" v-if="dataSource.length">
      <managementItemVue v-for="item in dataSource" :key="item" v-model:visible="visible" :itemInfo="item" @changeSelectItem="changeSelectItem" :type="3"></managementItemVue>
      <superPaginationVue
        v-model:currentPage="currentPage"
        v-model:pageSize="pageSize"
        :total="total"
      ></superPaginationVue>
    </div>
    <nodata v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, computed, onMounted } from "vue";
import { Search, ArrowDownBold } from "@element-plus/icons";
import superPaginationVue from "@/components/public/superPagination.vue";
import { ElIcon, ElSelect, ElDialog, ElImage, ElRadioGroup, ElRadio } from "element-plus";
import managementItemVue from "@/components/userManagement/managementItem.vue";
import { getUserMusicNftList } from "@/api/apiManagement/userManagement";
import { dateFormat } from "@/utils/filter";
import nodata from "@/components/userManagement/nodata.vue";
export default defineComponent({
  name: "nftBatchManagement",
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
    nodata
  },
  setup() {
    const data = reactive({
      tabsData: ["全部铸造", "已上架", "铸造中", "未上架", "已回收", "已售罄"],
      tabsState: [-1, 10064, 10061, 10065, 10063, 10062],
      total: 0,
      activeIndex: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      dataSource: [],
      visible: false,
      selectItem: {
        NftTitle: '',
        MusicTitle: 1,
        musicNftTitle: '',
        Id: '',
        Singing: '',
        MusicNftId: '',
        CopyrightProportion: 0,
        HoldCount: 0,
        FreezeCount: 0,
        CreateTime: 0,
        CastingCount: 0
      }
    });
    onMounted(() => {
      getData();
    })
    function getData() {
      getUserMusicNftList({
        Page: data.currentPage,
        Size: data.pageSize,
        state: data.tabsState[data.activeIndex]
      }).then((res) => {
        data.dataSource = res.data.list || [];
        data.total = res.data.total;
      })
    }
    const linePos = computed(() => {
      return data.activeIndex * 100 + "px";
    });
    const changeSelectItem = (obj: any): void => {
      data.selectItem = obj;
    }
    //-------------------methods
    //-------------watch
    watch(() => [data.activeIndex, data.pageSize], () => {
      if (data.currentPage == 1) {
        getData();
      } else {
        data.currentPage = 1;
      }
    })
    watch(() => data.currentPage, (val, old) => {
        getData();
      }
    );
    return { ...toRefs(data), linePos, changeSelectItem, dateFormat };
  },
});
</script>

<style lang="scss" scoped>
.overview{
  >div{
    height: 50px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.09);
    display: flex;
    justify-content: space-between;
    align-items: center;
    span:nth-child(1){
      color: #999999;
      font-weight: bold;
    }
    span:nth-child(2){
      color: #333333;
      font-weight: bold;
    }
  }
  p{
    padding: 22px 0 0;
    span{
      font-size: 12px;
      color: #AAAAAA;
    }

  }
}
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
