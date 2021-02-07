<template>
  <div class="footer-container">
    <div class="flex-center">
      <el-button
        type="danger"
        round
        style="margin-right: 40px"
        v-on:click="donate"
        icon="el-icon-thumb"
        class="animate__animated animate__headShake animate__slow animate__repeat-3"
      >
        {{ $t("m.donate") }}
      </el-button>
      <div style="font-size: 12px">
        <div><b>ETH: </b>{{ ethAddress }}</div>
        <div style="margin-top: 5px"><b>BTC: </b>{{ btcAddress }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Util from "../lib/util";

export default {
  computed: {
    ethAddress: function () {
      return this.configs.ethAddress;
    },
    btcAddress: function () {
      return this.configs.btcAddress;
    },
  },
  methods: {
    donate: async function () {
      try {
        let account = await Util.requestMetaMaskAccount();
        if (account == null) {
          return;
        }
        var chainId = Util.getMetaMaskChainId();
        if (chainId !== "0x1") {
          this.$message.warning(this.$t("m.switchMainChainMsg"));
          return;
        }
        let txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: this.ethAddress,
              value: "0x16345785d8a0000", //0.1eth
              chainId: "0x1",
            },
          ],
        });
        if (txHash) {
          this.$message.success(this.$t("m.donateMsg"));
        }
      } catch (e) {
        this.$message.error(e);
      }
    },
  },
};
</script>

<style scoped>
.footer-container {
  height: 100%;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: space-between;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>