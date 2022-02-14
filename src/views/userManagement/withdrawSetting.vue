<template>
    <div class="withdraw-box">
        <el-dialog v-model="visible" title="安全验证" width="470px">
        <div class="verify">
            <div class="verify-title">
                你正在执行敏感操作，需要先验证你的身份<br />已经给你绑定的手机号 {{phone}} 发送了验证码
            </div>
            <div class="send">
                <div class="send-tip">请输入短信验证</div>
                <div class="send-btn" @click="sendcode">{{ isSend ? `${codeCount}S后重新发送` : '点击重新获取验证码'}}</div>
            </div>
            <div class="code-box">
                <div>{{code[0]}}</div>
                <div>{{code[1]}}</div>
                <div>{{code[2]}}</div>
                <div>{{code[3]}}</div>
                <div>{{code[4]}}</div>
                <div>{{code[5]}}</div>
                <el-input class="input" ref="input" :maxlength='4' v-model='code' />
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
            <el-button type="primary" @click="aggre"
                >确定</el-button
            >
            </span>
        </template>
        </el-dialog>
        <div class="setting-box">
            <div class="setting-title">
                <span @click="router.go(-1)">提现</span>
                <img src="../../assets/images/right.png" />
                <span>提现设置</span>
            </div>
            <div class="action" @click="changeEditState(true)">
                <span>修改</span>
                <img src="../../assets/images/seeting.png" />
            </div>
        </div>
        
        <div class="title">收款人及账号信息</div>
        <div class="withdraw-info">
            <div class="info-item">
                <span>真实姓名：</span>
                <span>{{userAsset.userRealName}}</span>
            </div>
            <div class="info-item">
                <span>身份证号：</span>
                <span>{{userAsset.userCardId}}</span>
            </div>
            <div v-if="!isEdit" class="info-item">
                <span>收款银行账户：</span>
                <span>{{userAsset.bankCardId}}</span>
                
            </div>
            <!-- <div v-if="!isEdit" class="info-item">
                <span>开户行：</span>
                <span>{{userAsset.BankName}}</span>
            </div> -->
            
            <div v-if="!isEdit" class="info-item">
                <span>开户支行：</span>
                <span>{{userAsset.bankDeposit}}</span>
                
            </div>
            <div v-if="isEdit" class="info-item">
                <span><span>*</span>收款银行账户：</span>
                <el-input v-model='bankNo' style="width:300px" size='small' placeholder="请输入收款银行账号" />
                <!-- <el-select v-model="bank" style="margin-left:20px" placeholder="请选择开户行" size='small'>
                    <el-option v-for="(item,index) in bankList" :key="index" :label="item.bankName" :value="item.id"></el-option>
                    
                </el-select> -->
            </div>
            
            <div v-if="isEdit" class="info-item">
                <span><span>*</span>开户支行：</span>
                <el-input v-model='bankAddress' style="width:300px" size='small' placeholder="请输入开户支行" />
            </div>
            <div v-if="isEdit" class="action-btn">
                <div @click="clickEdit">确定</div>
                <div @click="isEdit = false">取消</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, nextTick, onMounted } from "vue";
