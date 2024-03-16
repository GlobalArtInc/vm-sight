<template>
  <v-row >
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
          <log-viewer :log="logs" :loading="false"  v-if="isLoaded" />
          <v-progress-linear v-else indeterminate color="primary" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LogViewer from '@femessage/log-viewer';
import dockerService from '@/services/docker.service';

@Component({
  components: {
    LogViewer
  }
})
export default class DockerContainersLogsView extends Vue {
  @Prop() readonly endpointId: string | undefined;
  @Prop() readonly id: string | undefined;

  isLoaded = false

  formModel = {
    autoRefresh: true,
    wrapLines: false,
    timestamps: false,
    since: 0,
    lines: 100
  }

  logs = ''
  interval: NodeJS.Timer | undefined;

  fetch = [
    {
      value: 0,
      text: 'ALL'
    },
    {
      value: 1,
      text: 'Last day'
    },
    {
      value: 2,
      text: 'Last 4 hours'
    },
    {
      value: 3,
      text: 'Last hour'
    },
    {
      value: 4,
      text: 'Last 10 minutes'
    }
  ]

  async getLogs (options: object) {
    const logs = await dockerService.getLogs(this.$route.params.endpointId, this.$route.params.id, options);

    const arr: string[] = [];
    logs.split('\n').forEach((item: string) => {
      arr.push(item.slice(8));
    });
    this.logs = arr.join('\r\n');
  }

  beforeDestroy () {
    clearInterval(this.interval);
  }

  async created () {
    const options = { since: 0, stdout: 1, tail: 100, timestamps: 0 };
    // since=0&stdout=1&tail=100&timestamps=
    await this.getLogs(options);
    this.isLoaded = true;
    this.interval = setInterval(() => {
      if (this.formModel.autoRefresh) {
        options.tail = this.formModel.lines;
        options.timestamps = this.formModel.timestamps ? 1 : 0;
        this.getLogs(options);
      }
    }, 5000);
  }
}
</script>
