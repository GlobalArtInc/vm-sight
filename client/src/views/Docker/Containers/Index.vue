<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-cubes"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Containers</span>
          <v-btn icon class="space-left" color="primary" :loading="loadingItems" @click="fetchContainers">
            <i class="fa fa-sync"></i>
          </v-btn>
        </v-card-subtitle>
        <v-divider/>
        <v-card-subtitle>
          <ActionMenu :selected="selected" @update="onUpdate" />
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
        <v-data-table
            v-model="selected"
            :search="search"
            :loading="loadingItems"
            :headers="headers"
            :items="items"
            :items-per-page-options="[15, 30, 50]"
            :items-per-page="itemsPerPage"
            item-key="Id"
            show-select>
          <template #item.Name="{item}">
            <router-link :to="`containers/${item.Id}`">{{ item.Name }}</router-link>
          </template>
          <template #item.actions="{item}">
            <div>
              <router-link style="color: #337ab7" :to="`containers/${item.Id}/logs`"><i class="fa fa-file-alt space-right" /></router-link>
              <router-link style="color: #337ab7" class="space-left" :to="`containers/${item.Id}/exec`"><i class="fa fa-terminal space-right" /></router-link>
            </div>
          </template>
          <template #item.State="{item}">
            <State :state="item.State"/>
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
              <a :key="i" v-for="(port, i) in item.Ports" class="space-left"
                 :href="`${endpoint.PublicURL}:${port.PublicPort}`"
                 target="_blank">
                <template v-if="port.PublicPort">
                  <i class="fa fa-external-link-alt" aria-hidden="true"></i>
                  {{ port.PublicPort }}:{{ port.PrivatePort }}
                </template>
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
import {fetchContainers} from "@/api/endpoints/docker";
import {removePort} from '@/utils/global'
import State from "@/components/docker/State";
import ActionMenu from "@/components/docker/ActionMenu";

export default {
  components: {ActionMenu, State},
  props: {
    id: [String, Number]
  },
  data: () => ({
    loadingItems: true,
    items: [],
    selected: [],
    search: "",
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
        value: 'actions',
        sortable: false
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
    onUpdate() {
      this.selected = []
      this.fetchContainers()
    },
    // eslint-disable-next-line no-unused-vars
    getState(state, status) {

    },
    removePort(url) {
      return removePort(url)
    },
    fetchContainers() {
      this.loadingItems = true
      fetchContainers(this.id).then((data) => {
        this.loadingItems = false
        this.items = data.reverse()
      })
    }
  },
  created() {

    this.$store.dispatch('app/getEndpoint', this.id).then((data) => {
      this.endpoint = data
      this.fetchContainers()
    }).catch(() => {
      this.$router.push('/')
    })

  }
}
</script>
