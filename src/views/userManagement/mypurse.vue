<template>
  <div class="mypurse-box">
    <el-dialog v-model="visibleStep" title="提现进度" width="470px">
      <div class="step">
        <img src="../../assets/images/jd.png" />
        <div>处理中…</div>
        <div>提现金额于12小时内到账</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="visibleStep = false"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="visible" title="提现" width="470px">
      <div class="withdraw">
        <div class="tip-text">提现到</div>
        <div class="bankno">
          <span>{{userAsset['BankDeposit']}}（{{userAsset.bankCardId}}）</span>
          <img src="../../assets/images/right.png" />
        </div>
        <div class="time-text">预计12小时内到账</div>
        <div class="withdraw-amount">
          <div class="amount">提现金额</div>
          <div class="amount-input">
            <span>¥</span>
            <el-input v-model='amount' placeholder="请输入提现金额" size='small' />
          </div>
          <div class="canuse-amout">
            可用余额¥{{userAsset.sureAmount}}
          </div>
        </div>
        <div class="tip-text" style="margin-top: 20px;">请输入验证码</div>
        <div class="send-phone" v-if="isSend">验证码已发送至：{{phone}}</div>
        <div class="code">
          <el-input v-model='code' placeholder="请输入验证码" style="width:120px" size='small' />
          <span @click="sendcode">{{ isSend ? `${codeCount}S后重新发送` : '发送'}}</span>
        </div>
        
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <div class="purse-title">
      <div style="font-weight: bold;">我的钱包</div>
      <div style="cursor: pointer;" @click="overview">
        <span>提现设置</span>
        <img src="../../assets/images/seeting.png" />
      </div>
    </div>
    <div class="mypurse-cont">
      <div class="data-overview">数据概览</div>
      <div class="overview-infor">
        <div>
          <div>
            <div>总金额</div>
            <div>
              <span>{{userAsset.balance}}</span>
              <span>元</span>
            </div>
          </div>
          <div>
            <div>可提现金</div>
            <div>
              <span>{{userAsset.sureAmount}}</span>
              <span>元</span>
            </div>
          </div>
          
          <div>
            <div>累计提现金</div>
            <div>
              <span>{{userAsset.alreadyAmount}}</span>
              <span>元</span>
            </div>
          </div>
        </div>
        <div class="withdrawal">
          <el-button type="primary" class="submit" @click="apply">申请提现</el-button>
        </div>
      </div>
      <div class="withdrawal-details">
        <div class="detail-tile">
          <div>提现明细</div>
          <div>单位：元</div>
        </div>
        <div class="datail-list">
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column prop="CreateTime" label="提现日期">
              <template #default="scope">
                {{dateFormat(scope.row.CreateTime, 'yyyy-MM-dd HH:mm:ss')}}
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="结算周期" />
            <el-table-column prop="realAmount" label="收益合计(含税)" />
            <el-table-column prop="feeRate" label="扣税" />
            <el-table-column prop="realAmount" label="打款金额(税后)" />
            <el-table-column prop="State" label="打款状态" />
            <el-table-column prop="State" label="操作" />
          </el-table>
          <superPaginationVue
            :total="page.total"
            v-model:currentPage="page.current"
            v-model:pageSize="page.pageSize"
          ></superPaginationVue>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted, watch } from "vue";
