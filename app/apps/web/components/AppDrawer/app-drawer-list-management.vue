<script setup lang="ts">
import { useAppStore } from '~/stores/app.store';
import { EndpointConnectionTypeEnum } from '~/types/endpoint.types';
import { faDashboard, faCubes, faCopy, faSitemap } from '@fortawesome/free-solid-svg-icons';

const store = useAppStore();

const icon = { faDashboard, faCubes, faCopy, faSitemap };
</script>

<template>
  <v-list v-if="store.selectedEndpoint" style="color: #fff">
    <v-list-subheader style="color: #fff">{{ store.selectedEndpoint.name }}</v-list-subheader>
    <template
      v-if="
        [EndpointConnectionTypeEnum.LOCAL_DOCKER, EndpointConnectionTypeEnum.REMOTE_DOCKER].includes(
          store.selectedEndpoint.connectionType
        )
      "
    >
      <v-list-item :to="`/endpoints/${store.selectedEndpoint.id}/docker/dashboard`">
        <template #prepend>
          <v-icon>mdi-view-dashboard</v-icon>
        </template>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="`/endpoints/${store.selectedEndpoint.id}/docker/containers`">
        <template #prepend>
          <v-icon>
            <font-awesome-icon class="v-icon" :icon="icon.faCubes" />
          </v-icon>
        </template>
        <v-list-item-content>
          <v-list-item-title>Containers</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="`/endpoints/${store.selectedEndpoint.id}/docker/images`">
        <template #prepend>
          <v-icon>
            <font-awesome-icon class="v-icon" :icon="icon.faCopy" />
          </v-icon>
        </template>
        <v-list-item-content>
          <v-list-item-title>Images</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="`/endpoints/${store.selectedEndpoint.id}/docker/networks`">
        <template #prepend>
          <v-icon>
            <font-awesome-icon class="v-icon" :icon="icon.faSitemap" />
          </v-icon>
        </template>
        <v-list-item-content>
          <v-list-item-title>Networks</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>
