<template>
  <v-progress-linear indeterminate absolute top v-if="!isLoading"/>
  <v-row v-else>
    <v-col :cols="12" v-if="endpoint && endpoint.Snapshot.Swarm">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          {{ __('information') }}
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          VM-SIGHT is connected to a node that is part of a Swarm cluster. Some resources located on other nodes in the
          cluster might not be available for management.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle style="background: #f6f6f6">
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
    <v-col :cols="12" :md="6" :xs="12" v-if="endpoint">
      <Widget icon="fa fa-th-list" :count="endpoint.Snapshot.StackCount" name="Stacks" :href="`/${id}/docker/stacks`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12" v-if="endpoint && endpoint.Snapshot.Swarm">
      <Widget v-if="endpoint.Snapshot.Swarm" icon="fa fa-list-alt"
              :count="endpoint.Snapshot.ServiceCount ? endpoint.Snapshot.ServiceCount : 0" name="Services"
              :href="`/${id}/docker/services`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12" v-if="endpoint">
      <Widget icon="fa fa-cubes" :count="endpoint.Snapshot.Containers" name="Containers"
              :href="`/${id}/docker/containers`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12" v-if="endpoint">
      <Widget icon="fa fa-clone" :count="endpoint.Snapshot.ImageCount" name="Images" :href="`/${id}/docker/images`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12" v-if="endpoint">
      <Widget icon="fa fa-hdd" :count="endpoint.Snapshot.VolumeCount" name="Volumes" :href="`/${id}/docker/volumes`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12" v-if="endpoint">
      <Widget icon="fa fa-sitemap" :count="Networks.length" name="Networks" :href="`/${id}/docker/networks`"/>
    </v-col>
  </v-row>
</template>

<script>
import {fetchNetworks} from "@/api/endpoints/networks";
import {ByteToSize} from "@/utils/math";
import Widget from "@/components/docker/Widget";
import {mapGetters} from "vuex";

export default {
  components: {Widget},
  props: {
    id: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['endpoint'])
  },
  data: () => ({
    isLoading: false,
    Networks: []
  }),
  methods: {
    convert(number) {
      return ByteToSize(number)
    }
  },
  created() {
    fetchNetworks(this.id).then((networks) => {
      this.Networks = networks
      this.isLoading = true
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
