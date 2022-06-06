<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <font-awesome-icon :icon="icon.faCubes"/>
          <span class="font-weight-medium pl-1" style="color: #333">Containers</span>
          <v-btn icon class="space-left" color="primary" :loading="loading" @click="reloadContainers">
            <font-awesome-icon :icon="icon.faSync"/>
          </v-btn>
        </v-card-subtitle>
        <v-divider/>
        <v-card-subtitle>
          <ContainerActionMenu :selected="selected" @onUpdate="reloadContainers(true)"/>
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
          :loading="loading"
          :headers="headers"
          :items="items"
          :items-per-page-options="[15, 30, 50]"
          :items-per-page="itemsPerPage"
          item-key="Id"
          show-select>

          <template #item.Name="{item}">
            <router-link :to="`containers/${item.Id}`">{{ item.Name }}</router-link>
          </template>

          <template #item.Actions="{item}">
            <div>
              <router-link style="color: #337ab7" :to="`containers/${item.Id}/logs`">
                <i class="space-right">
                  <font-awesome-icon :icon="icon.faFileAlt"/>
                </i>
              </router-link>
              <router-link style="color: #337ab7" class="space-left" :to="`containers/${item.Id}/exec`">
                <i class="space-right">
                  <font-awesome-icon :icon="icon.faTerminal"/>
                </i>
              </router-link>
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
                 :href="`${endpoint.public_url}:${port.PublicPort}`"
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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { faCubes, faSync, faFileAlt, faTerminal } from '@fortawesome/free-solid-svg-icons';
import State from '@/components/docker/State.vue';
import dockerService from '@/services/docker.service';
import ContainerActionMenu from '@/components/docker/action-menu/ContainerActionMenu.vue';

@Component({
  components: {
    ContainerActionMenu,
    State
  }
})
export default class DockerContainersIndex extends Vue {
  endpoint = this.$route.meta?.endpoint;
  items = this.$route.meta?.containers;
  icon = { faCubes, faSync, faFileAlt, faTerminal };
  loading = false;
  search = '';
  selected = [];
  headers = [
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
      value: 'Actions',
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
      text: 'Published Ports',
      value: 'Ports'
    }
  ];

  itemsPerPage = 10;

  reloadContainers (swapSelect = false) {
    if (swapSelect) {
      this.selected = [];
    }
    this.loading = true;
    dockerService.getContainers(this.$route.params.endpointId).then((endpoints) => {
      this.items = endpoints;
    }).finally(() => {
      this.loading = false;
    });
  }
}
</script>
