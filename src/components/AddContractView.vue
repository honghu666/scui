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
          <el-form-item :label="$t('m.aliasName')" prop="name">
            <el-input
              v-model="contract.name"
              :placeholder="$t('m.contractNameHolder')"
              maxlength="30"
              show-word-limit
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('m.contractAddress')" prop="address">
            <el-input
              v-model="contract.address"
              :placeholder="$t('m.contractAddressHolder')"
              maxlength="42"
              show-word-limit
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('m.abi')" prop="abi">
            <el-input
              v-model="contract.abi"
              type="textarea"
              :placeholder="$t('m.abiHolder')"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :clearable="true"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="footer-button" @click="isVisible = false">{{
          $t("m.cancel")
        }}</el-button>
        <el-button class="footer-button" type="primary" v-on:click="onOk">{{
          $t("m.ok")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkAbi = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("m.required", ["ABI"])));
      }
      try {
        JSON.parse(value);
        callback();
      } catch {
        callback(new Error(this.$t("m.abiInvalid")));
      }
    };
    return {
      title: this.$t("m.addContract"),
      isVisible: false,
      contract: {
        name: "",
        address: "",
        abi: "",
      },
      contractRules: {
        name: [
          {
            required: true,
            message: this.$t("m.required", [this.$t("m.aliasName")]),
            trigger: "blur",
          },
          {
            min: 4,
            max: 30,
            message: this.$t("m.aliasNameLengthVerify"),
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: this.$t("m.required", [this.$t("m.contractAddress")]),
            trigger: "blur",
          },
          {
            pattern: /^0x[a-zA-Z0-9]{40}$/,
            message: this.$t("m.contractAddressVerify"),
            trigger: "blur",
          },
        ],
        abi: [
          {
            required: true,
            message: this.$t("m.required", ["ABI"]),
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