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
        <v-card-subtitle>
          <VolumesActionMenu
            :selected="selected"
            @onUpdate="fetchVolumes" />
        </v-card-subtitle>
        <v-divider />
        <v-card-text style="padding: 0">
          <v-data-table
            v-model="selected"
            :items="volumes"
            :headers="headers"
            class="elevation-1"
            item-key="Name"
            show-select>
            <template #item.Name="{item}">
              <div>
                <router-link :to="{name: 'volumesView', params: {id: item.Name}}" v-text="item.Name" />
                <template v-if="item.Labels !== null">
                  <v-chip color="red" label outlined class="space-left">
                    Unused
                  </v-chip>
                </template>
              </div>
            </template>
            <template #item.CreatedAt="{item}">
              {{ item.CreatedAt | moment("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Dockerode from 'dockerode';
import { faHdd } from '@fortawesome/free-regular-svg-icons';
import VolumesActionMenu from '@/components/docker/action-menu/VolumesActionMenu.vue';
import dockerService from '@/services/docker.service';

@Component({
  components: { VolumesActionMenu }
})
export default class DockerVolumesIndexView extends Vue {
  volumes: Dockerode.VolumeInspectInfo[] = [];
  selected: Dockerode.VolumeInspectInfo[] = [];

  icon = { faHdd };

  headers = [
    {
      text: 'Id',
      align: 'left',
      value: 'Name'
    },
    {
      text: 'Driver',
      align: 'left',
      value: 'Driver'
    },
    {
      text: 'Mount Point',
      align: 'left',
      value: 'Mountpoint'
    },
    {
      text: 'Created',
      align: 'left',
      value: 'CreatedAt'
    }
  ];

  async fetchVolumes () {
    this.volumes = await dockerService.getVolumes(this.$route.params.endpointId);
    this.selected = [];
    this.sortVolumes();
  }

  sortVolumes () {
    this.volumes.sort((a: any, b: any) => {
      return new Date(b.CreatedAt).valueOf() - new Date(a.CreatedAt).valueOf();
    });
  }

  created () {
    this.volumes = this.$route.meta?.volumes;
    this.sortVolumes();
  }
}
</script>
