<template>
  <div>
    <el-dialog :title.sync="title" :visible.sync="isVisible" width="600px">
      <div>
        <el-form
          :model="contract"
          :rules="contractRules"
          ref="form"
          label-width="100px"
        >
          <el-form-item label="合约名称：" prop="name">
            <el-input
              v-model="contract.name"
              placeholder="友好的名称，如CryptoKitties"
              maxlength="30"
              show-word-limit
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="合约地址：" prop="address">
            <el-input
              v-model="contract.address"
              placeholder="合约地址，0x..."
              maxlength="42"
              show-word-limit
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="ABI：" prop="abi">
            <el-input
              v-model="contract.abi"
              type="textarea"
              placeholder="合约的ABI，json格式字符串"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" v-on:click="onOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkAbi = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入ABI"));
      }
      try {
        JSON.parse(value);
        callback();
      } catch {
        callback(new Error("ABI不是有效的json字符串"));
      }
    };
    return {
      title: "添加合约",
      isVisible: false,
      contract: {
        name: "",
        address: "",
        abi: "",
      },
      contractRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 4, max: 30, message: "长度在4到30个字符", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入合约地址", trigger: "blur" },
          {
            pattern: /^0x[a-zA-Z0-9]{40}$/,
            message: "合约地址为0x开头的42位字符串",
            trigger: "blur",
          },
        ],
        abi: [{ validator: checkAbi, trigger: "blur" }],
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