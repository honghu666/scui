<template>
  <div>
    <el-form label-position="left" label-width="180px">
      <div style="margin-bottom: 10px" v-if="outputs.length > 0">
        <b>{{ header }}</b>
      </div>
      <el-form-item
        class="output-form-item"
        v-for="(output, i) in outputs"
        :key="i"
        :label="
          (output.name ? output.name : 'o' + (i + 1)) + '(' + output.type + ')'
        "
      >
        <ParameterView
          :type="output.type"
          v-model="output.value"
          :readonly="true"
        ></ParameterView>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ParameterView from "./ParameterView";

export default {
  props: {
    outputs: {
      type: Array,
      default: () => [],
    },
    header: {
      type: String,
      default: "Outputs",
    },
  },
  components: {
    ParameterView,
  },
};
</script>
<style scoped>
.output-form-item {
  margin-bottom: 10px;
}
</style>