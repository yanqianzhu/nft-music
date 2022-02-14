<template>
  <h3 class="main-title">
    <svg-icon iconClass="music-icon" className="icon-music-icon"></svg-icon>
    <span :class="{ required: required }">
      {{ title }}
    </span>
  </h3>
</template>

<script lang="ts">
export default {
  props: {
    title: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.main-title {
  margin-bottom: 30px;
  position: relative;
  .icon-music-icon {
    margin-right: 20px;
  }
  font-size: 22px;
  font-weight: 500;
  color: #333333;
  .required {
    &::before {
      content: "*";
      color: RGBA(255, 0, 0, 1);
      position: absolute;
      font-size: 22px;
      left: 30px;
      top: 0px;
    }
  }
}
</style>
