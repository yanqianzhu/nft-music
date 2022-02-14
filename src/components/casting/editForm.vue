<template>
  <div v-loading="loading">
    <el-form ref="form" :model="copyData" label-width="110px" class="editForm">
      <div v-if="isEdit == false" class="showForm">
        <template v-for="(item, index) in renderList" :key="item.value">
          <el-form-item>
            <template #label>
              <span> {{ item.label }}： </span>
            </template>
            {{ copyData[item.value] }}
          </el-form-item>
        </template>
        <el-form-item class="addForm">
          <template #label>
            <span> <i class="iconfont icon-shangchuanfengmian"></i> 继续添加 </span>
          </template>
          可添加更多信息，例如、“混音 : XX”、“监制” : XX”
        </el-form-item>
        <el-form-item class="textarea-box" v-if="copyData.OtherIn !== ''">
          <template #label> 其他制作人: </template>
          <p v-html="otherPro"></p>
        </el-form-item>
      </div>
      <template v-else>
        <template v-for="(item, index) in renderList" :key="item.value">
          <el-form-item v-if="!item.canSelect">
            <template #label>
              <span>
                {{ item.label }}
              </span>
            </template>
            <el-input
              v-model="copyData[item.value]"
              :disabled="!item.canEdit"
              @input="debounce"
            ></el-input>
            <i class="iconfont icon-delete" v-if="item.canEdit" @click="deleteItem(item)"></i>
          </el-form-item>
        </template>
        <el-form-item v-if="addShow">
          <template #label>
            <el-select v-model="seleteKey" placeholder="选择参与者">
              <el-option
                v-for="musicMakeitem in selectList"
                :key="musicMakeitem.value"
                :label="musicMakeitem.label"
                :value="musicMakeitem.value"
              >
              </el-option>
            </el-select>
          </template>
          <i class="iconfont icon-delete" @click="addShow = false"></i>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span @click="addItem">
              <i class="iconfont icon-shangchuanfengmian"></i> 继续添加
            </span>
          </template>
          可添加更多信息，例如、“混音 : XX”、“监制” : XX”
        </el-form-item>
        <el-form-item class="textarea-box">
          <template #label> 其他制作人 </template>
          <el-input
            type="textarea"
            rows="5"
            v-model="copyData.OtherIn"
            placeholder="吉他:XXX&#10;人声配唱:XXX"
            @input="debounce"
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
    <div class="work-introduction">
      <h3>作品简介:</h3>
      <p v-if="isEdit == false">
        {{ copyData.InspirationDescription }}
      </p>
      <el-input
        v-else
        v-model="copyData.InspirationDescription"
        :rows="3"
        type="textarea"
        :placeholder="copyData.InspirationDescription"
        @input="debounce"
      />
    </div>
    <div class="submit-box flex flex-justify-content-center flex-align-items-center">
      <button class="submit-btn" @click="updateMusicInfo">
        {{ isEdit ? "保存" : "编辑" }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch, toRaw } from "vue";
import { ElForm, ElFormItem, ElSelect, ElInput, ElMessage } from "element-plus";
import { musciMakeList, defaultItem } from "@/model/musicData";
import { musicNftDraftApi, createMusicApi, updateMusicApi } from "@/api/apiManagement/audio";

