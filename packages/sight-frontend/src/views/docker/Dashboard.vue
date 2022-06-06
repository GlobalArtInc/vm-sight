<template>
  <v-row>
    <v-col :cols="12" v-if="endpoint.snapshot.Swarm === 'active'">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          {{ t('information') }}
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
                <font-awesome-icon :icon="icon.faMicrochip" class="space-left" />
                {{ endpoint.snapshot.TotalCPU }}
                <font-awesome-icon :icon="icon.faMemory" class="space-left" />
                {{ convert(endpoint.snapshot.TotalMemory) }}
                - {{ endpoint.snapshot.Swarm === 'active' ? "Swarm" : "Standalone" }} {{ endpoint.snapshot.DockerVersion }}
              </td>
            </tr>
            <tr>
              <td style="width: 30%">URL</td>
              <td v-if="endpoint.public_url">{{ endpoint.public_url }}</td>
              <td v-else>none</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <Widget :icon="icon.faThList" :count="endpoint.snapshot.StackCount" name="Stacks" :href="`/${endpointId}/docker/stacks`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <Widget :icon="icon.faCubes" :count="endpoint.snapshot.Containers" name="Containers" :href="`/${endpointId}/docker/containers`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <Widget :icon="icon.faCopy" :count="endpoint.snapshot.ImageCount" name="Images" :href="`/${endpointId}/docker/images`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <Widget :icon="icon.faHdd" :count="endpoint.snapshot.VolumeCount" name="Volumes" :href="`/${endpointId}/docker/volumes`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <Widget :icon="icon.faSitemap" :count="networks.length" name="Networks" :href="`/${endpointId}/docker/networks`"/>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ByteToSize } from '@/utils/math';
import { faMicrochip, faMemory, faThList, faCubes, faCopy, faHdd, faSitemap } from '@fortawesome/free-solid-svg-icons';
import Widget from '@/components/docker/Widget.vue';
// import { Endpoint } from '@sight-types';

@Component({
  components: {
    Widget
  }
})
export default class DockerDashboardView extends Vue {
  endpoint = this.$route.meta?.endpoint;
  networks = this.$route.meta?.networks;

  icon = { faMicrochip, faMemory, faThList, faCubes, faCopy, faHdd, faSitemap };
  @Prop() endpointId?: string;

  convert (number: number) {
    return ByteToSize(number);
  }
}
</script>
