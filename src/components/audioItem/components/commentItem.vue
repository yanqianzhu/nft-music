<template>
  <div class="comment-item">
    <el-avatar :icon="UserFilled" size="40"></el-avatar>
    <div class="item-message">
      <p class="user-box">
        <span class="user-name">
          {{ user.name }}
          <span class="user-createtime">{{ user.createTime }}</span>
        </span>
        <svg-icon iconClass="more" className="icon-more"></svg-icon>
      </p>
      <p class="user-message">
        {{ user.message }}
      </p>
      <p class="user-likes">
        <span> <svg-icon iconClass="dislike" className="icon-dislike"></svg-icon>{{ user.likes }} </span>
        <span> <svg-icon iconClass="comment-reply" className="icon-reply"></svg-icon>回复</span>
      </p>
      <p class="user-reply">
        <span>
          展开{{ user.reply }}条回复
          <svg-icon iconClass="caret-down" className="icon-caret-down"></svg-icon>
        </span>

        <svg-icon iconClass="caret-up" className="icon-caret-up"></svg-icon>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive ,defineComponent} from "vue";
import { UserFilled } from "@element-plus/icons";
export default defineComponent({
  name: "commentItme",
  props: {
    user: {
      type: Object,
      default: {
        name: "评论者名",
        createTime: "2012-11-15",
        message: "不错，继续加油",
        likes: 1174,
        reply: 44,
      },
    },
  },
  setup(props: Object) {
    const data = reactive({});
    return {UserFilled};
  },
});
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  padding: 18px 0px;
  width: 100%;
  .svg-icon {
    cursor: pointer;
  }
  .item-message {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 12px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(235, 235, 255, 1);
    .user-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: rgba(102, 102, 102, 1);
      margin-bottom: 6px;
      .user-createtime {
        padding-left: 6px;
      }
    }
    .user-message {
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 15px;
    }
    .user-likes {
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 11px;
      .svg-icon {
        margin-right: 2px;
      }
      span {
        margin-right: 17px;
      }
    }
    .user-reply {
      font-size: 12px;
      color: rgba(153, 153, 153, 1);
      .icon-caret-up {
        margin-left: 15px;
      }
      span{
          cursor: pointer;
      }
    }
  }
}
</style>
