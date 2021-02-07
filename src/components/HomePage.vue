<template>
  <el-container style="margin: 10px 0">
    <el-aside style="width: 260px">
      <LeftView v-on:activeContractChanged="onActiveContractChanged" />
    </el-aside>
    <el-divider direction="vertical"></el-divider>
    <el-main style="padding: 0 10px">
      <MainView v-if="contract !== null" :contract="contract" />
      <div style="font-size: 18px; opacity: 0.6; padding: 10px" v-else>
        {{ $t("m.createContractFirst") }}
      </div>
    </el-main>
  </el-container>
</template>

<script>
import MainView from "./MainView";
import LeftView from "./LeftView";
export default {
  components: {
    MainView,
    LeftView,
  },
  data: function () {
    return {
      contract: null,
    };
  },
  methods: {
    onActiveContractChanged: function (contract) {
      this.contract = contract;
    },
  },
};
</script>

<style>
section .el-divider--vertical {
  height: auto;
}
</style>