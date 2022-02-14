<template>
  <div class="box">
    <div class="tips" :style="{ '--width': width, '--height': height }">
      <span v-if="tips">{{ tips }}</span>
      <slot />
    </div>
    <svg-icon
      :iconClass="iconName"
      className="icon-btn"
      @click="$emit('funcToggle')"
    />
  </div>
</template>

<script>
export default {
  name: "IconButton",
  emits: ["funcToggle"],
  props: {
    tips: {
      type: String,
      default: "",
    },
    iconName: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "80px",
    },
    height: {
      type: String,
      default: "40px",
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  height: 40px;
  margin-left: 20px;
  position: relative;
  &:hover .tips {
    opacity: 1;
  }
  .tips {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--width);
    height: var(--height);
    padding: 10px 15px;
    border-radius: 2px;
    background-color: #282a3b;
    opacity: 0;
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.3s linear;
    span {
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      user-select: none;
    }
  }
  .icon-btn {
    font-size: 16px;
    cursor: pointer;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
