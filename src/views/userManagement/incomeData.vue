<template>
  <div class="incomedata-box">
    <div class="incomedata-title">收益数据</div>
    <div class="tabs-box">
      <ul>
        <li
          v-for="(item, index) in tabsData"
          :key="item"
          :class="{ active: index == activeIndex }"
          @click="activeIndex = index"
        >
          {{ item }}
        </li>
        <div class="slide" :style="{ left: linePos }"></div>
      </ul>
    </div>
    <div class="incomedata-content" v-if="activeIndex == 0">
      <div class="overview-title">概览</div>
      <div class="overview-list">
        <div>
          <div>昨日收益</div>
          <div>
            <span>{{incomeInfo.YesterdayProfit}}</span>
            <span>元</span>
          </div>
          <div>近日30日 {{incomeInfo.DaysProfit}}元</div>
        </div>
        <div>
          <div>本月收益</div>
          <div>
            <span>{{incomeInfo.MonthProfit}}</span>
            <span>元</span>
          </div>
          <div>累计收益 {{incomeInfo.TotalProfit}}元</div>
        </div>
        <div>
          <div>可提现金额</div>
          <div>
            <span>{{incomeInfo.Balance}}</span>
            <span>元</span>
          </div>
          <button style="cursor: pointer;" @click="router.push('/management/mypurse')">前往提现</button>
        </div>
      </div>
      <div class="earnings-chart">
        <div class="earnings-title">收益趋势分析</div>
        <div class="analyze-cont">
          <div class="left">
            <div>时间</div>
            <div>7天</div>
            <div>15天</div>
            <div>30天</div>
            <el-date-picker
              class="datapicker"
              v-model="value1"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-date-picker>
          </div>
          <div class="right">
            <div :class="chartab == 1 ? 'selected' : ''" @click="charBtn(1)">
              <img v-if="chartab == 2" src="../../assets/images/xs.png" /><img
                v-if="chartab == 1"
                src="../../assets/images/trend.png"
              /><span>趋势图</span>
            </div>
            <div :class="chartab == 2 ? 'selected' : ''" @click="charBtn(2)">
              <img v-if="chartab == 2" src="../../assets/images/wa.png" /><img
                v-if="chartab == 1"
                src="../../assets/images/wa2.png"
              /><span>数据列表</span>
            </div>
          </div>
        </div>
        <div class="fan-chat" style="margin-top: 30px" v-show="chartab == 1">
          <line-charts ref='lineChart' :tab="tab" :list="list" />
        </div>
      </div>
    </div>
    <div v-if="activeIndex == 1" class="sing-list">
      <el-table :data="singtableData" style="width: 100%" max-height="250">
        <el-table-column fixed prop="date" label="作品" />
        <el-table-column prop="name" label="播放量"  />
        <el-table-column prop="state" label="点赞量"  />
        <el-table-column prop="city" label="评论量"  />
        <el-table-column prop="address" label="完播率"  />
        <el-table-column prop="zip" width="180px" label="已出售nft版权收益数量"  />
        <el-table-column prop="zip" label="收益">
          <template #header>
              <el-popover
                placement="top-start"
                trigger="hover"
                :width="200"
                content="用户购买作品铸造的nft音乐版权收益获得"
              >
                <template #reference>
                  <div style="display: flex;align-items: center;">
                    <span>收益</span>
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </div>
                </template>
              </el-popover>
              
              
            </template>
        </el-table-column>
        <el-table-column label="Operations" >
        </el-table-column>
      </el-table>
      <superPaginationVue
        :total="page.total"
        v-model:currentPage="page.current"
        v-model:pageSize="page.pageSize"
      ></superPaginationVue>
      <!-- <div class="no-more">没有更多了～</div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted, ref, watch } from "vue";
