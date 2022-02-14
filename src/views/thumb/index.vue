<template>
  <swiper
    :direction="'vertical'"
    :slidesPerView="1"
    :spaceBetween="20"
    :mousewheel="true"
    :touchRatio="0.5"
    :loop="false"
    @activeIndexChange="activeIndexChange"
    :speed="300"
  >
    <swiper-slide v-for="(item, index) in audioList">
      <audioItem
        :key="item.id"
        :item="item"
        :index="index"
        :ref="setItemRef"
        @changeStatus="changeStatus"
      ></audioItem>
    </swiper-slide>
  </swiper>
</template>

<script lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import SwiperCore, { Mousewheel, Pagination } from "swiper";
SwiperCore.use([Mousewheel, Pagination]);
import audioItem from "@/components/audioItem/index.vue";
import { defineComponent, ref, watch } from "vue";
import { getRecommendMusicList } from "@/api/apiManagement/audio";

export default defineComponent({
  components: { audioItem, Swiper, SwiperSlide },
  setup() {
    const audioList = ref([]);
    let swiperIndex = ref(0);
    let itemRef = ref();
    let page = ref(1);
    watch(swiperIndex, (val, old) => {
      if (val > old && val > page.value * 10 - 15) {
        getMusicList();
      }
      console.log(itemRefs, val, old);
      if (itemRefs[old].getAudioPlaying() == true) {
        itemRefs[old].onPlay();
      }
      if (itemRefs[old].getAudioPlaying() == true) {
        itemRefs[val].onPlay();
      }
      // nextTick(() => {
      //   if (itemRefs[old].getAudioPlaying() == true) {
      //     itemRefs[old].onPlay();
      //   }
      //   if (itemRefs[old].getAudioPlaying() == true) {
      //     itemRefs[val].onPlay();
      //   }
      // });
    });
    const itemRefs: any[] = [];
    const setItemRef = (el: any) => {
      if (el) {
        itemRefs.push(el);
      }
    };
    const activeIndexChange = (Swiper: SwiperCore) => {
      swiperIndex.value = Swiper.activeIndex;
    };
    async function getMusicList() {
      await getRecommendMusicList({ Page: page.value, Size: 10 })
        .then((res) => {
          audioList.value.push(...res.data.list);
          page.value += 1;
        })
        .then(() => {});
    }
    function changeStatus(key: { index: number; key: string; value: number }) {
      audioList.value[key.index][key.key] = key.value;
    }
    getMusicList();
    return { audioList, activeIndexChange, setItemRef, changeStatus };
  },
});
</script>

<style lang="scss" scoped>
.swiper {
  height: 88vh;
  width: 100%;
}
@media screen and (max-width: 1600px) {
  .swiper {
    height: 83vh;
  }
}
</style>
