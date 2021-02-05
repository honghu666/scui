<template>
  <el-input
    v-if="type === 'address'"
    :placeholder="readonly ? '' : '请输入地址，0x...'"
    :readonly="readonly"
    autocomplete="organization"
    v-model="val"
    maxlength="42"
    show-word-limit
    :clearable="true"
  >
  </el-input>
  <el-input
    v-else-if="type.startsWith('uint')"
    :readonly="readonly"
    :placeholder="readonly ? '' : '请输入数字'"
    v-model="val"
    :clearable="true"
  >
    <el-select
      class="unit-select"
      v-model="unit"
      slot="append"
      placeholder="请选择"
      style="width: 108px"
    >
      <el-option label="Wei" value="0"></el-option>
      <el-option label="Kwei(3)" value="3"></el-option>
      <el-option label="Mwei(6)" value="6"></el-option>
      <el-option label="Gwei(9)" value="9"></el-option>
      <el-option label="Szabo(12)" value="12"></el-option>
      <el-option label="Finney(15)" value="15"></el-option>
      <el-option label="Ether(18)" value="18"></el-option>
      <el-option label="Kether(21)" value="21"></el-option>
      <el-option label="Mether(24)" value="24"></el-option>
      <el-option label="Gether(27)" value="27"></el-option>
      <el-option label="Tether(30)" value="30"></el-option>
    </el-select>
  </el-input>
  <div v-else-if="type === 'bool'">
    <el-radio v-model="val" label="false" :disabled="readonly">false</el-radio>
    <el-radio v-model="val" label="true" :disabled="readonly">true</el-radio>
  </div>
  <el-input
    v-else
    :placeholder="readonly ? '' : '请输入参数'"
    v-model="val"
    :readonly="readonly"
    :clearable="true"
  >
  </el-input>
</template>

<script>
import { BigNumber } from "bignumber.js";
BigNumber.set({ DECIMAL_PLACES: 30, ROUNDING_MODE: 4 });

export default {
  props: ["type", "readonly", "value"],
  data: function () {
    return {
      unit: "18",
      val: "",
    };
  },
  methods: {
    updateVal: function () {
      if (this.type.startsWith("uint")) {
        let num = new BigNumber(this.value);
        if (num.isNaN()) {
          this.val = this.value;
        } else {
          let p = parseInt(this.unit);
          this.val = num.dividedBy(new BigNumber(10).pow(p)).toFixed();
        }
      } else {
        this.val = this.value;
      }
    },
  },
  created: function () {
    this.updateVal();
  },
  watch: {
    value: function () {
      this.updateVal();
    },
    val: function (newVal) {
      let value = newVal;
      if (this.type.startsWith("uint")) {
        let num = new BigNumber(newVal);
        if (!num.isNaN()) {
          let p = parseInt(this.unit);
          value = num.multipliedBy(new BigNumber(10).pow(p)).toFixed();
        }
      }
      this.$emit("input", value);
    },
    unit: function (newUnit) {
      let num = new BigNumber(this.value);
      if (num.isNaN()) {
        this.val = "0";
        return;
      }
      let p = parseInt(newUnit);
      this.val = num.dividedBy(new BigNumber(10).pow(p)).toFixed();
    },
  },
};
</script>

<style>
.unit-select input {
  padding: 0;
  text-align: center;
}
</style>