<template>
    <div class="line-charts">
        <div class="tip" style="margin-top:20px">比例</div>
        <div id='age-charts' ref="line" style="height: 300px;width:446px;margin:0 auto"></div>
        <div class="tip" style="text-align: right;">年龄/岁</div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted, watch, ref } from "vue";
import echarts from '../../echarts';

export default defineComponent({
    props: {
        list: Array
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
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    // console.log(params)
                    // var html = '';
                    // params.forEach((element: any) => {
                    const html = `<div><span>${params.name}</span><span>${params.value}%</span></div>`
                    // });
                    // html += `<p></p>`;
                    return `<div class='line-tooltip'>${params.seriesName}<br />${html}</div>`;
                }
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: list.map((item) => item.name)
            },
            yAxis: {
                type: 'value',
                show: false,
            },
            series: [
                {
                    name: '年龄分布',
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'top',
                        formatter(params: any) {
                            return params.value + '%'
                        }
                    },
                    barWidth: '30px',
                    itemStyle: {
                        color: '#5AD8A6',
                        
                    },
                    data: list.map((item) => item.num)
                },
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
