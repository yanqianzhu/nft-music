<template>

  <div class="work-box">
    <div class="work-title">作品数据</div>
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
    <div class="container-box" v-if="activeIndex == 0">
      <div class="core-data">
        <div>核心数据</div>
        <div>每日 14:00 前更新前一日数据</div>
      </div>
      <div class="coreList">
        <div>
          <div class="core-title">昨日播放量</div>
          <div class="core-num">1,572,638</div>
          <div class="core-fan">粉丝播放量5w</div>
        </div>
        <div>
          <div class="core-title">昨日点赞量</div>
          <div class="core-num">42,685</div>
        </div>
        <div>
          <div class="core-title">昨日评论量</div>
          <div class="core-num">
            <span>76.36</span>
            <span>%</span>
          </div>
        </div>
        <div>
          <div class="core-title">昨日完播率</div>
          <div class="core-num">
            <span>48.21</span>
            <span>%</span>
          </div>
        </div>
      </div>
      <div class="trend-chart">
        <div class="chart-title">
          <div class="title-left">
            <div>数据趋势</div>
            <div class="datapicker">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="title-right">
            <img v-if="chartab == 2" class="downloadimg" src="../../assets/images/download.png" />
            <div v-if="chartab == 2" class="down">下载Excel</div>
            <div class="chart-select">
              
              <div :class="chartab == 1 ? 'selected' : ''" @click="charBtn(1)">
                趋势图
              </div>
              <div :class="chartab == 2 ? 'selected' : ''" @click="charBtn(2)">
                数据列表
              </div>
            </div>
            
          </div>
        </div>
        <div class="fan-chat" style="margin-top:30px" v-show="chartab == 1">
            <line-charts ref='lineChart' :list="list" :tab="tab" />
        </div>
        <div class="fan-list" style="margin-top:30px" v-show="chartab == 2">
            <el-table
                :data="tableData"
                style="width: 100%"
            >
                <el-table-column prop="date" label="日期" />
                <el-table-column prop="name" label="总粉丝数" />
                <el-table-column prop="address" label="粉丝变化数" />
                <el-table-column prop="date" label="涨粉数" />
                <el-table-column prop="name" label="掉粉数" />
                <el-table-column prop="address" label="活跃粉丝数" />
            </el-table>
            <superPaginationVue
                :total="page.total"
                v-model:currentPage="page.current"
                v-model:pageSize="page.pageSize"
            ></superPaginationVue>
        </div>
      </div>
      <div class="distribution">
        <div class="distribution-left">
          <div>性别分布</div>
          <div>
            <sex-charts :list="sexList" ref='SexCharts' />
          </div>
        </div>
        <div class="distribution-right">
          <div>年龄分布</div>
          <div>
            <age-charts :list="ageList" ref='AgeCharts' />
          </div>
        </div>
      </div>
      <!-- 地域分布 -->
      <div class="geographical">
        <div>地域分布</div>
        <div>
            <address-charts :list="addressList" ref='AddressCharts' />
        </div>
      </div>
    </div>
    <div v-if="activeIndex == 1" class="single-box">
      <div class="sing-list">
        <el-table :data="tableData"  max-height="250">
          <el-table-column fixed prop="date" label="作品" />
          <el-table-column prop="name" label="播放量"  />
          <el-table-column prop="state" label="点赞量"  />
          <el-table-column prop="city" label="评论量"  />
          <el-table-column prop="address" label="完播率" />
          <el-table-column
            prop="zip"
            label="已出售nft版权收益数量"
            width="180px"
          />
          <el-table-column prop="shouyi" label="收益">
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
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <superPaginationVue
        v-model:currentPage="page.current"
        v-model:pageSize="page.pageSize"
        :total="page.total"
      ></superPaginationVue>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted } from "vue";
