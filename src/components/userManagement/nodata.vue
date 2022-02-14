<template>
  <div class="no-data">
    <img src="@/assets/images/no-data.png" alt="" srcset="" />
    <p>暂无数据~</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "",
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5%;
    flex-direction: column;
  }
</style>
