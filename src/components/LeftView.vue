<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-select
          ref="networkSelect"
          v-model="chainId"
          :placeholder="$t('m.selectNetwork')"
          :disabled="isConnectedMetaMask"
        >
          <el-option
            v-for="item in networks"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <!-- <i
              class="el-icon-s-opportunity"
              style="margin-right: 4px"
              v-if="item.address"
            ></i> -->
            <span>{{ item.name }}</span>
            <span
              style="
                opacity: 0.4;
                color: #8492a6;
                font-size: 10px;
                margin-left: 20px;
                font-weight: normal;
                float: right;
              "
              v-if="item.address"
              >({{ item.address }})</span
            >
          </el-option>
          <div
            style="
              margin: 4px 0;
              width: 100%;
              height: 1px;
              background-color: #dcdfe6;
            "
          ></div>
          <div style="display: flex">
            <el-button
              type="primary"
              style="flex: 1; margin: 4px 12px"
              icon="el-icon-setting"
              v-on:click="onSetCustomProviders"
              >自定义节点</el-button
            >
          </div>
        </el-select>
      </el-col>
      <el-col :span="8" style="text-align: center">
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-on:click="onAddContract"
        ></el-button>
      </el-col>
    </el-row>
    <span
      v-if="isConnectedMetaMask"
      style="font-size: 10px; opacity: 0.8; margin-left: 4px; color: red"
      >{{ $t("m.switchChain") }}</span
    >
    <ul>
      <li
        class="contract-li"
        v-for="item in contracts"
        :key="item.name"
        :class="{ active: activeContract.address == item.address }"
        v-on:click="onContractSelected(item)"
      >
        <div style="display: flex; align-items: center">
          <div style="flex-grow: 1">
            <div
              class="contract-name"
              style="font-weight: bold; font-size: medium; margin-bottom: 5px"
            >
              {{ item.name }}
            </div>
            <div style="font-size: small; opacity: 0.6">{{ item.addr }}</div>
          </div>
          <el-row :gutter="10" style="margin-right: 0px">
            <el-col :span="12">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                circle
                v-on:click="onEdit(item)"
              ></el-button>
            </el-col>
            <el-col :span="12">
              <el-popconfirm
                :title="$t('m.delContractConfirm')"
                v-on:confirm="onRemove(item)"
                :confirm-button-text="$t('m.confirm')"
                :cancel-button-text="$t('m.cancel')"
              >
                <el-button
                  type="danger"
                  size="small"
                  slot="reference"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-popconfirm>
            </el-col>
          </el-row>
        </div>
      </li>
    </ul>
    <AddContractView ref="addContractDlg" v-on:ok="onAddContractOk" />
    <EditContractView ref="editContractDlg" v-on:ok="onEditContractOk" />
    <CustomProviderView
      ref="customProviderView"
      v-on:closed="onCustomProvidersDlgClosed"
    />
  </div>
</template>

<script>
import AddContractView from "./AddContractView";
import EditContractView from "./EditContractView";
import CustomProviderView from "./CustomProviderView";
import db from "../lib/db.js";
import DB from "../lib/db.js";
import Util from "../lib/util";