export default defineComponent({
  name: "editForm",
  components: {
    ElForm,
    ElFormItem,
    ElSelect,
    ElInput,
  },
  props: {
    data: Object,
    renderList: Object,
  },
  // 定义抛出的事件名称
  emits: ["update:renderList", "saveDraft"],
  setup(props, content) {
    // ----data
    const data = reactive({
      copyData: { OtherIn: "", InspirationDescription: "" }, // copy props 的数据源  总的数据源
      seleteKey: "",
      MakeList: musciMakeList,
      addShow: false,
      timer: {},
      isEdit: false,
      loading: false,
    });
    // ---computed
    const renderList = computed(() => {
      // 渲染list
      return data.MakeList.filter((item) => !item.canSelect);
    });
    const selectList = computed(() => {
      // 下拉选择 list
      return data.MakeList.filter((item) => item.canSelect);
    });
    //------watch
    watch(
      () => data.seleteKey,
      (val) => {
        if (val !== "") {
          data.MakeList.filter((i) => i.value == val)[0].canSelect = false;
          data.addShow = false;
          data.seleteKey = "";
        }
      }
    );
    watch(
      () => data.copyData,
      () => {
        content.emit("update:renderList", data.copyData);
      },
      {
        deep: true,
      }
    );
    watch(
      () => props.data,
      () => {
        init();
      }
    );
    // methods
    function init() {
      data.copyData = JSON.parse(JSON.stringify(props.data));
      const list = data.MakeList.filter((item) => item.required); // 必填的数据
      const nolist = data.MakeList.filter((item) => !item.required); // 非必填的数据
      nolist.forEach((item) => {
        if (data.copyData[item.value]) {
          list.push(item);
        }
      });
      list.forEach((item) => (item.canSelect = false));
    }
    // init();
    function deleteItem(item: any) {
      data.copyData[item.value] = "";
      const i = JSON.parse(JSON.stringify(item));
      i.canSelect = true;
      const index = data.MakeList.findIndex((make) => item.value == make.value);
      data.MakeList.splice(index, 1);
      data.MakeList.push(i);
    }
    function addItem() {
      if (data.addShow) {
        ElMessage.warning("请先选择参与者在继续添加~");
        return;
      }
      data.addShow = true;
    }

    function debounce() {
      if (data.timer) {
        clearTimeout(data.timer as any);
      }
      data.timer = setTimeout(() => {
        //TODO
        content.emit("saveDraft", data.copyData);
        // musicNftDraftApi({}).then((res) => {});
      }, 1000);
    }
    // 更新 musicInfo
    function updateMusicInfo() {
      if (data.isEdit == false) {
        data.isEdit = true;
        return;
      }
      data.loading = true;
      // let {arranger} = data.copyData;
      updateMusicApi({ ...data.copyData })
        .then((res) => {
          //@ts-ignore
          if (res.code == 0) {
            ElMessage.success("保存成功!");
          } else {
            //@ts-ignore
            ElMessage.error(res.msg);
          }
        })
        .then(() => {
          data.isEdit = false;
          data.loading = false;
        });
    }
    //-------computed
    const otherPro = computed(() => {
      let result = data.copyData.OtherIn;
      try {
        result = result.replace(/\r\n/g, "<br>");
        result = result.replace(/\n/g, "<br>");
      } catch (e) {
        result = data.copyData.OtherIn;
      }
      return result;
    });
    return {
      ...toRefs(data),
      renderList,
      deleteItem,
      selectList,
      addItem,
      debounce,
      otherPro,
      updateMusicInfo,
    };
  },
});
</script>
<style lang="scss" scoped>
@mixin borderBottom() {
  border-bottom: 1px solid #f4f4ff;
}
@mixin bordertop() {
  border-top: 1px solid #f4f4ff;
}
h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20px;
}
.work-introduction {
  padding: 30px 0px;
  @include borderBottom;
  @include bordertop;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  h3 {
    padding-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
  }
}
//--------------------------
.submit-box {
  padding-top: 20px;
  .submit-btn {
    background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
    border-radius: 2px;
    width: 120px;
    height: 36px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    outline: none;
    border: none;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.editForm {
  .el-form-item {
    display: flex;
    height: 32px;
    line-height: 32px;
    margin-bottom: 15px;
    &.textarea-box {
      height: auto;
    }
  }
  .el-form-item__label {
    height: 32px;
    line-height: 32px;
    background: #f9f8f8;
    border-radius: 2px;
    border: 1px solid #d8d8d8;
    padding: 0px;
    margin-right: 12px;
    text-align: center;
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border: none;
      position: relative;
      top: -1px;
    }
    .el-input--suffix {
      .el-input__suffix {
        .el-select__caret {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .el-form-item__content {
    display: flex;
    align-items: center;
    line-height: 18px;
    .el-input__inner {
      height: 32px;
      border-radius: 2px;
    }
    .el-textarea__inner {
      border-radius: 2px;
      resize: none;
    }
    .icon-delete {
      margin-left: 10px;
      font-size: 16px;
    }
  }
  .showForm {
    .el-form-item__label {
      background-color: #ffffff;
      border: none;
      // text-align: right;
    }
    .addForm {
      cursor: not-allowed;

      .el-form-item__label {
        cursor: not-allowed;
      }
    }
  }
}
</style>
