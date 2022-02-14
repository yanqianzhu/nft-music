<template>
    <div class="line-charts">
        
        <div id='pie-charts' ref="line" style="height: 300px;width:300px;margin:0 auto"></div>
        <div class="sex-type">
            <div class="sex-item">
                <div></div>
                <span>男性</span>
            </div>
            <div class="sex-item">
                <div style="background: #5AD8A6;"></div>
                <span>女性</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted, watch, ref } from "vue";
import echarts from '../../echarts';

export default defineComponent({
    props: {
        list: Array,
    },
  setup(props) {
   watch(() => props.list, () => {
       initCharts(props.list)
   })
    const line = ref();
    const initCharts = (list: Array<any>) => {
        var myChart = echarts.getInstanceByDom(line.value);
        if (myChart == null) {
            myChart = echarts.init(line.value);
        }
        const option = {
            tooltip: {
                trigger: 'item'
            },
            
            series: [
                {
                name: '性别分布',
                type: 'pie',
                radius: ['40%', '70%'],
                label: {
                    // show: false,
                    color: '#fff',
                    position: 'inner'
                },
                // emphasis: {
                //     label: {
                //         show: true,
                //         fontSize: '40',
                //         fontWeight: 'bold'
                //     }
                // },
                
                data: [
                    { value: 1048, name: '男' },
                    { value: 735, name: '女' },
                ]
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
    .sex-type{
        display: flex;
        align-items: center;
        justify-content: center;
        .sex-item{
            display: flex;
            align-items: center;
            div{
                width: 6px;
                height: 6px;
                background: #5B8FF9;
                border-radius: 3px;
            }
            span{
                font-size: 12px;
                color: rgba(0, 0, 0, 0.45);
                margin-left: 6px;
            }
        }
        .sex-item:nth-child(2){
            margin-left: 70px;
        }
    }
</style>
