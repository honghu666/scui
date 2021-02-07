<template>
  <div>
    <el-tabs v-model="activeTabName">
      <el-tab-pane :label="$t('m.fetch')" name="1">
        <el-form label-width="180px" label-position="left" v-loading="isBusy">
          <el-form-item :label="$t('m.contractAddress')">
            <span>{{ props.address }}</span>
            <el-tooltip
              effect="dark"
              :content="$t('m.copyAddress')"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px"
                icon="el-icon-copy-document"
                circle
                size="mini"
                class="contract-address"
                :data-clipboard-text="props.address"
                v-on:click="copy('.contract-address')"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="$t('m.viewOnEtherscan')"
              placement="top"
            >
              <el-button
                type="primary"
                style="margin-left: 10px"
                icon="el-icon-link"
                circle
                size="mini"
                v-on:click="openAddress(props.address)"
              ></el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('m.ethBanlance')">
            <span>{{ props.balance }}</span>
          </el-form-item>
        </el-form>
        <el-divider v-if="constants.length > 0"></el-divider>
        <el-form
          v-if="constants.length > 0"
          label-width="140px"
          label-position="left"
          :class="{ hidden: constants.length === 0 }"
        >
          <el-form-item
            v-for="(item, index) in constants"
            :key="index"
            :label="item.name"
          >
            <span>{{ item.value }}</span>
          </el-form-item>
        </el-form>
        <el-collapse v-if="calls.length > 0">
          <el-collapse-item
            style="font-size: 14px"
            v-for="(item, index) in calls"
            :key="index"
            :name="index"
            :title="
              '#' + (index + 1) + '：' + item.name + '(' + item.type + ')'
            "
          >
            <el-row v-loading="item.isBusy" :gutter="20">
              <el-col :span="12">
                <InputsView
                  :header="$t('m.inputs')"
                  :inputs="item.inputs"
                  :buttonText="$t('m.fetch')"
                  v-on:submit="fetch(item)"
                ></InputsView>
              </el-col>
              <el-col :span="12">
                <div v-if="item.error !== null">
                  <span class="error">*{{ item.error }}</span>
                </div>
                <OutputsView
                  v-else
                  :header="$t('m.outputs')"
                  :outputs="item.outputs"
                ></OutputsView>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('m.call')" name="2">
        <el-collapse>
          <el-collapse-item
            style="font-size: 14px"
            v-for="(item, index) in operations"
            :key="index"
            :name="index"
            :title="
              '#' + (index + 1) + '：' + item.name + '(' + item.type + ')'
            "
          >
            <el-row v-loading="item.isBusy" :gutter="20">
              <el-col :span="12">
                <InputsView
                  :header="$t('m.inputs')"
                  :inputs="item.inputs"
                  :buttonText="$t('m.call')"
                  v-on:submit="execute(item)"
                ></InputsView>
              </el-col>
              <el-col :span="12">
                <div v-if="item.error !== null">
                  <span class="error">*{{ item.error }}</span>
                </div>
                <div v-else>
                  <div v-if="item.txUrl !== null" style="margin-bottom: 10px">
                    <el-tag
                      v-if="item.tx.confirmations === 0"
                      style="padding-left: 18px; margin-right: 10px"
                      v-loading="item.tx.confirmations === 0"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0)"
                      type=""
                    >
                      {{ $t("m.pending") }}
                    </el-tag>
                    <el-tag
                      v-if="item.tx.status === 1"
                      type="success"
                      style="margin-right: 10px"
                    >
                      <i class="el-icon-success"></i>
                    </el-tag>
                    <el-tag
                      v-else-if="item.tx.status === 0"
                      type="danger"
                      style="margin-right: 10px"
                    >
                      <i class="el-icon-warning"></i>
                    </el-tag>
                    <el-tag
                      v-if="item.tx.confirmations > 0"
                      type=""
                      style="margin-right: 10px"
                    >
                      {{
                        item.tx.confirmations >= 3
                          ? ">=3"
                          : item.tx.confirmations
                      }}
                      {{ $t("m.blockConfirmations") }}
                    </el-tag>
                    <el-link
                      type="primary"
                      :href="item.txUrl"
                      :target="item.txUrl"
                      :underline="false"
                      >{{ $t("m.viewTransactionOnEtherscan") }}</el-link
                    >
                  </div>
                  <LogsView
                    :logs="item.tx.logs"
                    v-if="item.tx.logs.length > 0"
                  ></LogsView>
                  <div v-else-if="item.txUrl !== null">
                    <b>{{ $t("m.noLogs") }}</b>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <!-- <el-tab-pane label="Events" name="3">事件</el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import { ethers } from "ethers";
import Util from "../lib/util";
import InputsView from "./InputsView";
import OutputsView from "./OutputsView";
import LogsView from "./LogsView";
import BigNumber from "bignumber.js";