import { Search, QuestionFilled } from "@element-plus/icons";
import LineCharts from '@/components/charts/lineCharts.vue';
import SexCharts from '@/components/charts/sexCharts.vue';
import AgeCharts from '@/components/charts/ageCharts.vue';
import AddressCharts from '@/components/charts/addressCharts.vue';
export default defineComponent({
  components: {
    LineCharts,
    SexCharts,
    AgeCharts,
    AddressCharts,
    QuestionFilled
  },
  setup() {
    var state = reactive({
      activeIndex: 0,
      sexList: [],
      page: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
      tabsData: ["整个", "单个"],
      tab: [
          {
              title: '展现量',
              color: '#5B8FF9',
              check: true,
              key: 'a'
          },
          {
              title: '播放量',
              color: '#FFD75D',
              check: true,
              key: 'b'
          },
          {
              title: '粉丝展现量',
              color: '#5AD8A6',
              check: true,
              key: 'c'
          },
          {
              title: '粉丝播放量',
              color: '#DD0303',
              check: true,
              key: 'd'
          },
          {
              title: '点赞量',
              color: '#FF00FA',
              check: true,
              key: 'e'
          },
          {
              title: '评论量',
              color: '#2C3542',
              check: true,
              key: 'f'
          },
      ],
      value1: "",
      chartab: 1,
      tableData: [],
      list: [],
      ageList: [],
      addressList: [],
    });
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
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                f: 6
            },
            {
                time: '2021',
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                f: 7
            }
        ]
        state.list = list;
        state.sexList = [1];
        // SexCharts.value.initCharts();
        state.ageList = [{name: '18', num: 20}]
        state.addressList = [{name: '18', num: 20}, {name: '19', num: 21}];
    })
    return {
      ...toRefs(state),
      linePos,
      charBtn,
    };
  },
});
</script>
<style lang="scss">
.work-box {
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
.work-box {
  padding: 30px 40px 30px 35px;
  .no-more {
    margin-top: 40px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    text-align: center;
  }
  .single-box {
    margin-top: 20px;
  }
  .selected {
    color: #63a5ff;
    border: 1px solid #63a5ff !important;
  }
  .container-box {
    .geographical {
      // height: 200px;
      background: #ffffff;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      border: 1px solid #f4f4ff;
      margin-top: 30px;
      padding: 27px 31px;
    }
    .distribution {
      height: 420px;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      .distribution-left {
        width: 380px;
        height: 420px;
        background: #ffffff;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        border: 1px solid #f4f4ff;
        padding: 27px 31px;
      }
      .distribution-left > div:nth-child(1) {
        font-weight: 500;
        color: #333333;
        line-height: 22px;
        font-size: 16px;
      }
      .distribution-right {
        width: 510px;
        background: #ffffff;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        border: 1px solid #f4f4ff;
        padding: 27px 31px;
      }
      .distribution-right > div:nth-child(1) {
        font-weight: 500;
        color: #333333;
        line-height: 22px;
        font-size: 16px;
      }
    }
    .trend-chart {
      margin-top: 40px;
      height: 560px;
      background: #ffffff;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      border: 1px solid #f4f4ff;
      padding-left: 31px;
      padding-top: 34px;
      .chart-title {
        display: flex;
        justify-content: space-between;
        height: 32px;
        line-height: 32px;
        .title-left {
          display: flex;
          align-items: center;
          .datapicker {
            width: 240px;
            margin-left: 18px;
            display: flex;
            align-items:center
          }
        }
        .title-left > div:nth-child(1) {
          font-weight: 500;
          font-size: 16px;
          font-weight: 500;
        }
        .title-right {
          display: flex;
          align-items: center;
          margin-right: 31px;
          font-size: 12px;
          .downloadimg {
            width: 15px;
            height: 14px;
            margin-left: 22px;
            cursor: pointer;
          }
          .down{
            margin-right: 20px;
            cursor: pointer;
          }
        }
        .chart-select {
          display: flex;
          font-size: 14px;
          text-align: center;
          > div {
            cursor: pointer;
            width: 100px;
            height: 32px;
            background: #ffffff;
            border-right: 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;
            border-top: 1px solid #d9d9d9;
          }
        }
        .chart-select > div:nth-child(1) {
          border-left: 1px solid #d9d9d9;
        }
      }
    }
    .coreList {
      display: flex;
      justify-content: space-between;
      > div {
        width: 220px;
        height: 140px;
        background: #fafafb;
        border-radius: 8px;
        padding-left: 17px;
        padding-top: 18px;
        box-sizing: border-box;
        color: #333;
        .core-title {
          font-size: 14px;
        }
        .core-num {
          font-weight: 600;
          font-size: 32px;
          line-height: 58px;
        }
        .core-num > span:nth-child(2) {
          font-size: 18px !important;
          margin-left: 5px;
        }
        .core-fan {
          font-size: 12px;
          margin-top: 10px;
        }
      }
    }
    .core-data {
      height: 73px;
      font-size: 18px;
      color: #333;
      display: flex;
      justify-content: space-between;
      line-height: 73px;
    }
    .core-data > div:nth-child(1) {
      font-weight: 600;
      font-size: 18px;
    }
    .core-data > div:nth-child(2) {
      font-size: 14px;
    }
  }
  .work-title {
    color: #333;
    font-weight: 500;
    height: 33px;
    line-height: 33px;
    margin-bottom: 20px;
    font-size: 24px;
  }
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
</style>
