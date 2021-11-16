<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333">
          <i class="fa fa-cubes"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Log viewer settings</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          <v-switch dense style="margin: 0; padding: 0" v-model="formModel.autoRefresh" label="Auto-refresh Logs" inset
                    :ripple="false"/>
          <v-switch dense style="margin: 0; padding: 0" v-model="formModel.wrapLines" label="Warp Lines" inset
                    :ripple="false"/>
          <v-switch dense style="margin: 0; padding: 0" v-model="formModel.timestamps" label="Display timestamps" inset
                    :ripple="false"/>
          <v-select dense v-model="formModel.since" label="Fetch" style="width: 20%" outlined :items="fetch"/>
          <v-text-field dense v-model="formModel.lines" label="Lines" style="width: 20%" outlined type="number"/>
          <log-viewer :log="logs" :loading="false"/>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import LogViewer from '@femessage/log-viewer'
import {fetchLogsContainer} from "@/api/endpoints/docker";

export default {
  props: {
    id: {type: String},
    hash: {type: String}
  },
  data: () => ({
    formModel: {
      autoRefresh: true,
      wrapLines: false,
      timestamps: false,
      since: 0,
      lines: 100
    },
    logs: "",
    interval: "",
    fetch: [
      {
        value: 0,
        text: "ALL"
      },
      {
        value: 1,
        text: "Last day"
      },
      {
        value: 2,
        text: "Last 4 hours"
      },
      {
        value: 3,
        text: "Last hour"
      },
      {
        value: 4,
        text: "Last 10 minutes"
      }
    ]
  }),
  components: {
    LogViewer
  },
  created() {
    let options = {since: 0, stdout: 1, tail: 100, timestamps: 0};
    // since=0&stdout=1&tail=100&timestamps=
    this.getLogs(options)
    this.interval = setInterval(() => {
      if (this.formModel.autoRefresh !== false) {
        options.tail = this.formModel.lines
        options.timestamps = this.formModel.timestamps === true ? 1 : 0
        this.getLogs(options)
      }
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    cleanString(input) {
      var output = "";
      for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
          output += input.charAt(i);
        }
      }
      return output;
    },
    getLogs(options) {
      fetchLogsContainer(this.id, this.hash, options).then((logs) => {
        const arr = []
        logs.split('\n').forEach((i) => {
          arr.push(i.slice(8))
        })
        this.logs = arr.join('\r\n')
      })
    },
    getTimeStamp() {
      return Math.floor(Date.now() / 1000)
    }
  }
}
</script>
