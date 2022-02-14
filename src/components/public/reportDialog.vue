<template>
  <el-dialog v-model="show" title="举报作品" width="470px" custom-class="report-dialog">
    <div class="report-contnet">
      <el-radio-group v-model="reportType">
        <el-radio
          :label="index"
          v-for="(item, index) in list"
          :key="item"
          style="--el-color-primary: #000"
          class="radio-item"
        >
          {{ item }}
        </el-radio>
      </el-radio-group>
      <el-input
        v-model="reason"
        :rows="4"
        type="textarea"
        show-word-limit
        maxlength="140"
        placeholder="请详细描述举报原因,便于平台判断违规情况"
      />
    </div>
    <div class="btn-box">
      <span class="submit" @click="report">提交</span>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { addReportApi } from "@/api/apiManagement/audio";
import { ElMessage } from "element-plus";
import { defineComponent, reactive, toRefs, watch } from "vue";

export default defineComponent({
  name: "reportdialog",
  props: {
    reportDialogShow: Boolean,
    id: Number,
  },
  setup(props, { emit }) {
    const data = reactive({
      show: false,
      list: ["色情低俗", "违法犯罪", "未成年人相关", "垃圾广告", "造谣传谣", "非原创相关", "其他"],
      reason: "",
      reportId: props.id,
      reportType: "",
      type: 1,
    });
    function report() {
      if (data.reportType == null || data.reportType == undefined || data.reportType == "") {
        ElMessage.error("请选择举报理由");
        return;
      }
      addReportApi({
        content: data.reason,
        reportId: data.reportId,
        reportType: data.reportType,
        type: data.type,
      }).then((res) => {
        if (res.code === 0) {
          ElMessage.success("举报成功！");
          data.show = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
    watch(
      () => props.reportDialogShow,
      (val) => {
        data.show = val;
      }
    );
    watch(
      () => data.show,
      (val) => {
        emit("update:reportDialogShow", val);
        if (val == false) {
          data.reason = "";
          data.reportType = "";
        }
      },
      {
        immediate: true,
      }
    );
    return {
      ...toRefs(data),
      report,
    };
  },
});
</script>
<style lang="scss">
.report-dialog {
  .el-dialog__body {
    padding: 0px !important;
  }
  .report-contnet {
    padding: 15px 20px 30px 20px;
    .radio-item {
      width: 30%;
      margin-right: 0px;
    }
  }
  .btn-box {
    border-top: 1px solid #ccc;
    text-align: right;
    padding: 10px 30px;
    .submit {
      display: inline-block;
      width: 85px;
      height: 32px;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }
  }
}
</style>
