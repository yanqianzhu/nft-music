<template>
    <div class="line-charts">
        <div class="tabs">
            <div class="tab-item" v-for="(item, index) in tab" :key="index">
                <div :style="{background: item.color}"></div>
                <div>{{item.title}}</div>
            </div>
        </div>
        <div id='line-charts' ref="line" style="height: 300px;"></div>
        <div>
            <el-checkbox
                v-model="item.check"
                v-for="(item, index) in tab" :key="index"
                style="--el-color-primary: #000"
                :label="item.title"
            >
            </el-checkbox>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted, watch, ref } from "vue";
import echarts from '../../echarts';
interface listItem {
    check: boolean,
    key: string,
    title: string
}
export default defineComponent({
    props: {
        tab: {
            type: Array,
            require: true
        },
        list: {
            type: Array,
            require: true
        }
    },
  setup(props) {
   
    var state: any = reactive({
        list: [],
        tab: props.tab,
    })
    watch(() => state.tab, () => {
        initCharts()
    }, {deep: true})
    watch(() => props.list, () => {
        initCharts()
    })
    const line = ref();
    const initCharts = () => {
        const list = props.list;
        
        var myChart = echarts.getInstanceByDom(line.value);
        if (myChart == null) {
            myChart = echarts.init(line.value);
        }
        // var myChart = echarts.init(document.getElementById('line-charts'));
        const option = {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    var html = '';
                    params.forEach((element: any) => {
                        html += `<div><span>${element.seriesName}</span><span>${element.value}</span></div>`
                    });
                    html += `<p></p>`;
                    return `<div class='line-tooltip'>${params[0].name}<br />${html}</div>`;
                }
            },
            grid: {
                left: '1%',
                right: '3%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: list.map((item) => item.time)
            },
            yAxis: {
                type: 'value'
            },
            series: state.tab.filter((item: any) => item.check).map((item: any) => {
                return {
                    data: list.map((i) => i[item.key]),
                    name: item.title,
                    type: 'line',
                    // showSymbol:false,
                    // symbol: 'circle',
                    itemStyle: {
                        color: item.color
                    }
                }
            })
        };
        myChart.setOption(option, true)
    }   
    return {
        initCharts,
        line,
        ...toRefs(state),
    };
  },
});
</script>
<style lang="scss">
    .line-tooltip{
        width: 100px;
        div{
            display: flex;
            align-items: center;
            justify-content: space-between;
            span:nth-child(1){
                color: #999999;
                font-size: 12px
            }
        }
    }
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
    
</style>
