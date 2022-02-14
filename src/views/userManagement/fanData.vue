<template>
    <div class="work-box">
        <div class="work-title" style="font-weight: bold;">粉丝数据</div>
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
        <div class="container-box">
            <div class="core-data">
                <div>核心数据</div>
                <!-- <div>每日 14:00 前更新前一日数据</div> -->
            </div>
            <div class="coreList">
                <div>
                   <div class="core-title">粉丝数据</div>
                   <div class="core-num">1,572,638</div>
                   <div class="core-fan">
                        <span>涨粉数 12,85</span>
                        <span>掉粉数 214</span>
                   </div>
                </div>
                <div>
                    <div class="core-title">昨日活跃粉丝数</div>
                    <div class="core-num">42，685</div>
                </div>
                <div>
                    <div class="core-title">昨日活跃粉丝占比</div>
                    <div class="core-num">
                         <span>76.36</span>
                         <span>%</span>
                    </div>
                </div>
                <div>
                    <div class="core-title">昨日活跃粉丝数</div>
                    <div class="core-num">
                        <span>48.21</span>
                        <span>%</span>
                    </div>
                </div>
            </div>
            <div class="trend-chart">
                <div class="chart-title">
                    <div class="title-left">
                        <div>收益趋势分析</div>
                        <div class="datapicker">
                           
                        </div>
                    </div>
                    <div class="title-right">
                        <div class="time-sel">
                            <div>时间</div>
                            <div>7天</div>
                            <div>15天</div>
                            <div>30天</div>
                        </div>
                        <el-date-picker
                            class="datapicker"
                            v-model="value1"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            >
                        </el-date-picker>
                        <!-- <div class="chart-select">
                            <div :class="chartab == 1?'selected':''" @click="charBtn(1)">趋势图</div>
                            <div :class="chartab == 2?'selected':''" @click="charBtn(2)">数据列表</div>
                        </div>
                        <img class="downloadimg" src="../../assets/images/download.png">
                        <img src="">
                        <div>下载Excel</div> -->
                    </div>
                </div>
            </div>
            <div class="trend-chart card">
                <div class="chart-title">
                    <div class="title-left">
                        <div>数据趋势</div>
                        <!-- <div class="datapicker">
                           <el-date-picker
                                v-model="value1"
                                type="daterange"
                                range-separator="To"
                                start-placeholder="Start date"
                                end-placeholder="End date"
                            >
                            </el-date-picker>
                        </div> -->
                    </div>
                    <div class="tab-selct">
                        <img v-if="chartab == 2" style="width:14px;height:13px" class="downloadimg" src="../../assets/images/download.png">
                        <div class="down" v-if="chartab == 2">下载Excel</div>
                        <div class="tab">
                            <div :class="chartab == 1?'selected':''"  @click="charBtn(1)"><img  v-if="chartab == 2" src="../../assets/images/xs.png" /><img v-if="chartab == 1" src="../../assets/images/trend.png" /><span>趋势图</span></div>
                            <div :class="chartab == 2?'selected':''"  @click="charBtn(2)"><img  v-if="chartab == 2" src="../../assets/images/wa.png" /><img v-if="chartab == 1" src="../../assets/images/wa2.png" /><span>数据列表</span></div>
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
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted, ref, watch } from "vue";
import LineCharts from '@/components/charts/lineCharts.vue';
import SexCharts from '@/components/charts/sexCharts.vue';
import AgeCharts from '@/components/charts/ageCharts.vue';
import AddressCharts from '@/components/charts/addressCharts.vue';
export default defineComponent({
    components: {
        LineCharts,
        SexCharts,
        AgeCharts,
        AddressCharts
    },
  setup() {
    var state = reactive({
        activeIndex: 0,
        tabsData: ['概况'],
        value1: [],
        chartab:1,
        list: [],
        ageList: [],
        tableData: [],
        addressList: [],
        sexList: [],
        tab: [
            {
                title: '总粉丝数',
                color: '#5B8FF9',
                check: true,
                key: 'a'
            },
            {
                title: '粉丝变化数',
                color: '#FFD75D',
                check: true,
                key: 'b'
            },
            {
                title: '涨粉数',
                color: '#5AD8A6',
                check: true,
                key: 'c'
            },
            {
                title: '掉粉数',
                color: '#DD0303',
                check: true,
                key: 'd'
            },
            {
                title: '活跃粉丝数',
                color: '#FF00FA',
                check: true,
                key: 'e'
            },
        ],
        page: {
            pageSize: 10,
            current: 1,
            total: 0
        }
    })
    const linePos = computed(() => {
      return state.activeIndex * 100 + "px";
    });
    const charBtn = function(n: number){
        state.chartab = n;
    }
    
    onMounted(() => {
        const list = [
            {
                time: '2020',
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5
            },
            {
                time: '2021',
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5
            }
        ]
        state.list = list;
        state.sexList = [1];
        state.ageList = [{name: '18', num: 20}]
        state.addressList = [{name: '18', num: 20}];
    })
    watch(() => state.value1, () => {
        const list = [
            {
                time: '2020',
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5
            },
            {
                time: '2021',
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5
            },
            {
                time: '2021=2',
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5
            }
        ]
        state.list = list;
        
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
.work-box{
    .el-range-separator{
        height:32px !important;
    }
    .el-date-editor{
        width:240px !important;
        height:32px !important;
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
    .tab-selct{
        display: flex;
        align-items: center;
        padding-right: 30px;
        cursor: pointer;
        >.down{
            color: #000;
            font-size: 12px;
            margin-right: 20px;
        }
        >img{
            width: 15px;
            height: 14px;
            margin: 0 8px 0 0px;
        }
        .tab{
            display: flex;
            align-items: center;
            >div{
                border: 1px solid #D9D9D9;
                width: 100px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                
            }
            >div.selected{
                border-color: #63A5FF;
                color: #63A5FF;
            }
            >div:nth-child(1){
                border-radius: 3px 0px 0px 3px;
                img{
                    width: 13px;
                    height: 12px;
                }
                
            }
            >div:nth-child(2){
                border-radius: 0px 3px 3px 0px;
                img{
                    width: 13px;
                    height: 15px;
                    margin-right: 4px;
                }
                
            }
        }
    }
    .time-sel{
        display: flex;
        align-items: center;
        div:nth-child(1){
            cursor: auto
        }
        div{
            width: 60px;
            text-align: center;
            cursor: pointer;
        }
        div.active{
            color: #68A8FF;
        }
    }
  .work-box{
         padding: 30px 40px 30px 35px;
        //  .selected{
        //     color:#63A5FF;
        //     border:1px solid  #63A5FF !important;
        //  }
         .container-box{
             .geographical{
                //  height:200px;
                 background: #FFFFFF;
                 box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
                 border-radius: 4px;
                 border: 1px solid #F4F4FF;
                 margin-top:30px;
                 padding:27px 31px;
             }
             .distribution{
                 height:420px;
                 margin-top:30px;
                 display: flex;
                 justify-content: space-between;
                 .distribution-left{
                    width: 380px;
                    height: 420px;
                    background: #FFFFFF;
                    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
                    border-radius: 4px;
                    border: 1px solid #F4F4FF;
                    padding:27px 31px;
                 }
                 .distribution-left >div:nth-child(1){
                    font-weight: 500;
                    color: #333333;
                    line-height: 22px;
                    font-size:16px;
                 }
                 .distribution-right{
                    width: 510px;
                    background: #FFFFFF;
                    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
                    border-radius: 4px;
                    border: 1px solid #F4F4FF;
                    padding:27px 31px;
                 }
                 .distribution-right >div:nth-child(1){
                    font-weight: 500;
                    color: #333333;
                    line-height: 22px;
                    font-size:16px;
                 }
             }
             .trend-chart.card{
                 margin-top:40px;
                 height:560px;
                 background: #FFFFFF;
                 box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
                 border-radius: 4px;
                 border: 1px solid #F4F4FF;
                 padding-left:31px;
                 padding-top:34px;
                 .chart-title{
                     display: flex;
                     justify-content: space-between;
                     height:32px;
                     line-height:32px;
                     
                     .title-left{
                         display:flex;
                         >div::nth-child(1){
                            font-weight: bold;
                            color: #333333;
                         }
                         .datapicker{
                             width:240px;
                             margin-left:18px;
                         }
                     }
                     .title-left >div:nth-child(1){
                         font-weight: bold;
                         font-size:16px;
                     }
                     .title-right{
                         display:flex;
                         margin-right:31px;
                         font-size:12px;
                         align-items: center;
                         cursor: pointer;
                         .downloadimg{
                             margin-left: 22px;
                             margin-right: 4px;
                             width:15px;
                             height:14px;
                         }
                     }
                     .chart-select{
                         display:flex;
                         font-size:14px;
                         text-align: center;
                         >div{
                             cursor: pointer;
                             width: 100px;
                            height: 32px;
                            background: #FFFFFF;
                            border-right: 1px solid #D9D9D9;
                            border-bottom: 1px solid #D9D9D9;
                            border-top: 1px solid #D9D9D9;
                         }
                     }
                     .chart-select >div:nth-child(1){
                         display: flex;
                         align-items: center;
                         justify-content: center;
                         img{
                             width: 14px;
                             height: 14px;
                         }
                         border-left: 1px solid #D9D9D9;
                     }
                 }
             }
             .trend-chart{
                 margin-top:40px;
                //  height:560px;
                 background: #FFFFFF;
                //  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
                 border-radius: 4px;
                //  border: 1px solid #F4F4FF;
                //  padding-left:31px;
                //  padding-top:34px;
                 .chart-title{
                     display: flex;
                     justify-content: space-between;
                     height:32px;
                     line-height:32px;
                     
                     .title-left{
                         display:flex;
                         >div::nth-child(1){
                            font-weight: bold;
                            color: #333333;
                         }
                         .datapicker{
                             width:240px;
                             margin-left:18px;
                         }
                     }
                     .title-left >div:nth-child(1){
                         font-weight: bold;
                         font-size:16px;
                     }
                     .title-right{
                         display:flex;
                         margin-right:31px;
                         font-size:12px;
                         .downloadimg{
                             width:15px;
                             height:14px;
                         }
                     }
                     .chart-select{
                         display:flex;
                         font-size:14px;
                         text-align: center;
                         >div{
                             cursor: pointer;
                             width: 100px;
                            height: 32px;
                            background: #FFFFFF;
                            border-right: 1px solid #D9D9D9;
                            border-bottom: 1px solid #D9D9D9;
                            border-top: 1px solid #D9D9D9;
                         }
                     }
                     .chart-select >div:nth-child(1){
                         border-left: 1px solid #D9D9D9;
                     }
                 }
             }
             .coreList{
                 display:flex;
                 justify-content: space-between;
                 >div{
                     width:220px;
                     height:140px;
                     background: #FAFAFB;
                     border-radius: 8px;
                     padding-left:17px;
                     padding-top:18px;
                     box-sizing: border-box;
                     color:#333;
                     .core-title{
                         font-size:14px;
                     }
                     .core-num{
                         font-weight: 600;
                         font-size:32px;
                         line-height:58px;
                     }
                     .core-num >span:nth-child(2){
                         font-size:18px !important;
                         margin-left:5px;
                     }
                     .core-fan{
                         font-size:12px;
                         margin-top:10px;
                         display: flex;
                         justify-content: space-between;
                     }
                 }
             }
          .core-data{
              height:73px;
              font-size:18px;
              color:#333;
              display: flex;
              justify-content: space-between;
              line-height:73px;
          }
          .core-data >div:nth-child(1){
              font-weight: 600;
              font-size:18px;
          }
          .core-data >div:nth-child(2){
              font-size:14px;
          }
         }
        .work-title{
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
        ul{
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            height: 100%;
            list-style: none;
            position: relative;
            li{
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
            li.active{
                font-size: 16px;
                font-weight: 500;
                color: #333333;
            }
        }
    }
</style>
