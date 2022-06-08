<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-sitemap"></i>
          <span class="font-weight-medium pl-1" style="color: #333" v-text="this.t('networks.details')"/>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-simple-table dense class="font-weight-medium">
            <tbody>
            <tr>
              <td>Name</td>
              <td>{{ network.Name }}</td>
            </tr>
            <tr>
              <td>ID</td>
              <td>{{ network.Id }}</td>
            </tr>
            <tr>
              <td>Driver</td>
              <td>{{ network.Driver }}</td>
            </tr>
            <tr>
              <td>Scope</td>
              <td>{{ network.Scope }}</td>
            </tr>
            <tr>
              <td>Attachable</td>
              <td>{{ network.Attachable }}</td>
            </tr>
            <tr>
              <td>Internal</td>
              <td>{{ network.Internal }}</td>
            </tr>
            <tr v-if="network.IPAM.Config.length > 0">
              <td>
                IPV4 Subnet - {{ network.IPAM.Config[0].Subnet }}
              </td>
              <td>IPV4 Gateway - {{ network.IPAM.Config[0].Gateway }}</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="12" v-if="network && Object.keys(network.Options).length > 0">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-cogs"></i>
          <span class="font-weight-medium pl-1" style="color: #333" v-text="this.t('networks.options')"/>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-simple-table dense class="font-weight-medium">
            <tbody>
            <tr :key="key" v-for="(item, key) in network.Options">
              <td>{{ key }}</td>
              <td>{{ item }}</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="12" v-if="network && Object.keys(network.Containers).length > 0">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-cogs"></i>
          <span class="font-weight-medium pl-1" style="color: #333" v-text="this.t('networks.containers')"/>
        </v-card-subtitle>
        <v-card-text style="padding: 0">
          <v-simple-table dense class="font-weight-medium">
            <tbody>
            <tr>
              <th>Name</th>
              <th>IPv4</th>
              <th>IPv6</th>
              <th>MAC</th>
              <th>Actions</th>
            </tr>
            <tr :key="key" v-for="(item, key) in network.Containers">
              <td>{{ item.Name }}</td>
              <td>{{ item.IPv4Address }}</td>
              <td>{{ item.IPv6Address }}</td>
              <td>{{ item.MacAddress }}</td>
              <td>
                <v-btn @click="disconnectNetwork(key)" large icon color="error">
                  <v-icon class="space-right">fa-trash</v-icon>
                </v-btn>
              </td>
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
import Dockerode from 'dockerode';
import dockerService from '@/services/docker.service';

@Component
export default class DockerNetworksEditView extends Vue {
  network: Dockerode.NetworkInspectInfo = {
    Name: '',
    Id: '',
    Created: '',
    Scope: '',
    Driver: '',
    EnableIPv6: false,
    Internal: false,
    Attachable: false,
    Ingress: false,
    ConfigOnly: false
  };

  disconnectNetwork (containerId: string) {
    dockerService.disconnectNetwork(this.$route.params.endpointId, this.$route.params.id, containerId).then(() => {
      this.fetchNetwork();
      this.$toast.success(this.t('networks.disconnected'));
    }).catch((err) => {
      this.$toast.error(err.response.data.message);
    });
  }

  async fetchNetwork () {
    try {
      this.network = await dockerService.getNetworkById(this.$route.params.endpointId, this.$route.params.id);
    } catch (err) {

    }
  }

  created () {
    this.network = this.$route.meta?.network;
  }
}
</script>
