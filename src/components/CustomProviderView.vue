<template>
  <el-dialog
    :title.sync="title"
    :visible.sync="isVisible"
    width="600px"
    v-on:closed="$emit('closed')"
  >
    <div>
      <div class="row">
        <div class="column1">
          <b>名称</b>
        </div>
        <div class="column2">
          <b>地址</b>
        </div>
        <div class="column3"></div>
      </div>
      <div v-for="(item, index) in customNodes" :key="index">
        <div class="divider"></div>
        <div class="row">
          <div class="column1">{{ item.name }}</div>
          <div class="column2">{{ item.address }}</div>
          <div class="column3">
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              v-on:click="onDeleteNode(item.address)"
              circle
            ></el-button>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="row">
        <div class="column1">
          <el-input v-model="name" placeholder="name"></el-input>
        </div>
        <div class="column2">
          <el-input
            v-model="address"
            placeholder="http://127.0.0.1:8545"
          ></el-input>
        </div>
        <div class="column3">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            v-on:click="onAddNode"
            circle
          ></el-button>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        class="footer-button"
        type="primary"
        @click="isVisible = false"
        >{{ $t("m.ok") }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import Db from "../lib/db";

export default {
  data: function () {
    return {
      title: "自定义节点",
      isVisible: false,
      name: "",
      address: "",
      customNodes: [],
    };
  },
  created: function () {
    this.customNodes = Db.getCustomNodes();
  },
  methods: {
    //添加自定义节点
    onAddNode: function () {
      if (this.name === null || this.name === "") {
        this.$message.error("名称必填！");
        return;
      }
      if (this.address === null || this.address === "") {
        this.$message.error("节点地址必填！");
        return;
      }
      if (!this.address.startsWith("http")) {
        this.$message.error("节点地址无效！");
      }
      let node = this.customNodes.find((t) => t.address === this.address);
      if (node) {
        this.$message.error("指定地址的节点已存在！");
        return;
      }
      Db.addCustomNode(this.name, this.address);
      this.customNodes.push({
        name: this.name,
        address: this.address,
      });
      this.name = null;
      this.address = null;
    },
    //删除自定义节点
    onDeleteNode: function (address) {
      this.customNodes = this.customNodes.filter((t) => t.address !== address);
      Db.deleteCustomNode(address);
    },
  },
};
</script>

<style scoped>
.row {
  display: flex;
}
.column1 {
  flex: 1;
  align-self: center;
  margin-right: 20px;
}
.column2 {
  flex: 1;
  align-self: center;
  margin-right: 20px;
}
.column3 {
  width: 100px;
  align-self: center;
}
.divider {
  margin: 10px 0;
  width: 100%;
  height: 0.5px;
  background-color: #dcdfe6;
}
</style>