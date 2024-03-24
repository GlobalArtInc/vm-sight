<script setup lang="ts">
import { useEndpointStore } from '~/stores/endpoint.store';
import { faListAlt, faCubes, faMicrochip, faMemory } from '@fortawesome/free-solid-svg-icons';
import { EndpointConnectionTypeEnum, type Endpoint } from '~/types/endpoint.types';

const store = useEndpointStore();
await store.fetchEndpoints();

const headers = [
  {
    text: 'endpoint',
  },
];

const icon = {
  faListAlt,
  faCubes,
  faMicrochip,
  faMemory,
};

const endpointLink = (item: Endpoint) => {
  switch (item.connectionType) {
    case EndpointConnectionTypeEnum.REMOTE_DOCKER:
    case EndpointConnectionTypeEnum.LOCAL_DOCKER:
      return `/endpoints/${item.id}/docker/dashboard`;
  }
};
</script>

<template>
  <div class="app-dashboard">
    <v-card>
      <v-card-title class="font-weight-bold">Endpoints</v-card-title>
      <v-data-table
        :items="store.endpoints"
        :headers="headers"
        :items-per-page="10"
        hide-default-header
        class="elevation-0 app-dashboard__endpoints-table noselect"
      >
        <template #body="{ items }">
          <v-list class="app-dashboard__endpoints">
            <template v-for="(item, index) in items" :key="index">
              <v-list-item class="app-dashboard__endpoints-item" :to="endpointLink(item)">
                <template #prepend>
                  <v-list-item-icon>
                    <font-awesome-icon style="font-size: 62px; color: #337ab7" :icon="['fab', 'docker']" />
                  </v-list-item-icon>
                </template>
                <v-list-item-content>
                  <v-list-item-title>
                    <span style="float: left">
                      {{ item.name }}

                      <v-chip v-if="item.isActive" label class="font-weight-black" small color="success">on</v-chip>
                      <v-chip v-else label class="font-weight-black" small color="error">off</v-chip>
                    </span>
                  </v-list-item-title>

                  <v-list-item-subtitle class="text--primary">
                    <span v-if="item.serviceInfo">
                      <span style="padding: 0 7px 0 0">
                        <font-awesome-icon :icon="icon.faListAlt" />
                        {{ item.serviceInfo.ServiceCount || '0' }} services
                      </span>
                      <span>
                        <font-awesome-icon :icon="icon.faCubes" />
                        {{ item.serviceInfo.Containers || '0' }} containers
                      </span>
                    </span>
                    <span v-if="item.serviceInfo" style="float: right; padding-right: 1em">
                      {{ item.serviceInfo.Swarm ? 'Swarm' : 'Standalone' }} {{ item.serviceInfo.DockerVersion }}
                    </span>
                  </v-list-item-subtitle>

                  <v-list-item-subtitle>
                    <span>
                      <span class="small text-muted ng-binding">
                        <font-awesome-icon :icon="icon.faMicrochip" />
                        {{ item.serviceInfo?.NCPU }}
                        <font-awesome-icon class="space-left" :icon="icon.faMemory" />
                        {{ ByteToSize(item.serviceInfo?.MemTotal) }}
                      </span>
                    </span>
                    <span style="float: right; padding-right: 1em">
                      {{ item.connectionInfo?.host }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
            </template>
          </v-list>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/app-dashboard.scss';
</style>
