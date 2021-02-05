<template>
  <div>
    <el-dialog :title.sync="title" :visible.sync="isVisible" width="600px">
      <div>
        <el-form
          :model="model"
          :rules="contractRules"
          ref="form"
          label-width="100px"
        >
          <el-form-item label="合约名称：" prop="name">
            <el-input
              v-model="model.name"
              placeholder="友好的名称，如CryptoKitties"
              maxlength="30"
              show-word-limit
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
    return {
      title: "修改合约",
      isVisible: false,
      contract: null,
      model: {
        name: "",
      },
      contractRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 4, max: 30, message: "长度在4到30个字符", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    isVisible: function (newValue) {
      if (newValue) {
        this.model.name = this.contract.name;
      }
    },
  },
  methods: {
    onOk: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.isVisible = false;
          this.contract.name = this.model.name;
          this.$emit("ok", this.contract);
        } else {
          return false;
        }
      });
    },
  },
};
</script>