export default {
  name: "main-view",
  props: ["contract"],
  components: {
    InputsView,
    OutputsView,
    LogsView,
  },
  data: function () {
    return {
      activeTabName: "1",
      provider: null,
      abi: null,
      ethContract: null,
      isBusy: false,
      props: {
        address: "",
        balance: "",
        minter: "",
      },
      constants: [],
      calls: [
        {
          name: "",
          isBusy: false,
          error: null,
          inputs: [
            {
              type: "",
              value: null,
            },
          ],
          outputs: [
            {
              type: "",
              value: null,
            },
          ],
        },
      ],
      operations: null, //跟calls数据结构一致
    };
  },
  methods: {
    //复制地址
    copy: function (className) {
      var clipboard = new this.Clipboard(className);
      clipboard.on("success", () => {
        this.$message.success(this.$t("m.copySuccess"));
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message.error(this.$t("m.copyErrorMsg"));
        clipboard.destroy();
      });
    },
    openAddress: function (address) {
      let domain = Util.getChainDomain(this.contract.chainId);
      if (domain) {
        let url = domain + "/address/" + address;
        window.open(url, address);
      } else {
        this.$message.warn(this.$t("m.cannotOpenEtherscan"));
      }
    },
    //查询合约数据
    fetch: async function (fragment) {
      try {
        let methodParams = fragment.inputs.map((item) => item.value);
        fragment.isBusy = true;
        let values = await this.ethContract.functions[fragment.name](
          ...methodParams
        );
        let outputs = fragment.outputs;
        for (let i in outputs) {
          outputs[i].value = values[i].toString();
        }
        fragment.error = null;
      } catch (e) {
        fragment.error = e;
      } finally {
        fragment.isBusy = false;
      }
    },
    //执行合约数据
    execute: async function (fragment) {
      try {
        let valueInput = fragment.inputs.find((t) => t.payable === true);
        let methodParams = fragment.inputs
          .filter((t) => t.payable !== true)
          .map((t) => t.value);
        fragment.isBusy = true;
        fragment.tx.confirmations = 0;
        fragment.tx.status = null;
        fragment.tx.logs = [];
        fragment.error = null;
        let f = this.abi.fragments.filter((t) => t.name == fragment.name);
        let data = this.abi.encodeFunctionData(f[0], methodParams);
        let ethereum = window.ethereum;
        let account = await Util.requestMetaMaskAccount();
        if (account === null) {
          return;
        }
        let txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: this.contract.address,
              data: data,
              value: valueInput
                ? new BigNumber(valueInput.value).toString(16)
                : "0",
            },
          ],
        });
        fragment.isBusy = false;
        let domain = Util.getChainDomain(this.contract.chainId);
        if (domain) {
          fragment.txUrl = domain + "/tx/" + txHash;
        } else {
          fragment.txUrl = null;
        }
        for (let i = 1; i < 4; i++) {
          let txReceipt = await this.provider.waitForTransaction(txHash, i);
          fragment.tx.confirmations = txReceipt.confirmations;
          fragment.tx.status = txReceipt.status;
          fragment.tx.logs = txReceipt.logs.map((t) => {
            let r = this.abi.parseLog(t);
            let results = [];
            for (let j in r.args) {
              let input = r.eventFragment.inputs[j];
              results.push({
                name: input.name,
                type: input.type,
                value: r.args[j].toString(),
              });
            }
            return {
              eventName: r.name,
              results: results,
            };
          });
        }
        fragment.isMining = false;
        fragment.error = null;
      } catch (e) {
        fragment.error = e;
      } finally {
        fragment.isBusy = false;
      }
    },
    //获取合约方法信息
    getMethods: function (fragments) {
      return fragments.map(function (item) {
        let inputs = (item.inputs ?? []).map(function (input) {
          return {
            type: input.type,
            name: input.name,
            value: "",
          };
        });
        if (item.payable === true) {
          inputs.push({
            type: "uint256",
            name: "ETH value",
            payable: true,
            value: 0,
          });
        }
        let outputs = (item.outputs ?? []).map(function (output) {
          return {
            type: output.type,
            name: output.name,
            value: "",
          };
        });
        return {
          name: item.name,
          type: item.type,
          error: null,
          txUrl: null,
          isBusy: false,
          tx: {
            confirmations: 0,
            status: null,
            logs: [],
          },
          inputs: inputs,
          outputs: outputs,
        };
      });
    },
    //选中的合约更改时执行
    onContractChanged: async function (contract) {
      this.calls = [];
      this.operations = [];
      this.constants = [];
      this.props.balance = "0";
      if (contract == null) {
        return;
      }
      let network = Util.getNetwork(contract.chainId);
      if (network == null) {
        return;
      }
      this.abi = new ethers.utils.Interface(contract.abi);
      this.props.address = contract.address;
      this.provider = ethers.getDefaultProvider(network.network);
      this.ethContract = new ethers.Contract(
        contract.address,
        this.abi,
        this.provider
      );
      this.isBusy = true;
      //组织调用相关的函数信息
      let calls = this.abi.fragments.filter(
        (item) => item.constant === true && item.inputs.length > 0
      );
      this.calls = this.getMethods(calls);
      //组织操作相关的函数信息
      let operations = this.abi.fragments.filter(
        (item) => item.constant === false
      );
      this.operations = this.getMethods(operations);

      //获取余额
      let balance = await this.provider.getBalance(contract.address);
      this.props.balance = ethers.utils.formatEther(balance);
      //获取常量的值
      this.constants = [];
      for (let i in this.abi.fragments) {
        let f = this.abi.fragments[i];
        if (f.constant === true && f.inputs.length === 0) {
          let value = await this.ethContract.functions[f.name].call();
          this.constants.push({
            name: f.name,
            value: value.toString(),
          });
        }
      }
      this.isBusy = false;
    },
  },
  created: async function () {
    await this.onContractChanged(this.contract);
  },
  watch: {
    contract: async function (contract) {
      await this.onContractChanged(contract);
    },
  },
};
</script>

<style>
.el-collapse-item__header {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}
.el-collapse-item__content {
  font-size: 14px;
  color: #606266;
}
.el-tag .el-loading-spinner {
  top: 0;
  text-align: left;
  margin: 0 0 0 4px;
}
</style>

<style scoped>
.error {
  color: red;
}
.hidden {
  display: none;
}
ul {
  list-style: none;
  padding-left: 0;
}
ul li {
  padding: 4px 0;
}
</style>