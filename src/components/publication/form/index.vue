<template>
  <el-form
    ref="publicationForm"
    :model="data"
    label-width="auto"
    class="publication-form"
    style="--el-color-primary: #000; --el-color-primary-light-4: #000"
    :rules="rulesValidate"
  >
    <template v-for="(formDataItem, formDataIndex) in formData" :key="formDataIndex">
      <main-title-vue :title="formDataItem.label"></main-title-vue>
      <el-form-item
        :label="item.label"
        v-for="(item, index) in formDataItem.children"
        :key="index"
        :prop="item.valueName"
      >
        <!-- 单行文本框 -->
        <el-input v-model="data[item.valueName]" v-if="item.types == 0"></el-input>
        <!-- 多行文本框 -->
        <el-input
          v-model="data[item.valueName]"
          type="textarea"
          :rows="item.rows"
          v-if="item.types == 1"
        ></el-input>
        <!-- 单选按钮组 -->
        <el-radio-group
          v-model="data[item.valueName]"
          v-if="item.types == 2"
          class="radio-group"
          fill="#000000"
        >
          <template v-for="(radio, radioIndex) in item.radioGroup" :key="radioIndex">
            <el-radio :label="radioIndex" v-if="item.radioType == 0 || !item.radioType"
              >{{ radio }}
            </el-radio>
            <el-radio-button :label="radioIndex" class="radio-item" v-if="item.radioType == 1">
              {{ radio }}
            </el-radio-button>
          </template>
        </el-radio-group>
        <!-- checkbox  -->
        <el-checkbox
          v-model="data[item.valueName]"
          :label="item.checkLabel"
          v-if="item.types == 3"
        />
        <!-- uploadFiles -->
        <elupload-vue
          :uploadText="item.uploadText"
          :tips="item.tips"
          v-if="item.types == 4"
          v-model:fileList="data[item.valueName]"
          :accept="item.accept"
        ></elupload-vue>
        <!-- checkboxGroup -->
        <el-checkbox-group
          v-model="data[item.valueName]"
          v-if="item.types == 5"
          class="radio-group"
        >
          <el-checkbox
            v-for="(radio, radioIndex) in item.radioGroup"
            :label="radio"
            v-if="item.radioType == 0 || !item.radioType"
          >
            <div>{{ radio }}</div>
          </el-checkbox>
          <el-checkbox-button
            v-for="radio in item.radioGroup"
            :key="radio"
            :label="radio"
            v-if="item.radioType == 1"
            class="radio-item"
            >{{ radio }}</el-checkbox-button
          >
        </el-checkbox-group>
        <svg-icon
          iconClass="question-mark"
          className="icon-question-mark"
          :class="{ 'input-line': item.types == 0 }"
          v-if="item.hasQuestionMark"
        ></svg-icon>
        <slot v-if="item.tipSlotName" :name="item.tipSlotName"></slot>
      </el-form-item>
    </template>
    <p class="button-box">
      <el-button type="primary" @click="onSubmit" class="submit">上传并递交审核</el-button>
    </p>
  </el-form>
</template>

<script lang="ts">
import { reactive, toRaw, ref, PropType, defineComponent } from "vue";
import { ElForm, ElMessage, ElCheckboxGroup, ElCheckbox } from "element-plus";
import mainTitleVue from "../header/mainTitle.vue";
import eluploadVue from "@/components/publication/upload/index.vue";
import tips from "@/components/publication/form/tips.vue";
import type { FormState } from "@/model/formData";

interface reactiveData {
  [k: string]: any;
}
export default defineComponent({
  name: "publicationForm",
  components: { mainTitleVue, eluploadVue, tips, ElForm, ElCheckboxGroup, ElCheckbox },
  props: {
    /**
     * @Attributes types: 0/input 1/textarea 2/radioGroup 3/checkbox 4/fileupload 5/checkoutGroup
     */
    formData: {
      type: Object as PropType<FormState[]>,
    },
    rules: {
      type: Object,
      default: {},
    },
  },
  setup(props: any, contnet: any) {
    let rulesValidate = props.rules;
    let LyricPathValidate = (rule: Object, value: any, callback: Function) => {};
    function fileValidate(item: any, callback: Function) {
      if (data[item.valueName] == "") {
        callback(new Error(`请${item.uploadText}`));
      }
      callback();
    }
    let data: reactiveData = reactive({});
    (props.formData as FormState[]).forEach((element) => {
      element.children.forEach((item) => {
        if (item.types == 5) {
          data[item.valueName] = [];
        } else {
          // TODO 类型基本判断
          data[item.valueName] = "";
        }
        if (item.types == 4) {
          rulesValidate[item.valueName] = [
            {
              validator: (rule: Object, value: any, callback: Function) => {
                fileValidate(item, callback);
              },
              trigger: "change",
              required: true,
            },
          ];
        }
      });
    });
    const publicationForm = ref(null);
    const onSubmit = () => {
      publicationForm.value.validate((valid: boolean, field: Object) => {
        if (valid) {
          contnet.emit("submit", toRaw(data));
        } else {
          console.log(field);
          contnet.emit("submit", {});
          for (const key in field) {
            if (Object.prototype.hasOwnProperty.call(field, key)) {
              const element = field[key];
              return ElMessage.error(element[0].message);
            }
          }
          return false;
        }
      });
    };
    return {
      data,
      publicationForm,
      onSubmit,
      rulesValidate,
    };
  },
});
</script>

<style lang="scss" scoped>
.radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, 90px);
  grid-row-gap: 30px;
  grid-column-gap: 18px;
}
.button-box {
  display: flex;
  justify-content: center;
  margin-bottom: 80px;
  .submit {
    width: 180px;
    height: 40px;
    background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
    border-radius: 2px;
    outline: none;
    border: none;
    margin: auto;
    &:hover {
      background: linear-gradient(270deg, #685afd 0%, #4c9aff 100%);
    }
  }
}
</style>
<style lang="scss">
.publication-form {
  .icon-question-mark {
    margin-left: 10px;
    font-size: 14px;
    cursor: pointer;
    position: absolute;
    &.input-line {
      top: 30%;
    }
  }
  .radio-item {
    outline: none;
    box-shadow: none !important;
    .el-radio-button__inner,
    .el-checkbox-button__inner {
      width: 90px;
      font-size: 14px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 3px !important;
      color: rgba(0, 0, 0, 0.65);
      padding: 12px 0px;
      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }
    }
    &.is-active,
    &.is-checked {
      .el-radio-button__inner,
      .el-checkbox-button__inner {
        color: #fff;
        &:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>
