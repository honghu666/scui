<template>
  <div
    style="
      display: flex;
      align-items: center;
      background-color: #409eff;
      color: white;
    "
  >
    <span style="margin: 0 30px; font-size: 18px; font-weight: 600">SCUI</span>
    <el-menu
      style="flex: 1"
      :default-active="activeIndex"
      mode="horizontal"
      :router="true"
      text-color="#C0C4CC"
      background-color="#409eff"
      active-text-color="#fff"
    >
      <el-menu-item index="/home">Home </el-menu-item>
      <el-menu-item index="/about">About </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      activeIndex: "/home",
    };
  },
};
</script>