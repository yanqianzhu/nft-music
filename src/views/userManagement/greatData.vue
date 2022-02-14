<template>
  <div class="greatData-box">
    <div class="systemData-title" style="font-weight: bold;">收到的赞</div>
    <!-- v-infinite-scroll="load" -->
    <div class="systemData-cont" >
      <div class="systemData-list" v-for="(item,index) in dataSource" :key="index">
        <div>
          <img :src="getUrl(item.headShotPath)" />
        </div>
        <div>
          <div>
            <span>{{item.userName}}</span>
            <span>赞了我的{{item.type == 1 ? '歌曲' : '评论'}}</span>
          </div>
          <div class="music-comment" @click="todetails(item.likesId)" v-if="item.type == 1">
            <div>
              <img :src="getUrl(item.cover)" />
              <img src="../../assets/images/caretimg.png" />
            </div>
            <div>{{item.musicName}}</div>
          </div>
          <div v-else class="like-comment">
            <div>
              我的评论
            </div>
            <div>{{item.Comment}}</div>
          </div>
          <div>{{dateFormat(item.createTime * 1000, 'yyyy-MM-dd HH:mm')}}</div>
        </div>
      </div>
      <superPaginationVue
        v-model:currentPage="page.current"
        v-model:pageSize="page.pageSize"
        :total="page.total"
      ></superPaginationVue>
     

      <!-- <div class="nodata" v-if="allLoad">没有更多了～</div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted, watch } from "vue";
import { getUserHeilList } from "@/api/apiManagement/userManagement";
import { dateFormat, getUrl } from "@/utils/filter";
import { useRouter } from "vue-router";
import superPaginationVue from "@/components/public/superPagination.vue";
export default defineComponent({
  components: {
    superPaginationVue
  },
  setup() {
    var state = reactive({
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      dataSource: [],
      router: useRouter(),
      allLoad: false,
      init: true
    });
    onMounted(() => {
      getData();
    })
    const load = () => {
      
      if (state.allLoad || state.init) return;
      console.log('load')
      state.page.current += 1;
    }
    function getData() {
      getUserHeilList({
        Page: state.page.current,
        Size: state.page.pageSize,
      }).then((res) => {
        state.init = false;
        const list = res.data.List || [];
        // state.dataSource = state.page.current == 1 ? list : state.dataSource.concat(list);
        state.dataSource = list;
        state.page.total = res.data.Total;
        if (state.dataSource.length == state.page.total) {
          state.allLoad = true;
        }
      })
    }
    watch(() => [state.page.pageSize], () => {
      if (state.page.current == 1) {
        getData();
      } else {
        state.page.current = 1;
      }
    })
    watch(() => state.page.current, () => {
      getData();
    })
    const todetails = (id: number) => {
      state.router.push('/musicDetails/' + id)
    }
    return {
      ...toRefs(state),
      getUrl,
      dateFormat,
      load,
      todetails
    };
  },
});
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.greatData-box {
  padding: 30px 40px 30px 35px;
  height: 100%;
  // display: flex;
  // flex-direction: column;
  .nodata {
    margin-top: 43px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    font-size: 14px;
    text-align: center;
  }
  .systemData-title {
    font-size: 24px;
    font-weight: 500;
    color: #333333;
    line-height: 33px;
    margin-bottom: 20px;
  }
  .systemData-cont {
    margin-top: 30px;
    // height: calc(100vh - 54px);
    .systemData-list {
      border-bottom: 1px solid #ebebff;
      padding: 16px 0 14px 21px;
      display: flex;
    }
    .systemData-list > div:nth-child(1) {
      > img {
        width: 40px;
        height: 40px;
      }
    }
    .systemData-list > div:nth-child(2) {
      margin-left: 8px;
      flex: 1;
      > div:nth-child(1) {
        > span:nth-child(1) {
          font-weight: 600;
          color: #333333;
          line-height: 20px;
          font-size: 14px;
        }
        > span:nth-child(2) {
          font-weight: 400;
          color: #666666;
          line-height: 17px;
          margin-left: 10px;
          font-size: 12px;
        }
      }
      > div:nth-child(3) {
        margin-top: 15px;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
      }
      .like-comment{
        display: flex;
        align-items: center;
        padding: 11px 0 11px 10px;
        background: #fafafb;
        margin-top: 12px;
        width: 100%;
        div:nth-child(1){
          color: #888888;
          font-size: 14px;

        }
        div:nth-child(2){
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-left: 10px;
        }
      }
      > .music-comment {
        padding: 11px 0 11px 10px;
        background: #fafafb;
        width: 855px;
        display: flex;
        margin-top: 12px;
        cursor: pointer;
        > div:nth-child(1) {
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #d8d8d8;
          position: relative;
          > img:nth-child(1) {
            width: 60px;
            height: 60px;
            position: absolute;
            left: 0;
            top: 0;
          }
          > img:nth-child(2) {
            width: 26px;
            height: 25px;
            position: relative;
            z-index: 10;
          }
        }
        > div:nth-child(2) {
          margin-left: 10px;
          line-height: 66.66px;
        }
      }
    }
  }
}
</style>
