<template>
  <div class="page-user__item">
    <v-container class="main-container">
      <v-row>
        <v-col>
          <v-card tile>
            <v-card-subtitle class="font-weight-medium">
              <font-awesome-icon :icon="icon.faHdd" />
              <span class="space-left">New Volume</span>
            </v-card-subtitle>
            <v-divider />
            <v-card-text>
              <p class="font-weight-medium">
                Volume details
                <v-divider />
              </p>
              <v-text-field filled label="Name" v-model="formModel.Name" />
              <p class="font-weight-medium">
                Driver options
                <v-spacer />
                <v-btn depressed color="primary" @click="DriverOpts.push({remote: null, local: null})">
                  <font-awesome-icon :icon="icon.faAdd" />
                  Add Driver
                </v-btn>
              </p>
              <template v-for="(item, key) of DriverOpts">
                <v-row :key="key">
                  <v-col :cols="6">
                    <v-text-field filled dense label="Name" v-model="item.remote" />
                  </v-col>
                  <v-col :cols="6">
                    <v-text-field filled dense label="Value" v-model="item.local" />
                  </v-col>
                </v-row>
              </template>
              <v-divider />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="onCreate">
                <font-awesome-icon :icon="icon.faAdd" />
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { faHdd, faAdd } from '@fortawesome/free-solid-svg-icons';
import { VolumeDriverOpts, VolumesFormCreate } from '@/interfaces/docker.interface';
import dockerService from '@/services/docker.service';
// import Dockerode from 'dockerode';

@Component
export default class DockerVolumesCreateView extends Vue {
  icon = { faHdd, faAdd };

  DriverOpts: VolumeDriverOpts[] = [];

  formModel: VolumesFormCreate = {
    Name: null,
    Driver: 'local',
    Labels: {},
    DriverOpts: {}
  }

  async onCreate () {
    // this.formModel.DriverOpts = [];
    // for (const item of this.DriverOpts) {
    //   // const path = `${item.remote}:${item.local}`;
    //   this.formModel.DriverOpts[item.remote] = item.local;
    // }
    // this.formModel.Labels = Object.assign({}, this.formModel.Labels);
    // this.formModel.DriverOpts = Object.assign({}, this.formModel.DriverOpts);
    // console.log(this.formModel);
    try {
      await dockerService.createVolume(this.$route.params.endpointId, this.formModel);
      return this.$toast.success('volumes.created');
    } catch (err: any) {
      this.$toast.error(err.response.data.message ?? 'An error occurred');
    }
  }
}
</script>
