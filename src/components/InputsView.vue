<template>
  <div>
    <el-form
      ref="form"
      label-position="left"
      label-width="180px"
      :model="model"
    >
      <div style="margin-bottom: 10px" v-if="model.parameters.length > 0">
        <b>{{ header }}</b>
      </div>
      <el-form-item
        class="input-form-item"
        v-for="(input, i) in model.parameters"
        :key="i"
        :prop="'parameters.' + i + '.value'"
        :rules="input.rules"
        :label="
          (input.name ? input.name : 'p' + (i + 1)) + '(' + input.type + ')'
        "
      >
        <ParameterView :type="input.type" v-model="input.value"></ParameterView>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      style="width: 100%; max-width: 200px"
      v-on:click="onSubmit"
      >{{ buttonText }}</el-button
    >
  </div>
</template>
<script>
import ParameterView from "./ParameterView";
import { BigNumber } from "bignumber.js";
BigNumber.set({ DECIMAL_PLACES: 30, ROUNDING_MODE: 4 });

export default {
  props: {
    inputs: {
      type: Array,
      default: () => [],
    },
    labelWidth: {
      type: String,
      default: "120px",
    },
    buttonText: {
      type: String,
      default: "Submit",
    },
    header: {
      type: String,
      default: "Inputs",
    },
  },
  components: {
    ParameterView,
  },
  data: function () {
    return {
      model: {
        parameters: [],
      },
    };
  },
  methods: {
    //验证参数
    checkParameters: function (rule, value, callback) {
      let input = rule.input;
      if (value === null || value === undefined || value === "") {
        callback(this.$t("m.required", [""]));
        return;
      }
      //地址类型
      if (input.type === "address") {
        if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t("m.contractAddressVerify")));
        }
        //数字类型
      } else if (input.type.indexOf("int") != -1) {
        let num = new BigNumber(value);
        if (!num.isNaN()) {
          if (input.type.startsWith("uint") && num.isNegative()) {
            callback(this.$t("m.mustUint"));
            return;
          }
          callback();
        } else {
          callback(new Error(this.$t("m.invalidNumber")));
        }
        //bool类型
      } else if (input.type === "bool") {
        if (value === "true" || value === "fasle") {
          callback();
        } else {
          callback(new Error(this.$("m.invalidBool")));
        }
        //bytes类型
      } else if (input.type.startsWith("bytes")) {
        let length = parseInt(input.type.replace("bytes", "")) * 2;
        let re = new RegExp("^0x[a-fA-F0-9]{" + length + "}$");
        if (re.test(value)) {
          callback();
        } else {
          callback(
            new Error(
              this.$t("m.bytesVerify", { type: input.type, length: length + 2 })
            )
          );
        }
      } else {
        callback();
      }
    },
    onSubmit: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$emit("submit");
        } else {
          return false;
        }
      });
    },
    refresh: function () {
      for (let i in this.inputs) {
        let input = this.inputs[i];
        input.rules = [
          {
            input: input,
            validator: this.checkParameters,
            trigger: "blur",
          },
        ];
      }
      this.model.parameters = this.inputs;
    },
  },
  watch: {
    inputs: function () {
      this.refresh();
    },
  },
  created: function () {
    this.refresh();
  },
};
</script>