import { getUserAsset, getUserBasic, setUserBank, bankList } from "@/api/apiManagement/userManagement";
import { ElMessage } from "element-plus";
import { getPhoneCode } from "@/api/apiManagement/login";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        const state = reactive({
            isEdit: false,
            visible: false,
            code: '',
            codeCount: 60,
            isSend: false,
            bankAddress: '',
            bankNo: '',
            phone: '',
            bank: '',
            router: useRouter(),
            bankList: [],
            store: useStore(),
            userAsset: {
                
                sureAmount: '',
                frozenAmount: '',
                alreadyAmount: '',
                bankCardId: '',
                userId: '',
                userRealName: '',
                bankDeposit: '',
                userCardId: '',
                bankName: ''
            }
        })
        const input = ref(null);
        const clickEdit = () => {
            if (!state.bankNo) return ElMessage.error('请输入收款银行账户');
            if (!state.bankAddress) return ElMessage.error('请输入开户支行');
            state.visible = true;
            nextTick(() => {
                input.value.focus();
                sendcode();
            })    
        }
        onMounted(() => {
            getBase();
            getBankList();
        })
        const getBankList = (): void => {
            bankList().then((res: any) => {
                if (res.code == 0) {
                    state.bankList = res.data;
                }
            })
        }
        const getBase = (): void => {
            getUserAsset().then((res) => {
                state.userAsset = res.data;
                state.bank = res.data.bankId;
                if (!res.data.bankCardId) {
                    state.isEdit = true
                }
            })
            getUserBasic({userId: state.store.state.login.userInfo.UserId}).then((res) => {
                state.phone = res.data.Phone;
            })
        }
        
        const changeEditState = (flag: boolean): void => {
            state.bankNo = state.userAsset.bankCardId;
            state.bankAddress = state.userAsset.bankDeposit;
            state.isEdit = flag;
            
        }
        const sendcode = (): void => {
            if (state.isSend) return;
            state.isSend = true;
            getPhoneCode({
                Phone: state.phone,
                Type: 5
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
                    clearInterval(timer);
                    ElMessage.error(res.msg)
                }
                
               
                
            })
        }
        
        const aggre = () => {
            if (!state.code) return ElMessage.error('请输入验证码');
            setUserBank({
                BankCardId: state.bankNo,
                BankDeposit: state.bankAddress,
                // BankId: state.bank,
                Captcha: state.code
            }).then((res: any) => {
                if (res.code == 0) {
                    state.isEdit = false;
                    state.visible = false;
                    getBase();
                } else {
                    ElMessage.error(res.msg);
                }
            })
        }
        return {
            ...toRefs(state),
            clickEdit,
            input,
            sendcode,
            changeEditState,
            aggre
        }
    }
})
</script>
<style lang="scss" scoped>
    .verify{
        .verify-title{
            font-size: 16px;
            font-weight: bold;
            color: #333333;
            line-height: 28px;
            height: 56px;
        }
        .send{
            display: flex;
            margin-top: 19px;
            align-items: center;
            div:nth-child(1){
                color: #999999;
            }
            div:nth-child(2){
                color: #61A4FF;
                font-weight: bold;
                margin-left: 22px;
            }
        }
    }
    .code-box{
        display: flex;
        margin-top: 14px;
        align-items: center;
        position: relative;
        overflow: hidden;
        .input{
            position: absolute;
            left: 0;
            top: 0;
            height: 100px;
            width: 1000px;
            border: none;
            outline: none;
            opacity: 0;
        }
        >div{
            width: 60px;
            height: 50px;
            background: #FFFFFF;
            border-radius: 2px;
            border: 1px solid #D9D9D9;
            line-height: 50px;
            text-align: center;

            color: rgba(0, 0, 0, 0.85);
            font-size: 16px;
            font-weight: bold;
            margin-right: 24px;
            position: relative;
            
        }
    }
    .withdraw-box{
        padding: 36px 60px 36px 36px;
        .title{
            height: 25px;
            font-size: 18px;
            font-weight: bold;
            color: #333333;
            line-height: 25px;
            margin-top: 30px;
            
        }
        .action{
            cursor: pointer;
        }
        .setting-box{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .action{
                width: 80px;
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
        .setting-title{
            height: 22px;
            display: flex;
            align-items: center;
            span:nth-child(1){
                font-size: 16px;
                color: #888888;
                cursor: pointer;
            }
            img{
                width: 16px;
                height: 16px;
            }
            span:nth-child(3){
                font-weight: bold;
                font-size: 16px;
                color: #333333;
            }
        }
        .withdraw-info{
            // padding: 30px 0 0;
            .info-item{
                display: flex;
                align-items: center;
                margin-top: 24px;
                height: 22px;
                >span:nth-child(odd){
                    font-size: 16px;
                    color: #888888;
                    width: 130px;
                    height: 22px;
                    line-height: 22px;
                    span{
                        color: var(--el-color-danger);
                    }
                }
                >span:nth-child(even){
                    font-size: 16px;
                    color: #333333;
                    font-weight: bold;
                    height: 22px;
                    line-height: 22px;
                }
            }
        }
    }
    .action-btn{
        display: flex;
        padding: 40px 130px;
        align-items: center;
        div{
            width: 65px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            border-radius: 4px;
            font-size: 14px;

        }
        div:nth-child(1){
            background: linear-gradient(270deg, #877BFF 0%, #7EB6FF 100%);
            color: #FFFFFF;
        }
        div:nth-child(2){
            border: 1px solid #D9D9D9;
            color: rgba(0, 0, 0, 0.65);
            margin-left: 16px;
        }
        // padding: ;
    }
</style>
