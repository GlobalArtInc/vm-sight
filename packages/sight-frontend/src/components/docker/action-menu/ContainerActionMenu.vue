<template>
  <div class="btn-group" role="group" aria-label="...">
    <v-progress-circular absolute top indeterminate color="primary" class="space-right" v-if="disableAll" />
    <v-btn :key="item.id" v-for="item of buttons" depressed :disabled="checkDisabled(item.id)" :color="item.color" tile @click="exec(item.id)">
      <font-awesome-icon :icon="item.icon" class="v-icon v-icon--left" />
      {{ item.label }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { faPlay, faStop, faBomb, faSync, faPause, faTrash } from '@fortawesome/free-solid-svg-icons';
import dockerService from '@/services/docker.service';
import { ContainerInspectInfo } from 'dockerode';

@Component({
  data () {
    return {
      buttons: [
        {
          id: 'start',
          label: 'Start',
          color: 'success',
          icon: faPlay
        },
        {
          id: 'stop',
          label: 'Stop',
          color: 'error',
          icon: faStop
        },
        {
          id: 'kill',
          label: 'Kill',
          color: 'error',
          icon: faBomb
        },
        {
          id: 'restart',
          label: 'Restart',
          color: 'primary',
          icon: faSync
        },
        {
          id: 'pause',
          label: 'Pause',
          color: 'primary',
          icon: faPause
        },
        {
          id: 'resume',
          label: 'Resume',
          color: 'primary',
          icon: faPlay
        },
        {
          id: 'remove',
          label: 'Remove',
          color: 'error',
          icon: faTrash
        }
      ]
    };
  }
})
export default class ContainerActionMenu extends Vue {
  disableAll = false;
  @Prop() selected!: ContainerInspectInfo[]

  async execAction (action: string, containerId: string) {
    return new Promise<void>((resolve) => {
      dockerService.execContainerAction(action, this.$route.params.endpointId, containerId).then(() => {
        this.$toast.success(this.t('containers.' + action));
        resolve();
      }).catch((err) => {
        this.$toast.error(err.response.data.message);
        resolve();
      });
    });
  }

  async exec (action: string) {
    this.disableAll = true;
    let i = 0;
    while (i < this.selected.length) {
      await this.execAction(action, this.selected[i].Id);
      i++;
    }
    this.disableAll = false;
    this.$emit('onUpdate');
  }

  checkDisabled (action: string) {
    if (this.disableAll) return true;
    if (this.selected.length > 1) return false;
    const item: ContainerInspectInfo = this.selected[0];
    if (!item) return true;
    const state: string = item.State.Status ?? item.State ?? false;
    if (!state) return true;
    switch (action) {
      case 'start':
        return state === 'running';
      case 'stop':
        return state !== 'running';
      case 'kill':
        return state !== 'running';
      case 'pause':
        return state === 'paused' || state !== 'running';
      case 'resume':
        return state !== 'paused';
      case 'remove':
        return false;
    }
    return true;
  }
}
</script>
