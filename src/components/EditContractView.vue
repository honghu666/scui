<template>
  <div>
    <el-dialog :title.sync="title" :visible.sync="isVisible" width="700px">
      <div>
        <el-form
          :model="model"
          :rules="contractRules"
          ref="form"
          label-width="150px"
        >
          <el-form-item label="Alias name：" prop="name">
            <el-input
              v-model="model.name"
              placeholder="Readable name, like CryptoKitties."
              maxlength="30"
              show-word-limit
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
    return {
      title: "Edit contract",
      isVisible: false,
      contract: null,
      model: {
        name: "",
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

<style scoped>
.footer-button {
  width: 100px;
}
</style>