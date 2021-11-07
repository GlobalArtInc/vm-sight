<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-progress-linear indeterminate color="primary" v-if="!isLoading" absolute top/>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-sitemap"></i>
          <span class="font-weight-medium pl-1" style="color: #333" v-text="this.__('menu.networks')"/>
        </v-card-subtitle>
        <v-divider/>
        <v-text-field
            dense
            v-model="search"
            text
            solo
            flat
            prepend-inner-icon="mdi-magnify"
            placeholder="Type something"
            hide-details
            clearable
        />
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-data-table
              v-model="selected"
              :search="search"
              :headers="headers"
              :items="networks"
              :items-per-page="-1"
              class="elevation-1"
              item-key="Id"
              show-select>
            <template #item.Name="{item}">
              <router-link :to="`networks/`+item.Id">
                {{ item.Name }}
                <v-chip color="primary" ripple v-if="item.Name === 'host' || item.Name === 'none' || item.Name === 'bridge'" class="ml-2 font-weight-bold">
                  System
                </v-chip>
              </router-link>
            </template>

            <template #item.Stack>
              <span class="font-weight-bold">-</span>
            </template>

            <template #item.IPv4-Subnet="{item}">
              <template v-if="item.IPAM.Config.length > 0">
                <span :key="ip.Subnet" v-for="ip in item.IPAM.Config">
                  {{ ip.Subnet }}
                </span>
              </template>
              <span v-else class="font-weight-bold">-</span>
            </template>


            <template #item.IPv4-Gateway="{item}">
              <template v-if="item.IPAM.Config.length > 0">
                <span :key="ip.Gateway" v-for="ip in item.IPAM.Config">
                  {{ ip.Gateway }}
                </span>
              </template>
              <span v-else class="font-weight-bold">-</span>
            </template>
            <template #item.IPv6="{item}">
              <span v-if="item.EnableIPv6">

              </span>
              <span v-else class="font-weight-bold">-</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {fetchNetworks} from "@/api/endpoints/networks";

export default {
  props: {
    id: {type: String}
  },
  data: () => ({
    selected: [],
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
    networks: []
  }),
  methods: {
    fetchNetworks() {
      fetchNetworks(this.id).then(data => {
        this.isLoading = true
        this.networks = data
      })
    }
  },
  created() {
    this.$store.dispatch('app/getEndpoint', this.id).then(() => {
      this.fetchNetworks()
    })
  }
}
</script>
