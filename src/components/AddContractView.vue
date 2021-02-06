<template>
  <div>
    <el-dialog :title.sync="title" :visible.sync="isVisible" width="700px">
      <div>
        <el-form
          :model="contract"
          :rules="contractRules"
          ref="form"
          label-width="150px"
        >
          <el-form-item label="Alias name：" prop="name">
            <el-input
              v-model="contract.name"
              placeholder="Readable name, like CryptoKitties."
              maxlength="30"
              show-word-limit
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="Contract address：" prop="address">
            <el-input
              v-model="contract.address"
              placeholder="Start with 0x..."
              maxlength="42"
              show-word-limit
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="ABI：" prop="abi">
            <el-input
              v-model="contract.abi"
              type="textarea"
              placeholder="Contract abi. Json format string."
              :autosize="{ minRows: 4, maxRows: 8 }"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="footer-button" @click="isVisible = false"
          >Cancel</el-button
        >
        <el-button class="footer-button" type="primary" v-on:click="onOk"
          >OK</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkAbi = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("ABI required."));
      }
      try {
        JSON.parse(value);
        callback();
      } catch {
        callback(new Error("ABI is not a valid JSON string."));
      }
    };
    return {
      title: "Add contract",
      isVisible: false,
      contract: {
        name: "",
        address: "",
        abi: "",
      },
      contractRules: {
        name: [
          { required: true, message: "Alias name required.", trigger: "blur" },
          {
            min: 4,
            max: 30,
            message: "Alias name length is between 4 and 30.",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "Contract address required.",
            trigger: "blur",
          },
          {
            pattern: /^0x[a-zA-Z0-9]{40}$/,
            message:
              "The contract address is 42 length string starting with '0x'.",
            trigger: "blur",
          },
        ],
        abi: [
          {
            required: true,
            message: "ABI required.",
            trigger: "blur",
          },
          { validator: checkAbi, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onOk: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.isVisible = false;
          var addr =
            this.contract.address.substr(0, 10) +
            "..." +
            this.contract.address.substr(this.contract.address.length - 8, 8);
          this.$emit("ok", {
            name: this.contract.name,
            address: this.contract.address,
            addr,
            abi: this.contract.abi,
          });
          this.contract.name = "";
          this.contract.address = "";
          this.contract.abi = "";
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.footer-button {
  width: 100px;
}
</style>