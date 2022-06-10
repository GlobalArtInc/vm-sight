<template>
  <div>
    <v-progress-circular absolute top indeterminate color="primary" class="space-right" v-if="disableAll"/>
    <v-btn depressed color="error" :disabled="disableAll || selected.length === 0" @click="remove">
      <font-awesome-icon :icon="icon.faTrash" class="v-icon v-icon--left"/>
      Remove
    </v-btn>
    <v-btn depressed color="primary" class="space-left">
      <font-awesome-icon :icon="icon.faAdd" class="v-icon v-icon--left"/>
      Create
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { faTrash, faAdd } from '@fortawesome/free-solid-svg-icons';
import Dockerode from 'dockerode';
import dockerService from '@/services/docker.service';

@Component
export default class DockerVolumesActionMenu extends Vue {
  @Prop() selected!: Dockerode.VolumeInspectInfo[];

  disableAll = false;
  icon = { faTrash, faAdd };

  async remove () {
    const remove = async (volumeId: string) => {
      return new Promise<void>((resolve) => {
        dockerService.removeVolumeById(this.$route.params.endpointId, volumeId).then(() => {
          this.$toast.success(this.t('volumes.removed'));
          resolve();
        }).catch((err: any) => {
          this.$toast.error(err.response.data.message);
          resolve();
        });
      });
    };

    this.disableAll = true;

    let i = 0;
    while (i < this.selected.length) {
      await remove(this.selected[i].Name);
      i++;
    }
    this.disableAll = false;
    this.$emit('onUpdate');
  }
}
</script>
