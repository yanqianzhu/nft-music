<template>
  <mainHeaderVue></mainHeaderVue>
  <footerVue bgcolor="#000" textcolor="#fff"></footerVue>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import mainHeaderVue from "@/components/header/mainHeader.vue";
import footerVue from "@/components/footer/index.vue";
export default defineComponent({
  name: "NFTCasting",
  components: {
    mainHeaderVue,
    footerVue,
  },
});
</script>
<style lang="scss" scoped></style>
