<template>
  <el-tooltip placement="bottom-start" effect="light">
    <slot name="container"></slot>
    <template #content>
      <slot name="tips"></slot>
    </template>
  </el-tooltip>
</template>
<script lang="ts">
import { ElTooltip } from "element-plus";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    ElTooltip,
  },
});
</script>
<style lang="scss">
.el-popper {
  box-shadow: 0px 12px 48px 16px rgba(0, 0, 0, 0.03), 0px 9px 28px 0px rgba(0, 0, 0, 0.05), 0px 6px 16px -8px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
}
</style>
