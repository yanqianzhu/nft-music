<template>
  <div class="follow-container">
    <div class="follow-title">
      <h2>关注列表</h2>
    </div>
    <template v-if="page.total">
      <div v-for="item in dataSource" class="follow-item flex-middle-between">
        <div class="flex-center-center" @click="toMycenter(item.userId)">
          <el-avatar :size="50" :src="getUrl(item.avatar)"></el-avatar>
          {{ item.nickName }}
        </div>
        <div class="operate-box">
          <span @click="cancel(item)"> 取消关注 </span>
          <!-- <span> 私信 </span> -->
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
</template>

<script lang="ts">
import { ElAvatar, ElMessage } from "element-plus";
import { defineComponent, reactive, toRefs, onMounted, watch} from "vue";
import { getUserAttention, follow } from "@/api/apiManagement/userManagement";
import { getUrl } from "@/utils/filter";
import nodata from "@/components/userManagement/nodata.vue";
import superPaginationVue from "@/components/public/superPagination.vue";
import { useRouter } from "vue-router";
interface item  {
  nickName: string,
  avatar: string,
  introduction: string,
  userId: number
}
interface State {
  dataSource: item[],
  page: any,
  router: any
}
export default defineComponent({
  name: "Follow",
  components: {
    ElAvatar,
    nodata,
    superPaginationVue
  },
  setup() {
    const state: State = reactive({
      dataSource: [],
      router: useRouter(),
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    })
    onMounted(() => {
      getData();
    })
    function getData() {
      getUserAttention({
        page: state.page.current,
        size: state.page.pageSize
      }).then((res) => {
        state.dataSource = res.data.items || [];
        state.page.total = res.data.total;
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
    const cancel = (obj: item): void => {
      follow({
        action: false,
        followId: obj.userId
      }).then((res: any) => {
        if (res.code == 0) {
          getData()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    const toMycenter = (id: number): void => {
      state.router.push('/userCenter/' + id + '/nftStore')
    }
    return {
      ...toRefs(state),
      cancel,
      getUrl,
      toMycenter
    };
  },
});
</script>

<style lang="scss" scoped>
.flex-center-center{
  cursor: pointer;
}
.follow-container {
  padding: 30px 35px;
  .follow-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  .follow-item {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    height: 80px;
    border-bottom: 1px solid #ebebff;
    padding: 0px 20px;
    .el-avatar {
      margin-right: 20px;
    }
    .operate-box {
      span {
        cursor: pointer;
        user-select: none;
        &:last-child {
          margin-left: 40px;
        }
      }
    }
  }
}
</style>