import { getUserAsset, getWithdrawalRecord, getUserBasic, balancewithdrawal } from "@/api/apiManagement/userManagement";
import superPaginationVue from "@/components/public/superPagination.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getPhoneCode } from "@/api/apiManagement/login";
import { dateFormat } from '@/utils/filter';
import { useStore } from "vuex";
export default defineComponent({
  components: {
    superPaginationVue
  },
  setup() {
    var state = reactive({
      tableData: [],
      visible: false,
      codeCount: 60,
      isSend: false,
      visibleStep: false,
      page: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
      phone: '',
      amount: '',
      code: '',
      store: useStore(),
      router: useRouter(),
      userAsset: {
        sureAmount: 0,
        frozenAmount: 0,
        alreadyAmount: 0,
        bankCardId: '',
        UserId: '',
        userCardId: '',
        balance: 0,
      }
    });
    onMounted(() => {
      getBase();
      getWithdrawal();
    })
    const getWithdrawal = (): void =>{
      getWithdrawalRecord({
        Page: state.page.current,
        Size: state.page.pageSize
      }).then((res) => {
        state.tableData = res.data.list;
        state.page.total = res.data.total;
      })
      
    }
    watch(() => [state.page.pageSize], () => {
      if (state.page.current == 1) {
        getWithdrawal();
      } else {
        state.page.current = 1;
      }
    })
    watch(() => state.page.current, () => {
      getWithdrawal();
    })
    const getBase = (): void => {
      getUserBasic({userId: state.store.state.login.userInfo.UserId}).then((res) => {
        state.phone = res.data.Phone;
      })
      getUserAsset().then((res) => {
        state.userAsset = res.data;
      })
    }
    const overview = () => {
      if (!state.userAsset.userCardId) return ElMessage.error('请先完成实名认证');
      state.router.push('/management/withdrawsetting')
    }
    const sendcode = (): any => {
      
      if (state.isSend) return;
      if (!state.amount) return ElMessage.error('请输入提现金额')
      state.isSend = true;
      getPhoneCode({
        Phone: state.phone,
        Type: 4
      }).then((res: any) => {
        let timer: any = null;
        if (res.code == 0) {
          timer = setInterval(() => {
            state.codeCount --;
            if (state.codeCount === 0) {
              state.codeCount = 60;
              state.isSend = false;
              clearInterval(timer);
            }
          }, 1000)
        } else {
          state.isSend = false;
          ElMessage.error(res.msg);
          clearInterval(timer);
        }
        
      })
      
    }
    const apply = () => {
      if (!state.userAsset.userCardId) return ElMessage.error('请先完成实名认证');
      if (state.userAsset.userCardId && !state.userAsset.bankCardId) {
        state.router.push('/management/withdrawsetting')
        return ElMessage.error('请先设置银行卡');
      } 
      state.visible = true
    }
    const handleSubmit = () => {
      if (!state.amount) return ElMessage.error('请输入提现金额');
      if (!state.code) return ElMessage.error('请输入验证码');
      balancewithdrawal({
        Amount: +state.amount,
        VerificationCode: state.code,
        // UserId: state.userAsset.UserId
      }).then((res: any) => {
        if (res.code == 0) {
          state.visible = false;
          getBase();
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    return {
      ...toRefs(state),
      sendcode,
      apply,
      handleSubmit,
      dateFormat,
      overview
    };
  },
});
</script>
<style lang="scss">
  .mypurse-box{
    .el-dialog__header{
      border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    }
  }
</style>
<style lang="scss" scoped>
.step{
  padding: 32px 0 60px;
  text-align: center;
  img{
    width: 83px;
    height: 80px;
  }
  >div::nth-child(2){
    margin-top: 14px;
    height: 22px;
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
  >div::nth-child(3){
    height: 22px;
    font-weight: 400;
    color: #888888;
    margin-top: 10px;
    line-height: 22px;
  }
}
.code{
  display: flex;
  align-items: center;
  margin-top: 20px;
  span{
    color: #61A4FF;
    margin-left: 10px;
    cursor: pointer;
  }
}
.send-phone{
    color: #333;
    font-weight: bold;
    height: 22px;
    line-height: 22px;
    margin-top: 6px;
  }
.withdraw-amount{
  margin-top: 20px;
  background: #FAFAFB;
  border: 1px solid #EDEDFF;
  border-radius: 2px;
  padding: 9px 20px 13px;
  .amount{
    height: 22px;
    color: #333;
    line-height: 22px;
  }
  .amount-input{
    display: flex;
    align-items: center;
    margin-top: 10px;
    span{
      font-size: 20px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      margin-right: 20px;
    }
  }
  .canuse-amout{
    height: 22px;
    line-height: 22px;
    color: #666;
    margin-top: 12px;
  }
  
}
.tip-text{
  color: #666666;
  height: 22px;
  line-height: 22px;
}
.time-text{
  
  color: #999999;
  font-size: 12px;
  height: 22px;
  line-height: 22px;
  margin-top: 2px;
}
.bankno{
  display: flex;
  align-items: center;
  span{
    color: #333;
    font-size: 18px;
    font-weight: bold;
  }
  img{
    height: 16px;
    width: 16px;
    margin-left: 6px;
  }
}
.mypurse-box {
  padding: 30px 40px 30px 35px;
  .withdrawal-details {
    margin-top: 40px;
    .datail-list {
      margin-top: 20px;
    }
    .detail-tile {
      display: flex;
      justify-content: space-between;
    }
    .detail-tile > div:nth-child(1) {
      height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      line-height: 25px;
    }
    .detail-tile > div:nth-child(2) {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  }
  .withdrawal {
    margin-top: 27px;
    display: flex;
    align-items: center;
    justify-content: center;
    .submit {
      width: 120px;
      height: 40px;
      background: linear-gradient(270deg, #877BFF 0%, #7EB6FF 100%);
      border-radius: 2px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      border: none;
      outline: none;
    }
  }
  .mypurse-cont {
    margin-top: 29px;
    .data-overview {
      height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      line-height: 25px;
    }
    .overview-infor {
      background: #fafafb;
      border-radius: 8px;
      border: 1px solid #ededff;
      margin-top: 20px;
      padding: 31px 40px 28px 57px;
    }
    .overview-infor > div:nth-child(1) {
      display: flex;
      justify-content: space-between;
      > div {
        width: 260px;
        height: 70px;
        padding-left: 17px;
        box-sizing: border-box;
        > div:nth-child(1) {
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
        }
        > div:nth-child(2) {
          margin-top: 3px;
          > span:nth-child(1) {
            font-size: 32px;
            font-weight: 600;
            color: #333333;
            line-height: 45px;
          }
          > span:nth-child(2) {
            height: 25px;
            font-size: 18px;
            font-weight: 500;
            color: #333333;
            line-height: 25px;
            margin-left: 5px;
          }
        }
      }
    }
  }
  .purse-title {
    display: flex;
    justify-content: space-between;
  }
  .purse-title > div:nth-child(1) {
    font-size: 24px;
    font-weight: 500;
    color: #333333;
    line-height: 33px;
    margin-bottom: 20px;
  }
  .purse-title > div:nth-child(2) {
    width: 110px;
    height: 32px;
    background: #f5f4f4;
    border-radius: 2px;
    line-height: 32px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-right: 10px;
    }
    > img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
