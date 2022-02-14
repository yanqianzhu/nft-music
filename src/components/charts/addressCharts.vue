<template>
    <div class="line-charts">
        <div id='address-charts' ref="line" style="height: 300px;margin:0 auto"></div>
    </div>
</template>
<script lang="ts">
import { inputEmits } from "element-plus";
import { defineComponent, reactive, toRefs, computed, onMounted, watch, ref } from "vue";
import echarts from '../../echarts';

export default defineComponent({
    props: {
        list: Array,
    },
  setup(props) {
   watch(() => props.list, (n) => {
       initCharts(n)
   })
    const line = ref();
    const initCharts = (list: Array<any>) => {
        var myChart = echarts.getInstanceByDom(line.value);
        if (myChart == null) {
            myChart = echarts.init(line.value);
        }
        const option = {
            // title: {
            //     text: 'Bar Chart with Negative Value'
            // },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const html = `<div><span>${params[0].name}</span><span>${params[0].value}</span></div>`
                    return `<div class='line-tooltip'>${params[0].seriesName}<br />${html}</div>`;
                }
            },
            grid: {
                top: 80,
                bottom: 30
            },
            xAxis: {
                type: 'value',
                position: 'top',
                splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
                }
            },
            yAxis: {
                type: 'category',
                // axisLine: { show: false },
                // axisLabel: { show: false },
                // axisTick: { show: false },
                // splitLine: { show: false },
                data: list.map((item: any) => item.name)
            },
            series: [
                {
                name: '地域分布',
                type: 'bar',
                stack: 'Total',
                label: {
                        show: true,
                        position: 'right',
                        
                    },
                barWidth: '30px',
                
                data: list.map((item: any) => item.num)
                }
            ]
            };
        myChart.setOption(option, true)
    }   
    return {
        initCharts,
        line
    };
  },
});
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
    .tabs{
        display: flex;
        align-items: center;
        .tab-item{
            display: flex;
            align-items: center;
            margin-right: 30px;
            div:nth-child(1){
                height: 2px;
                width: 10px;
                // background: red;
                margin-right: 6px;
            }
            div{
                color: rgba(44, 53, 66, 0.65);
                font-size: 12px;
            }
        }
    }
    .tip{
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
    }
</style>
