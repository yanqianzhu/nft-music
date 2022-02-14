<template>
  <div class="collectionData-box">
    <div class="tabs-box flex-middle-between">
      <div class="tille" style="font-weight: bold;">收藏管理</div>
      <el-input
        v-model="searchText"
        placeholder="搜索关键词"
        class="work-search sort-box"
        @keyup.enter="searchClick"
      >
        <template #suffix>
          <el-icon class="input-suffix">
            <Search @click="searchClick"  />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="collect-content">
      <div class="cont-tile">
        <div class="tabs-box">
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
        <div class="right">
          <el-select v-model="sortType" placeholder="Select" class="select-box">
            <el-option
              v-for="item in timeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <span>收藏时间排序</span>
          <img src="../../assets/images/dow.png" /> -->
        </div>
      </div>
      <template v-if="page.total">
        <div class="collect-list" v-for="(item,index) in dataSource" :key="index">
          <div class="management-item">
            <div class="list-left">
              <div>
                <img
                  :src="getUrl(item.cover)"
                />
              </div>
            </div>
            <div class="list-right">
              <div class="music-name flex-middle-between">
                <div class="flex">
                  <span>{{item.name}}-{{item.singing}}</span>
                  <span v-if="item.isTop">置顶</span>
                </div>
                <div class="music-create-time">{{dateFormat(item.createTime * 1000, 'yyyy-MM-dd HH:ss')}}</div>
              </div>
              <div class="types-box">
                <span v-for="(ele, i) in (item.labels || [])">{{ele}}</span>
                
              </div>
              <div class="operate-box flex-middle-between">
                <div class="count-box">
                  <span>
                    <i class="iconfont icon-bofang"></i>
                    {{item.playCount}}
                  </span>
                  <span>
                    <i class="iconfont icon-dianzan"></i>
                    {{item.likeCount}}
                  </span>
                  <span>
                    <i class="iconfont icon-pinglun"></i>
                    {{item.commentCount}}
                  </span>
                  <span>
                    <i class="iconfont icon-shoucangjia"></i>
                    {{item.collectionCount}}
                  </span>
                </div>
                <div class="more-box">
                  <span v-if="!item.isTop" @click="musicTop(item.id, 1)">置顶</span>
                  <span v-else @click="musicTop(item.id, 0)">取消置顶</span>
                  <span @click="collect(item.musicId, 0)">取消收藏</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <superPaginationVue
          v-model:currentPage="page.current"
          v-model:pageSize="page.pageSize"
          :total="page.total"
        ></superPaginationVue>
      </template>
      <nodata v-else />
    </div>
  </div>
