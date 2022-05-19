<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-progress-linear indeterminate color="primary" v-if="!isLoading" absolute top/>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-sitemap"></i>
          <span class="font-weight-medium pl-1" style="color: #333" v-text="this.__('networks.details')"/>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-simple-table dense class="font-weight-medium" v-if="network">
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
        <v-progress-linear indeterminate color="primary" v-if="!isLoading" absolute top/>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-cogs"></i>
          <span class="font-weight-medium pl-1" style="color: #333" v-text="this.__('networks.options')"/>
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
        <v-progress-linear indeterminate color="primary" v-if="!isLoading" absolute top/>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-cogs"></i>
          <span class="font-weight-medium pl-1" style="color: #333" v-text="this.__('networks.containers')"/>
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

<script>
import {fetchNetwork, disconnectNetwork} from "@/api/endpoints/networks";

export default {
  props: {
    id: {type: String},
    hash: {type: String}
  },
  data: () => ({
    isLoading: false,
    search: "",
    headers: [
      {
        text: 'Name',
        value: 'Name'
      },
      {
        text: 'Stack',
        value: 'Stack'
      },
      {
        text: 'Driver',
        value: 'Driver'
      },
      {
        text: 'Attachable',
        value: 'Attachable'
      },
      {
        text: 'IPAM',
        value: 'IPAM.Driver'
      },
      {
        text: 'IPv4 Subnet',
        value: 'IPv4-Subnet'
      },
      {
        text: 'IPv4 Gateway',
        value: 'IPv4-Gateway'
      },
      {
        text: 'IPv6',
        value: 'IPv6'
      }
    ],
    network: false
  }),
  methods: {
    disconnectNetwork(container) {
      disconnectNetwork(this.id, this.hash, container).then(() => {
        this.fetchNetwork()
        this.$toast(this.__('networks.disconnected'), {
          type: 'success'
        });
      })
    },
    fetchNetwork() {
      fetchNetwork(this.id, this.hash).then(data => {
        this.isLoading = true
        this.network = data
      })
    }
  },
  created() {
    this.fetchNetwork()
  }
}
</script>
