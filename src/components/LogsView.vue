<template>
  <div>
    <div style="margin-bottom: 10px">
      <b>Logs</b>
    </div>
    <OutputsView
      v-for="(log, i) in logs"
      :key="i"
      :outputs="log.results"
      :header="'#' + (i + 1) + '-EventName：' + log.eventName"
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