</template>
<script lang="ts">
import { Edit } from "@element-plus/icons";
import { ElAvatar, ElMessage } from "element-plus";
import { Search } from "@element-plus/icons";
import { defineComponent, reactive, toRefs, computed, onMounted, watch } from "vue";
import { getCollectionMusicList, collectTop } from "@/api/apiManagement/userManagement";
import { setMusicCollectStatusApi } from '@/api/apiManagement/audio';
import managementItemVue from "@/components/userManagement/managementItem.vue";
import { getUrl, dateFormat } from "@/utils/filter";
import nodata from "@/components/userManagement/nodata.vue";
export default defineComponent({
  name: "accountSettings",
  components: {
    ElAvatar,
    Search,
    Edit,
    managementItemVue,
    nodata
  },
  props: {
    type: Number,
  },
  setup() {
    var state = reactive({
      searchText: "",
      activeIndex: 0,
      sortType: 'create_time',
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tabsData: ["全部", "歌曲", "Dome", "翻唱", "伴奏"],
      musicType: [-1, 10041, 10042, 10043, 10044],
      timeTypeList: [
        { label: "收藏时间排序", value: 'create_time' },
        { label: "播放数排序", value: 'play_count' },
        { label: "点赞数排序", value: 'like_count' },
        { label: "评论数排序", value: 'comment_count' },
      ],
      keyword: '',
      workDataList: [
        "icon-bofang",
        "icon-dianzan",
        "icon-pinglun",
        "icon-shoucangjia",
      ],
      dataSource: [],

    });
    const linePos = computed(() => {
      return state.activeIndex * 100 + "px";
    });
    onMounted(() => {
      getData();
    })
    const searchClick = () => {
      state.keyword = state.searchText.trim();
      if (state.page.current == 1) {
        getData();
      } else {
        state.page.current = 1;
      }
    }
    function getData() {
      getCollectionMusicList({
        page: state.page.current,
        size: state.page.pageSize,
        keyword: state.keyword,
        musicType: state.musicType[state.activeIndex],
        sortField: state.sortType,
        sortType: 'desc'
      }).then((res) => {
        state.dataSource = res.data.items || [];
        state.page.total = res.data.total;
      })
    }
    watch(() => [state.page.pageSize, state.activeIndex, state.sortType], () => {
      if (state.page.current == 1) {
        getData();
      } else {
        state.page.current = 1;
      }
    })
    const musicTop = (id: number, istop: number): void => {
      collectTop({
        id: id,
        opt: istop
      }).then((res: any) => {
        if (res.code === 0) {
          getData()
          ElMessage.success('操作成功');
        } else {
          ElMessage.error(res.msg);
        }
      })
    }
    watch(() => state.page.current, () => {
      getData();
    })
    const collect = (id: number, type: number): void => {
      setMusicCollectStatusApi({
        MusicId: id,
        Opt: type
      }).then((res: any) => {
        if (res.code == 0) {
          getData();
          ElMessage.success('操作成功');
        } else {
          ElMessage.error(res.msg);
        }
      })
    }
    return {
      ...toRefs(state),
      linePos,
      dateFormat,
      getUrl,
      musicTop,
      collect,
      searchClick
    };
  },
});
</script>

<style lang="scss" scoped>
.collectionData-box {
  padding: 30px 40px 30px 35px;
  .collect-list {
    padding-top: 30px;
    .management-item {
      padding: 20px 0px;
      border-bottom: 1px solid #ebebff;
    }
    > div {
      display: flex;
      .list-left {
        display: flex;
        width: 140px;
        height: 140px;
        > div:nth-child(1) {
          > img {
            width: 140px;
            height: 140px;
          }
        }
      }
      .list-right {
        padding: 4px 0px 0px 25px;
        flex-grow: 1;
        height: 140px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .operate-box {
          margin-top: 35px;
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
        .types-box {
          margin-top: 23px;
          > span {
            display: inline-block;
            margin-right: 15px;
            width: 50px;
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
        .music-name {
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          .music-create-time {
            font-size: 12px;
            font-weight: 400;
            color: #999999;
          }
          .flex {
            align-items: center;
            display: flex;
          }
          .flex > span:nth-child(1) {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            margin-right: 19px;
          }
          .flex > span:nth-child(2) {
            padding: 2px 7px;
            font-size: 12px;
            font-weight: 400;
            border-radius: 2px;
            border: 1px solid #d0d0d0;
            margin-right: 12px;
            text-align: center;
            user-select: none;
            background: #000000;
            color: #fff;
          }
        }
        .flex-middle-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
  .tabs-box {
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
    ul {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      height: 100%;
      list-style: none;
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
      }
      li.active {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }
  }
  .collect-content {
    margin-top: 33px;
    .cont-tile {
      display: flex;
      border-bottom: 1px solid #ebebff;
      .right {
        width: 150px;
        height: 32px;
        background: #f5f4f4;
        border-radius: 2px;
        text-align: center;
        font-weight: 400;
        color: #888888;
        line-height: 22px;
        font-size: 14px;
        line-height: 32px;
        display: flex;
        align-items: center;
        > img {
          width: 14px;
          height: 14px;
          margin-left: 28px;
        }
      }
    }
  }

  .tille {
    font-size: 24px;
    font-weight: 500;
    color: #333333;
    line-height: 33px;
    margin-bottom: 20px;
  }
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
