<template>
  <el-input
    v-model="keyword"
    placeholder="搜索视频和用户"
    @input="handleSearch"
    class="input_style"
    
  >
    <template #prefix>
      <div class="icon_box">
        <svg-icon iconClass="search" className="search" />
      </div>
    </template>
    <template #suffix>
      <div class="search_btn" @click="handleSearch">搜索</div>
    </template>
  </el-input>
</template>

<script>
export default {
  name: "Search",
};
</script>
<script setup>
import { ref } from "vue";
const keyword = ref("");
function handleSearch() {
  console.log(keyword.value);
}
</script>

<style lang="scss">
.icon_box {
  display: flex;
  align-items: center;
  padding-left: 5px;
  .search {
    font-size: 16px;
  }
}
.search_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #424348;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #4b99ff;
  }
}

.input_style {
  // width: 20%;
  height: 40px;
  border-radius: 4px;
}
.input_style .el-input--prefix .el-input__inner {
  background-color: rgba(249, 249, 249, 1);
  border: none;
}
</style>
