<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <font-awesome-icon :icon="icon.faHdd"/>
          <span class="font-weight-medium pl-3">
            Volumes
          </span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-data-table
            :items="volumes"
            :headers="headers"
            class="elevation-1"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Dockerode from 'dockerode';
import { faHdd } from '@fortawesome/free-regular-svg-icons';

@Component
export default class DockerVolumesIndexView extends Vue {
  volumes: Dockerode.VolumeInspectInfo[] = [];
  icon = { faHdd };

  headers = [
    {
      text: 'Id',
      align: 'left',
      value: 'Name'
    }
  ];

  created () {
    this.volumes = this.$route.meta?.volumes;
  }
}
</script>