import lineCharts from "@/components/charts/lineCharts.vue";
import { getUserIncomeSummary, getEverydayPofitList } from "@/api/apiManagement/userManagement";
import superPaginationVue from "@/components/public/superPagination.vue";
import { useRouter } from "vue-router";
import { Search, QuestionFilled } from "@element-plus/icons";
export default defineComponent({
  components: {
    lineCharts,
    superPaginationVue,
    QuestionFilled
  },
  setup() {
    var state = reactive({
      router: useRouter(),
      activeIndex: 0,
      tabsData: ["整体收益", "单个收益"],
      value1: ['2022-01-02', '2022-01-03'],
      chartab: 1,
      tab: [
        {
            title: '作品交易数据',
            color: '#5B8FF9',
            check: true,
            key: 'a'
        },
      ],
      list: [],
      incomeInfo: {
        Balance: '',
        DaysProfit: '',
        MonthProfit: '',
        TotalProfit: '',
        YesterdayProfit: ''
      },
      singtableData: [],
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
    });
    const lineChart = ref();
    const linePos = computed(() => {
      return state.activeIndex * 100 + "px";
    });
    const charBtn = function (n: number) {
      state.chartab = n;
    };
    onMounted(() => {
      const list = [
            {
                time: '2020',
                a: 1,
            },
            {
              time: '2021',
              a: 2
            }
        ]
      state.list = list;
      getData();
      getEveryList();
    });
    watch(() => state.value1, (n) => {
      // console.log(new Date(n[1]).getTime())
    })
    const getEveryList = () => {
      getEverydayPofitList({

      }).then((res) => {
        state.singtableData = res.data.list || [];
        state.page.total = res.data.total;
      })
    }
    const getData = () => {
      getUserIncomeSummary().then((res) => {
        console.log(res)
        state.incomeInfo = res.data;
      })
    }
    return {
      ...toRefs(state),
      linePos,
      charBtn,
      lineChart
    };
  },
});
</script>
<style lang="scss">
.incomedata-box {
  .el-range-separator {
    height: 32px !important;
  }
  .el-date-editor {
    width: 240px !important;
    height: 32px !important;
  }
  .datapicker{
    i{
      display: flex;
      align-items:center
    }
  }
}
</style>
<style lang="scss" scoped>
.incomedata-box {
  padding: 30px 40px 30px 35px;
  .sing-list {
    margin-top: 19px;
    .no-more {
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      text-align: center;
      margin-top:40px;
    }
  }
  .analyze-cont {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    line-height: 32px;
    .right {
      display: flex;
      align-items: center;
      > div {
        border: 1px solid #d9d9d9;
        width: 100px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      > div.selected {
        border-color: #63a5ff;
        color: #63a5ff;
      }
      > div:nth-child(1) {
        border-radius: 3px 0px 0px 3px;
        img {
          width: 13px;
          height: 12px;
        }
      }
      > div:nth-child(2) {
        border-radius: 0px 3px 3px 0px;
        img {
          width: 13px;
          height: 15px;
          margin-right: 4px;
        }
      }
    }
    .left {
      display: flex;
      div:nth-child(1) {
        cursor: auto;
      }
      div {
        width: 60px;
        cursor: pointer;
      }
      div.active {
        color: #68a8ff;
      }
    }
  }
  .earnings-chart {
    margin-top: 54px;
    .earnings-title {
      height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      line-height: 25px;
    }
  }
  .overview-list {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    > div {
      width: 220px;
      //   height: 140px;
      background: #fafafb;
      border-radius: 8px;
      padding: 18px 0 18px 19px;
      > button {
        width: 90px;
        height: 32px;
        background: #fff0f3;
        border-radius: 2px;
        border: 1px solid #ff8486;
        margin-top: 7px;
        color: #ff2f32;
        font-size: 14px;
      }
      > div:nth-child(1) {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
      > div:nth-child(2) {
        margin-top: 4px;
        > span:nth-child(1) {
          font-size: 32px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 45px;
        }
        > span:nth-child(2) {
          font-size: 18px;
          font-weight: 500;
          color: #333333;
          line-height: 25px;
          margin-left: 4px;
        }
      }
      > div:nth-child(3) {
        margin-top: 18px;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
      }
    }
  }
  .incomedata-content {
    margin-top: 29px;
    .overview-title {
      height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      line-height: 25px;
    }
  }
  .incomedata-title {
    color: #333;
    font-weight: 500;
    height: 33px;
    line-height: 33px;
    margin-bottom: 20px;
    font-size: 24px;
  }
  .tabs-box {
    border-bottom: 1px solid #ebebff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .slide {
      width: 100px;
      height: 3px;
      background: linear-gradient(270deg, #877bff 0%, #7eb6ff 100%);
      border-radius: 2px;
      position: absolute;
      bottom: 0;
      transition: all 0.5s;
    }
    ul {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      height: 100%;
      list-style: none;
      position: relative;
      li {
        width: 100px;
        text-align: center;
        cursor: pointer;
        padding-bottom: 15px;
        position: relative;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        height: 40px;
      }
      li.active {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
      }
    }
  }
}
</style>
