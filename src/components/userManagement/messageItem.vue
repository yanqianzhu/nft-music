<template>
  <div class="message-wrapper" :class="messagePosition">
    <div class="c2c-layout" :class="messagePosition">
      <div class="col-1">
        <!-- 头像 -->
        <avatarVue :src="avatar" />
      </div>
      <div class="col-2">
        <!-- 消息主体 -->
        <div class="content-wrapper">
          123
          <text-element :isMine="isMine" :payload="message.payload" :message="message" />
          <!-- <span v-else>暂未支持的消息类型：{{ message.type }}</span> -->
        </div>
      </div>
      <div class="col-3">
        <!-- 消息状态 -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { mapState } from "vuex";
import TextElement from "@/components/userManagement/text-element.vue";
import avatarVue from "./avatar.vue";
import { computed } from "vue";
export default {
  name: "MessageItem",
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  components: {
    TextElement,
    avatarVue,
  },
  setup(props: any) {
    let avatar = computed(() => {
      return props.message.avatar;
    });
    const currentConversationType = "C2C";
    let isMine = computed(() => {
      return props.message.flow === "out";
    });
    let messagePosition = computed(() => {
      if (isMine.value) {
        return "position-right";
      } else {
        return "position-left";
      }
    });
    return {
      avatar,
      currentConversationType,
      isMine,
      messagePosition,
    };
  },
};
</script>

<style lang="scss" scoped>
.message-wrapper {
  margin: 20px 0;

  .content-wrapper {
    display: flex;
    align-items: center;
  }
}

.group-layout,
.c2c-layout,
.system-layout {
  display: flex;

  .col-1 {
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
    }
  }

  .group-member-avatar {
    cursor: pointer;
  }

  .col-2 {
    display: flex;
    flex-direction: column;
    // max-width 50% // 此设置可以自适应宽度，目前由bubble限制
  }

  .col-3 {
    width: 30px;
  }

  &.position-left {
    .col-2 {
      align-items: flex-start;
    }
  }

  &.position-right {
    flex-direction: row-reverse;

    .col-2 {
      align-items: flex-end;
    }
  }

  &.position-center {
    justify-content: center;
  }
}

.c2c-layout {
  .col-2 {
    .base {
      margin-top: 3px;
    }
  }
}

.group-layout {
  .col-2 {
    .chat-bubble {
      margin-top: 5px;
      outline: none;
    }
  }
}
</style>
