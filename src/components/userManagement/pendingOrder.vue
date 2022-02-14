<template>
  <el-dialog custom-class="sellsuc" v-model="visible" title="挂单列表" width="800px">
    <div class="pending-box">
      <el-table size="small" :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="起始日期"/>
        <el-table-column prop="name" label="截止日期" />
        <el-table-column prop="address" label="数量" />
        <el-table-column prop="address" label="单价/元" />
        <el-table-column prop="address" label="状态" />
        <el-table-column prop="address" label="操作">
          <template #default="scope">
            <el-popconfirm title="确定取消该NFT出售中状态?" confirm-button-text="是的" cancel-button-text="不了">
              <template #reference>
                <span class="cancel">取消出售</span>
              </template>
            </el-popconfirm>
            
          </template>
        </el-table-column>
      </el-table>
      <superPaginationVue
        v-model:currentPage="page.current"
        v-model:pageSize="page.pageSize"
        :total="page.total"
      ></superPaginationVue>
    </div>
    
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
import managementItemVue from "@/components/userManagement/managementItem.vue";
export default defineComponent({
  name: "",
  components: {
    managementItemVue
  },
  setup() {
    const state = reactive({
      tableData: [{}],
      visible: false,
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
    })
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
    const getData = () => {

    }
    return {
      ...toRefs(state)
    };
  },
});
</script>
<style lang="scss" scoped>
  .pending-box{
    padding-bottom: 20px;
  }
  .cancel{
    color: #4B99FF;
    font-size: 14px;
    cursor: pointer;
  }
</style>
