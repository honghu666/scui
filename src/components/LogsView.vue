<template>
  <div>
    <div style="margin-bottom: 10px">
      <b>{{ $t("m.logs") }}</b>
    </div>
    <OutputsView
      v-for="(log, i) in logs"
      :key="i"
      :outputs="log.results"
      :header="'#' + (i + 1) + ': ' + log.eventName + '(event)'"
    ></OutputsView>
  </div>
</template>
<script>
import OutputsView from "./OutputsView";

export default {
  components: {
    OutputsView,
  },
  props: {
    logs: {
      type: Array,
      default: () => [
        {
          eventName: "",
          results: [
            {
              name: "",
              type: "",
              value: "",
            },
          ],
        },
      ],
    },
  },
};
</script>

