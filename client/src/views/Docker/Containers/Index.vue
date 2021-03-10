<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333">
          <i class="fa fa-cubes"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Containers</span>
          <v-btn icon class="space-left" color="primary" :loading="loadingItems" @click="fetchContainers">
            <i class="fa fa-sync"></i>
          </v-btn>
        </v-card-subtitle>
        <v-divider/>
        <v-card-subtitle>
          Action Menu
        </v-card-subtitle>
        <v-divider/>
        <v-data-table
            :loading="loadingItems"
            :headers="headers"
            :items="items"
            :items-per-page-options="[15, 30, 50]"
            :items-per-page="itemsPerPage"
            item-key="Id"
            show-select
        >
          <template #item.Name="{item}">
            <span>{{ item.Name }}</span>
          </template>
          <template #item.State="{item}">
            <State :state="item.State" :status="item.Status" />
          </template>
          <template #item.Stack="{item}">
            <span class="font-weight-black" v-if="item.Stack" v-text="item.Stack"/>
            <span class="font-weight-black" v-else>-</span>
          </template>
          <template #item.Created="{item}">
            {{ item.Created | moment("YYYY-MM-DD HH:mm:ss") }}
          </template>
          <template #item.Ports="{item}">
            <template v-if="item.Ports.length > 0">
              <a :key="port.PublicPort" v-for="port in item.Ports" class="space-left"
                 :href="`http://`+removePort(endpoint.URL)+`:`+port.PublicPort"
                 target="_blank">
                <i class="fa fa-external-link-alt" aria-hidden="true"></i>
                {{ port.PublicPort }}:{{ port.PrivatePort }}
              </a>
            </template>
            <span v-else class="font-weight-black">-</span>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {fetchEndpoint} from "@/api/endpoints/api";
import {fetchContainers} from "@/api/endpoints/docker";
import {removePort} from '@/utils/global'
import State from "@/components/docker/State";

export default {
  components: {State},
  props: {
    id: [String, Number]
  },
  data: () => ({
    loadingItems: true,
    items: [],
    endpoint: {},
    headers: [
      {
        text: 'Name',
        value: 'Name'
      },
      {
        text: 'State',
        value: 'State'
      },
      {
        text: 'Quick actions',
        value: 'actions'
      },
      {
        text: 'Stack',
        value: 'Stack'
      },
      {
        text: 'Image',
        value: 'Image'
      },
      {
        text: 'Created',
        value: 'Created'
      },
      {
        text: "Published Ports",
        value: "Ports"
      }
    ],
    itemsPerPage: 10
  }),
  methods: {
    // eslint-disable-next-line no-unused-vars
    getState(state, status){

    },
    removePort(url) {
      return removePort(url)
    },
    fetchContainers() {
      this.loadingItems = true
      fetchContainers(this.id).then((data) => {
        this.loadingItems = false
        this.items = data
      })
    }
  },
  created() {
    fetchEndpoint(this.id).then((endpoint) => {
      this.endpoint = endpoint
      this.fetchContainers()
    }).catch(() => {
      this.$router.push('/')
    })

  }
}
</script>
