<template>
  <div class="btn-group" role="group" aria-label="...">
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
  @Prop() selected!: any[]

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
    const item: any = this.selected[0];
    if (!item) return true;
    switch (action) {
      case 'start':
        return item.State === 'running';
      case 'stop':
        return item.State !== 'running';
      case 'kill':
        return item.State !== 'running';
      case 'pause':
        return item.State === 'paused' || item.State !== 'running';
      case 'resume':
        return item.State !== 'paused';
      case 'remove':
        return false;
    }
    return true;
  }
}
</script>
