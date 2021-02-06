<template>
  <el-main style="margin: 0 100px">
    <div>
      <div style="width: 50%">
        <h1>关于SCUI</h1>
        <p>
          SCUI是一个与以太坊智能合约交互的工具，该工具提供了友好的交互界面，所有人都可以使用。
          你可以在这里添加并标识以太坊智能合约，添加智能合约时需要包含合约地址以及合约的abi信息，
          然后你就可以观察合约的属性，调用合约的方法，并观测合约的事件。
        </p>
        <p>
          SCUI的所有数据均存储在本地，在执行消耗GAS的调用时，通过<el-link
            href="https://metamask.io/"
            target="metamask"
            type="primary"
            >MetaMask</el-link
          >发送交易，请确保浏览器安装了<el-link
            href="https://metamask.io/"
            target="metamask"
            type="primary"
            >MetaMask</el-link
          >插件。
        </p>
        <p>
          SCUI是一个开源项目，项目地址：<el-link
            href="https://github.com/honghu666/contract-interaction"
            target="contract-interaction"
            type="primary"
            >https://github.com/honghu666/contract-interaction</el-link
          >。使用过程中如果碰到问题，可以在GitHub上反馈，也欢迎大家提供代码。
        </p>
        <h1>赞助</h1>
        <p>
          如果你觉得SCUI对你有所帮助，可以通过下列地址对作者进行赞助，你的赞助是对作者最大的支持！
        </p>
      </div>
      <div style="display: flex; flex-wrap: wrap">
        <div class="address">
          <canvas class="qrcode" ref="ethQrcode"></canvas>
          <div><b>ETH: </b>{{ ethAddress }}</div>
        </div>
        <div class="address">
          <canvas class="qrcode" ref="btcQrcode"></canvas>
          <div><b>BTC: </b>{{ btcAddress }}</div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import QRious from "qrious";

export default {
  computed: {
    ethAddress: function () {
      return this.configs.ethAddress;
    },
    btcAddress: function () {
      return this.configs.btcAddress;
    },
  },
  mounted: function () {
    new QRious({
      element: this.$refs["ethQrcode"],
      value: this.ethAddress,
      size: 150,
    });
    new QRious({
      element: this.$refs["btcQrcode"],
      value: this.btcAddress,
      size: 150,
    });
  },
};
</script>

<style scoped>
.address {
  text-align: center;
  font-size: 12px;
  margin-right: 20px;
}
p {
  text-align: justify;
}
</style>