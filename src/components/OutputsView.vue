<template>
  <div>
    <el-form label-position="left" label-width="140px">
      <el-form-item
        v-for="(output, i) in outputs"
        :key="i"
        :label="'Output#' + (i + 1) + '(' + output.type + '):'"
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
  },
  components: {
    ParameterView,
  },
};
</script>