export default {
  name: "left-view",
  components: {
    AddContractView,
    EditContractView,
    CustomProviderView,
  },
  data: function () {
    return {
      networks: [],
      chainId: "",
      isConnectedMetaMask: false,
      contracts: [],
      activeContract: null,
    };
  },
  computed: {
    //当前选中的网络
    currentNetwork: function () {
      for (let i in this.networks) {
        let network = this.networks[i];
        if (network.id === this.chainId) {
          return network;
        }
      }
      return null;
    },
  },
  methods: {
    //选中合约项时触发
    onContractSelected: function (contract) {
      this.activeContract = contract;
    },
    //添加合约
    onAddContract: function () {
      this.$refs.addContractDlg.title =
        this.currentNetwork.name + ":  " + this.$t("m.addContract");
      this.$refs.addContractDlg.isVisible = true;
    },
    //合约添加成功
    onAddContractOk: function (contract) {
      contract.chainId = this.chainId;
      DB.addContract(this.chainId, contract);
      this.contracts.push(contract);
      this.activeContract = contract;
    },
    //编辑合约
    onEdit: function (contract) {
      this.$refs.editContractDlg.title =
        this.currentNetwork.name + ":  " + this.$t("m.editContract");
      this.$refs.editContractDlg.contract = contract;
      this.$refs.editContractDlg.isVisible = true;
    },
    //合约编辑成功
    onEditContractOk: function (contract) {
      DB.updateContract(contract);
    },
    //移除合约
    onRemove: function (contract) {
      DB.removeContract(this.chainId, contract);
      this.contracts = this.contracts.filter(
        (item) => item.address !== contract.address
      );
      if (this.activeContract === contract) {
        this.activeContract =
          this.contracts.length > 0 ? this.contracts[0] : null;
      }
    },
    //设置自定义节点
    onSetCustomProviders: function () {
      this.$refs.networkSelect.blur();
      this.$refs.customProviderView.isVisible = true;
    },
    //自定义节点窗口关闭
    onCustomProvidersDlgClosed: function () {
      let networks = Util.networks.concat();
      let customNodes = DB.getCustomNodes();
      customNodes.forEach((t) => {
        t.id = t.address;
        networks.push(t);
      });
      this.networks = networks;
    },
    onConnect: async function (connectInfo) {
      console.log("Metamask connected.");
      this.chainId = connectInfo.chainId;
      let account = await Util.getMetaMaskAccount();
      this.isConnectedMetaMask = account != null;
    },
    onDisconnect: function (error) {
      console.log("Metamask disconnect. Error:");
      console.log(error);
    },
    onChainChanged: function (chainId) {
      console.log("Metamask chain changed.");
      this.chainId = chainId;
    },
    onAccountsChanged: function (accounts) {
      console.log("Metamask accounts changed.");
      this.isConnectedMetaMask = accounts && accounts.length > 0;
    },
  },
  created: async function () {
    let networks = Util.networks.concat();
    let customNodes = DB.getCustomNodes();
    customNodes.forEach((t) => {
      t.id = t.address;
      networks.push(t);
    });
    this.networks = networks;
    this.chainId = DB.getCurrentChainId();
    window.ethereum.on("connect", this.onConnect);
    window.ethereum.on("disconnect", this.onDisconnect);
    window.ethereum.on("chainChanged", this.onChainChanged);
    window.ethereum.on("accountsChanged", this.onAccountsChanged);
    let account = await Util.getMetaMaskAccount();
    this.isConnectedMetaMask = account != null;
    if (this.isConnectedMetaMask) {
      this.chainId = Util.getMetaMaskChainId();
    }
  },
  watch: {
    chainId: function (newValue) {
      DB.setCurrentChainId(newValue);
      this.contracts = DB.getContracts(newValue);
      var lastAddress = DB.getCurrentContractAddress();
      let list = this.contracts.filter((t) => t.address === lastAddress);
      if (list.length > 0) {
        this.activeContract = list[0];
      } else if (this.contracts.length > 0) {
        this.activeContract = this.contracts[0];
      } else {
        this.activeContract = null;
      }
    },
    activeContract: function (newvalue) {
      if (newvalue) {
        db.setCurrentContractAddress(newvalue.address);
      }
      this.$emit("activeContractChanged", newvalue);
    },
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
ul {
  list-style: none;
  padding: 0;
}
.contract-li {
  padding: 10px 0 10px 10px;
}
.contract-li:hover {
  background-color: #f4f4f4;
}
.contract-li.active {
  background-color: #efefef;
}
.contract-li:hover .contract-name {
  color: #409eff;
}
.contract-li.active .contract-name {
  color: #409eff;
}
.contract-li .el-row {
  display: none;
}
.contract-li:hover .el-row {
  display: block;
}
</style>