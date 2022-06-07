<template>
  <div>
    <v-progress-circular absolute top indeterminate color="primary" class="space-right" v-if="disableAll"/>
    <div class="btn-group" role="group" aria-label="...">
      <v-btn depressed :disabled="checkDisabled()" color="error" @click="onRemove()">
        <font-awesome-icon :icon="icon.faTrash" class="v-icon v-icon--left"/>
        Remove
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Dockerode from 'dockerode';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import dockerService from '@/services/docker.service';

@Component
export default class DockerNetworksActionMenu extends Vue {
  @Prop() selected!: Dockerode.NetworkInspectInfo[];

  icon = { faTrash };

  disableAll = false;

  buttons = [
    {
      id: 'remove',
      label: 'Remove',
      color: 'error',
      icon: faTrash
    }
  ]

  checkDisabled () {
    if (this.disableAll) return true;
    return this.selected.length === 0;
  }

  async onRemove () {
    const remove = async (networkId: string) => {
      return new Promise<void>((resolve) => {
        dockerService.removeNetwork(this.$route.params.endpointId, networkId).then(() => {
          this.$toast.success(this.t('networks.removed'));
          resolve();
        }).catch((err) => {
          this.$toast.error(err.response.data.message);
          resolve();
        });
      });
    };

    this.disableAll = true;
    let i = 0;
    while (i < this.selected.length) {
      await remove(this.selected[i].Id);
      i++;
    }
    this.disableAll = false;
    this.$emit('onUpdate');
  }
}
</script>
