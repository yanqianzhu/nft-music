<template>
  <el-popover placement="bottom-start" v-model:visible="isShow" :width="500" trigger="click">
    <template #reference>
      <slot name="label" v-if="slotsLabel" :isShow="isShow"></slot>
      <div class="popover-label flex-middle-between" v-else>
        <div class="text-box flex-center-center">
          <p class="icon-box flex-center-center">
            <i class="iconfont" :class="icon" v-if="icon.indexOf('icon-') >= 0"></i>
            <template v-else> NFT </template>
          </p>
          {{ label }}
        </div>
        <el-icon>
          <arrow-up-bold v-if="isShow" />
          <arrow-down-bold v-else />
        </el-icon>
      </div>
    </template>
    <div class="label-box">
      <p class="lable-title">
        {{ label }}
      </p>
      <div class="label-item-box">
        <span
          v-for="item in list"
          class="label-item"
          :class="{ active: item.isSelect }"
          @click="addFilterItem(item)"
        >
          {{ item.label }}
        </span>
      </div>
    </div>
  </el-popover>
</template>
<script lang="ts">
import { defineComponent, ref, useSlots, onBeforeUnmount, toRaw, reactive, toRefs } from "vue";
import { ElPopover, ElIcon } from "element-plus";
import { ArrowDownBold, ArrowUpBold } from "@element-plus/icons";

// @ts-ignore
import { getUuiD } from "@/utils/validate.js";
import mitter from "@/utils/mitt";

export default defineComponent({
  name: "superElSelect",
  components: { ElPopover, ElIcon, ArrowDownBold, ArrowUpBold },
  props: {
    icon: {
      type: String,
      default: "NFT",
    },
    label: {
      type: String,
    },
    selectList: {
      type: Array,
      default: [],
    },
    itemKey: String,
    type: Number,
  },
  setup(props) {
    const data = reactive({
      Value: "",
      filterList: [], // 筛选展示 list
      value: "",
    });
    onBeforeUnmount(() => {
      mitter.off("addFilter");
      mitter.off("deleteFilter");
    });
    const list = ref([]);
    for (let index = 0; index < props.selectList.length; index++) {
      // const item = { label: props.selectList[index], id: getUuiD(12), isSelect: false };
      const item = {
        label: props.selectList[index],
        isSelect: false,
        key: props.itemKey,
        type: props.type,
      };
      list.value.push(item);
    }
    const isShow = ref(false);
    const slotsLabel = ref(!!useSlots().label);
    const addFilterItem = (item: any) => {
      item.isSelect = !item.isSelect;
      if (item.isSelect) {
        mitter.emit("addFilter", toRaw(item));
      } else {
        mitter.emit("deleteFilter", toRaw(item));
      }
    };
    mitter.on("deleteFilter", (data: any) => {
      if (list.value.indexOf(data) > 0) {
        list.value[list.value.indexOf(data)].isSelect = false;
      }
    });
    return { list, isShow, slotsLabel, addFilterItem, ...toRefs(data) };
  },
});
</script>
<style lang="scss">
.popover-label {
  width: 180px;
  flex-direction: row;
  padding: 5px 25px 5px 10px;
  background: linear-gradient(270deg, #cac5ff 0%, #d9e9ff 100%);
  border-radius: 22px;
  cursor: pointer;
  .text-box {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    .icon-box {
      background-color: #000;
      color: #fff;
      font-size: 14px;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 10px;
      user-select: none;
      margin-right: 20px;
      .iconfont {
        display: inline-block;
        font-size: 18px;
      }
    }
  }
}
.label-box {
  .lable-title {
    margin-bottom: 10px;
  }
  .label-item-box {
    display: grid;
    grid-template-columns: repeat(auto-fill, 50px);
    grid-row-gap: 12px;
    grid-column-gap: 20px;
    .label-item {
      width: 50px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      cursor: pointer;
      user-select: none;
      &.active {
        background: #000000;
        color: #ffffff;
      }
    }
  }
}
</style>
