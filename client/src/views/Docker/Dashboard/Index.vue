<template>
  <div>
    <v-row>
      <v-col :cols="12">
        <v-card>
          <v-card-subtitle class="font-weight-medium" style="color: #333">
            {{ __('information') }}
          </v-card-subtitle>
          <v-divider/>
          <v-card-text>
            dev
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="12">
        <v-card>
          <v-card-subtitle>
            <i class="fa fa-tachometer-alt"></i>
            <span class="font-weight-medium pl-1" style="color: #333">Info</span>
          </v-card-subtitle>
          <v-divider/>
          <v-card-text style="padding: 0">
            <v-simple-table dense class="font-weight-medium" v-if="endpoint">
              <tbody>
              <tr>
                <td style="width: 30%">Endpoint</td>
                <td>
                  {{ endpoint.Name }}
                  <i class="fa fa-microchip space-left"></i>
                  {{ endpoint.Snapshot.TotalCPU }}
                  <i class="fa fa-memory space-left"></i>
                  {{ convert(endpoint.Snapshot.TotalMemory) }}
                  - {{ endpoint.Snapshot.Swarm ? "Swarm" : "Standalone" }} {{ endpoint.Snapshot.DockerVersion }}
                </td>
              </tr>
              <tr>
                <td style="width: 30%">URL</td>
                <td>{{ endpoint.URL }}</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6" v-if="endpoint">
        <Widget icon="fa fa-th-list" :count="endpoint.Snapshot.StackCount" name="Stacks" :href="`${id}/docker/stacks`" />
      </v-col>
      <v-col :cols="6" v-if="endpoint">
        <Widget v-if="endpoint.Snapshot.Swarm" icon="fa fa-list-alt" :count="endpoint.Snapshot.ServiceCount ? endpoint.Snapshot.ServiceCount : 0" name="Services" :href="`${id}/docker/services`" />
      </v-col>
      <v-col :cols="6" v-if="endpoint">
        <Widget icon="fa fa-cubes" :count="endpoint.Snapshot.Containers" name="Containers" :href="`${id}/docker/containers`" />
      </v-col>
      <v-col :cols="6" v-if="endpoint">
        <Widget icon="fa fa-clone" :count="endpoint.Snapshot.ImageCount" name="Images" :href="`${id}/docker/images`" />
      </v-col>
      <v-col :cols="6" v-if="endpoint">
        <Widget icon="fa fa-hdd" :count="endpoint.Snapshot.VolumeCount" name="Volumes" :href="`${id}/docker/volumes`" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {BiteToGb} from "@/utils/math";
import {fetchEndpoint} from '@/api/endpoints/api'
import Widget from "@/components/docker/Widget";

export default {
  components: {Widget},
  props: {
    id: {
      type: String
    }
  },
  data: () => ({
    endpoint: false
  }),
  methods: {
    convert(number) {
      return BiteToGb(number)
    }
  },
  created() {
    fetchEndpoint(this.id).then((data) => {
      console.log(data)
      this.endpoint = data
    })
  }
}
</script>

<style lang="scss">
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
