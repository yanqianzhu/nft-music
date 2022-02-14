<template>
  <h2 class="work-title">我的作品</h2>
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
      <el-input @keyup.enter="searchClick" v-model="searchText" placeholder="搜索关键词" class="work-search sort-box">
        <template #suffix>
          <el-icon @click="searchClick" class="input-suffix">
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="container-box">
      <div class="filter-box">
        <div class="status-box">
          <span
            v-for="(item, index) in statusList"
            :key='index'
            class="status-item"
            :class="{ active: statusIndex == index }"
            @click="statusIndex = index"
            >{{ item }}
          </span>
        </div>
        <el-select v-model="sortType" placeholder="Select" class="select-box">
          <el-option
            v-for="item in sortTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="list.length">
        <managementItemVue
          v-for="item in list"
          :key="item"
          :type="1"
          :itemInfo="item"
          @changeAccessShow="changeAccessShow"
          @setNftTop="setNftTop"
        ></managementItemVue>
        <superPaginationVue
          v-model:currentPage="page.current"
          v-model:pageSize="page.pageSize"
          :total="page.total"
        ></superPaginationVue>
      </div>
      <nodata v-else />
    </div>
    <el-dialog v-model="accessShow" title="权限控制" width="470px">
      <div class="assess-dialog">
        <div class="music-info">
          <el-image style="width: 80px; height: 80px" :src="getUrl(authItem.cover)" fit="cover"></el-image>
          <p>{{authItem.name}}-{{authItem.singing}}</p>
        </div>
        <h4>谁可以看</h4>
        <el-radio-group v-model="canSee" style="--el-color-primary: #000">
          <el-radio :label="0">公开</el-radio>
          <el-radio :label="1">仅自己可见</el-radio>
        </el-radio-group>
        <!-- <h4>允许他人下载歌曲</h4>
        <el-radio-group v-model="canDownload" style="--el-color-primary: #000">
          <el-radio :label="0">允许</el-radio>
          <el-radio :label="1">不允许</el-radio>
        </el-radio-group> -->
        <div class="btn-box">
          <span class="cancel" @click="accessShow = false"> 取消 </span>
          <span class="save" @click="accessSave"> 保存 </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { toRef, defineComponent, reactive, toRefs, watch, computed, onMounted } from "vue";
import { Search, ArrowDownBold } from "@element-plus/icons";
import workItem from "@/components/userManagement/workItem.vue";
import superPaginationVue from "@/components/public/superPagination.vue";
import { ElIcon, ElSelect, ElDialog, ElImage, ElRadioGroup, ElRadio, ElMessage } from "element-plus";
import managementItemVue from "@/components/userManagement/managementItem.vue";
import { myWorks, workPrivate } from "@/api/apiManagement/userManagement";
import nodata from "@/components/userManagement/nodata.vue";
import { getUrl } from "@/utils/filter";
export default defineComponent({
  components: {
    managementItemVue,
    workItem,
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
      tabsData: ["全部", "歌曲", "Demo", "翻唱", "伴奏"],
      tabsStatus: [-1, 10041, 10042, 10043, 10044],
      searchText: "",
      trueSearchText: '',
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      activeIndex: 0,
      statusList: ["全部", "已发布", "审核中", "未通过", "仅我可见"],
      status: [-1, 10031, 10032, 10033, -2],
      statusIndex: 0,
      sortType: 'create_time',
      list: [],
      sortTypeList: [
        { label: "发布时间排序", value: 'create_time' },
        { label: "播放数排序", value: 'play_count' },
        { label: "点赞数排序", value: 'like_count' },
        { label: "评论数排序", value: 'comment_count' },
        { label: "收藏数排序", value: 'collection_count' },
      ],
      authItem: {
        cover: '',
        name: '',
        singing: '',
        id: 0
      },
      loading: false,
      accessShow: false, // 权限控制弹窗
      canSee: 0,
      canDownload: 0,
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    });
    const linePos = computed(() => {
      return data.activeIndex * 100 + "px";
    });
    //-------------------methods
    function changeAccessShow(item: any) {
      data.authItem = item;
      data.canSee = item.isPrivate;
      data.accessShow = true;
    }
    function accessSave() {
      workPrivate({
        musicId: data.authItem.id,
        isPrivate: data.canSee,
      }).then((res: any) => {
        if (res.code == 0) {
          ElMessage.success('操作成功');
          data.accessShow = false;
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
      console.log("save");
    }
    //-------------watch
    
    onMounted(() => {
      getData()
    })
    const getData = () => {
      const obj: any = {
        page: data.page.current,
        size: data.page.pageSize,
        musicType: data.tabsStatus[data.activeIndex],
        keyword: data.trueSearchText,
        sortField: data.sortType,
        sortType: 'desc'
      }
      if (data.status[data.statusIndex] == -2) {
        obj.isPrivate = 1
      } else {
        obj.status = data.status[data.statusIndex];
        obj.isPrivate = -1
      }
      myWorks(obj).then((res: any) => {
        if (res.code == 0) {
          data.list = res.data.items;
          data.page.total = res.data.total;
        }
      
      })
    }
    const searchClick = () => {
      data.trueSearchText = data.searchText.trim();
      if (data.page.current == 1) {
        getData();
      } else {
        data.page.current = 1;
      }
      
    }
    watch(() => [data.page.pageSize, data.sortType, data.statusIndex, data.activeIndex], () => {
      if (data.page.current == 1) {
        getData();
      } else {
        data.page.current = 1;
      }
    })
    watch(() => data.page.current, () => {
      getData();
    })
    const setNftTop = (): void => {
      getData()
    }
    return { ...toRefs(data), linePos, changeAccessShow, accessSave, getData, searchClick, setNftTop, getUrl };
  },
});
</script>

<style lang="scss" scoped>
.work-title {
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
        &:hover {
          color: #000;
        }
        &.active {
          font-size: 14px;
          font-weight: 600;
          color: #333333;
        }
      }
    }
  }
}
.assess-dialog {
  .music-info {
    display: flex;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    background-color: RGBA(250, 250, 251, 1);
    padding: 10px 13px;
    .el-image {
      margin-right: 10px;
    }
    p{
      flex: 1;

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
