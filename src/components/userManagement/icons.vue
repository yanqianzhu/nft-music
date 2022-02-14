<template>
  <el-icon>
    <component :is="name"></component>
  </el-icon>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as Icons from "@element-plus/icons";
export default defineComponent({
  components: Icons,
  name: "",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped></style>


