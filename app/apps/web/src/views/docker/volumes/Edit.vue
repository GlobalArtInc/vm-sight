<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <font-awesome-icon :icon="icon.faHdd" />
          <span class="font-weight-medium pl-1" style="color: #333" v-text="t('volumes.details')"/>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-simple-table dense class="font-weight-medium">
            <tbody>
            <tr>
              <td>ID</td>
              <td>{{ volume.Name }}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{{ volume.CreatedAt | moment("YYYY-MM-DD HH:mm:ss") }}</td>
            </tr>
            <tr>
              <td>Mount path</td>
              <td>{{ volume.Mountpoint }}</td>
            </tr>
            <tr>
              <td>Driver</td>
              <td>{{ volume.Driver }}</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { faHdd } from '@fortawesome/free-solid-svg-icons';
import { VolumeCreateResponse } from 'dockerode';

@Component
export default class DockerVolumesEditView extends Vue {
  volume: VolumeCreateResponse | null = null;
  icon = { faHdd };

  created () {
    this.volume = this.$route.meta?.volume;
  }
}
</script>
