<template>
  <div class="super-pagination">
    <el-pagination layout="slot" :total="total" :hide-on-single-page="true">
      <div class="tofirst" @click="changeCurrentPage(1)">回到第一页</div>
    </el-pagination>
    <el-pagination
      v-model:currentPage="currentPage"
      :page-sizes="pageSizes"
      v-model:pageSize="pageSize"
      layout="prev, pager, next, jumper"
      :total="total"
      style="--el-pagination-button-height: 32px"
      :hide-on-single-page="true"
    >
    </el-pagination>
    <el-pagination layout="slot" :total="total" :hide-on-single-page="true">
      <div class="tolast" @click="changeCurrentPage()">尾页</div>
    </el-pagination>
    <el-pagination
      v-model:currentPage="currentPage"
      :page-sizes="pageSizes"
      v-model:pageSize="pageSize"
      layout="sizes"
      :total="total"
      :hide-on-single-page="true"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { ElPagination } from "element-plus";
import { ref, defineComponent, watch, watchEffect, computed } from "vue";
export default defineComponent({
  name: "superPaination",
  components: { ElPagination },
  props: {
    pageSizes: {
      default: [5, 10, 15, 20],
    },
    total: Number,
    currentPage: Number,
    pageSize: Number
  },
  setup(props, content) {
    // --------------------初始化 page
    const currentPage = ref(1);
    watchEffect(() => {
      let currentPageValue = props.currentPage;
      currentPage.value = currentPageValue;
    });
    watch(currentPage, (val) => {
      content.emit("update:currentPage", val);
    });
    //--------------------初始化 pageSize
    const pageSize = ref(props.pageSize);
    watch(pageSize, (val) => {
      content.emit("update:pageSize", val);
    });
    //----------------------------------
    
    const maxPage = computed(() => {
      const total = ref(props.total);
      return Math.ceil(total.value / pageSize.value);
    });
    const changeCurrentPage = (page?: number) => {
      if (page) {
        currentPage.value = page;
        return;
      }
      
      currentPage.value = maxPage.value;
    };
    return { currentPage, pageSize, changeCurrentPage };
  },
});
</script>

<style lang="scss" scoped>
$active: #4b99ff;
$defaultbg: rgba(0, 0, 0, 0.15);
$defaultText: rgba(0, 0, 0, 0.65);
@mixin btnCss {
  height: 32px;
  line-height: 32px;
  background: #ffffff;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid $defaultbg;
  font-size: 14px;
  font-weight: 400;
  color: $defaultText;
}
.super-pagination {
  margin-top: 40px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: right;
  text-align: center;
  .tofirst {
    width: 100px;
    @include btnCss;
  }
  .tolast {
    width: 52px;
    @include btnCss;
  }
  .tofirst,
  .tolast {
    user-select: none;
    &:hover {
      border: 1px solid $active;
      color: $active;
    }
  }
}
</style>
<style lang="scss">
$active: #4b99ff;
$defaultbg: rgba(0, 0, 0, 0.15);
$defaultText: rgba(0, 0, 0, 0.65);
.super-pagination {
  .btn-prev,
  .btn-next,
  .el-pager li {
    border: 1px solid $defaultbg !important;
    height: 32px;
    line-height: 32px;
    margin: 0px;
    margin-right: 8px;
  }
  .btn-prev,
  .btn-next {
    width: 32px;
    padding: 0;
    min-width: 32px;
    &:disabled:hover {
      border: 1px solid $defaultbg !important;
    }
    &:hover {
      border: 1px solid $active !important;
    }
  }
  .el-pager li {
    margin-right: 8px;
  }
  .el-pager {
    .btn-quicknext,
    .btn-quickprev {
      border: none !important;
    }
    li.number.active {
      border: 1px solid $active !important;
    }
    li.number:hover {
      border: 1px solid $active !important;
    }
  }
}
</style>
