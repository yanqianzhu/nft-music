<template>
  <div v-for="(item, index) in contentList" :key="index">
    <span class="text-box" v-if="item.name === 'text'">{{ item.text }}</span>
    <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px" />
  </div>
  <!-- <div class="chat-bubble">
    <div class="message-content" :class="isMine ? 'message-send' : 'message-received'">
      <template v-for="(item, index) in contentList">
        <span :key="index" v-if="item.name === 'text'">{{ item.text }}</span>
        <img v-else-if="item.name === 'img'" :src="item.src" width="20px" height="20px" :key="index"/>
      </template>
    </div>
  </div> -->
</template>

<script lang="ts">
// import MessageBubble from "../message-bubble";
import { decodeText } from "@/utils/decodeText";
import { computed } from "vue";
export default {
  name: "TextElement",
  components: {
    // MessageBubble,
  },
  props: {
    payload: {
      type: Object,
      required: true,
    },
    message: {
      type: Object,
      required: true,
    },
    isMine: {
      type: Boolean,
    },
  },
  setup(props: any) {
    const contentList = computed(() => {
      return decodeText(props.payload);
    });
    return {
      contentList,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-box {
  display: inline-block;
  width: 100%;
  overflow: hidden;
}
</style>
