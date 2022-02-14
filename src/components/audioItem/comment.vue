<template>
  <main class="comment-box" v-if="commentShow">
    <h3 class="comment-title">
      全部评论（{{ commentSum }}）
      <svg-icon iconClass="delete" className="icon-delete" @click="changeCommentShow"></svg-icon>
    </h3>
    <div class="comments">
      <comment-item-vue v-for="item in 5" :key="item"></comment-item-vue>
    </div>
  </main>
</template>

<script lang="ts">
import { ref } from "vue";
import commentItemVue from "./components/commentItem.vue";
export default {
  name: "commentBox",
  components: { commentItemVue },
  props: {
    commentSum: {
      type: Number,
      default: 0,
    },
  },
  setup(props: Object) {
    const commentShow = ref(false);
    const changeCommentShow = () => {
      commentShow.value = !commentShow.value;
    };
    return { commentShow, changeCommentShow };
  },
};
</script>
<style lang="scss" scoped>
@mixin hiddenScrollBar {
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
.comment-box {
  width: 100%;
  height: 100%;
  padding: 20px 25px;
  .comment-title {
    margin: 0;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    .icon-delete {
      cursor: pointer;
    }
  }
  .comments{
    overflow-y: scroll;
    height: 97%;
    @include hiddenScrollBar;
  }
}
</style>
