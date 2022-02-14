<template>
  <div class="avatar" :class="shape === 'circle' ? 'shape-circle' : ''">
    <img :src="avatarSrc" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
export default defineComponent({
  props: {
    src: String,
    type: {
      type: String,
      default: "C2C",
    },
    shape: {
      type: String,
      default: "circle",
    },
  },
  setup(props: any) {
    let defaultSrc = computed(() => {
      switch (props.type) {
        case "C2C":
          // 个人头像
          return "https://imgcache.qq.com/open/qcloud/video/act/webim-avatar/avatar-2.png";
        case "GROUP":
          // 群默认头像
          return "https://imgcache.qq.com/open/qcloud/video/act/webim-avatar/avatar-3.png";
        default:
          // 默认头像
          return "https://imgcache.qq.com/open/qcloud/video/act/webim-avatar/avatar-1.png";
      }
    });
    let avatarSrc = computed(() => {
      let src = props.src;
      if (/^(https:|http:|\/\/)/.test(src)) {
        return src;
      } else {
        return defaultSrc.value;
      }
    });
    return {
      avatarSrc,
      defaultSrc,
    };
  },
});
</script>

<style lang="scss" scoped>
$first: #3ef3ed;
.avatar {
  background-color: $first;
  text-align: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.shape-circle {
  border-radius: 50%;
}
</style>
