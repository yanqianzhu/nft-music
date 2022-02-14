<template>
  <div class="container">
    <div class="right">
      <main class="container-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Home",
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  min-width: 1280px;
  background-color: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .right {
    width: 100%;
    flex-grow: 1;
    background-color: #fff;
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 72px);
    .container-main {
      width: 100%;
      flex-grow: 1;
      padding: 12px 30px 0px 30px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
