<script setup lang="ts">
import { faMicrochip, faMemory, faThList, faCubes, faCopy, faHdd, faSitemap } from '@fortawesome/free-solid-svg-icons';

const { endpoint } = defineProps(['endpoint']);
const icon = { faMicrochip, faMemory, faThList, faCubes, faCopy, faHdd, faSitemap };
</script>

<template>
  <v-col :cols="12" :md="6" :xs="12">
    <docker-dashboard-widget
      :icon="icon.faThList"
      :count="endpoint.serviceInfo.StackCount || 0"
      name="Stacks"
      :href="`/endpoints/${endpoint.id}/docker/stacks`"
    />
  </v-col>
  <v-col :cols="12" :md="6" :xs="12">
    <docker-dashboard-widget
      :icon="icon.faCubes"
      :count="endpoint.serviceInfo.Containers || 0"
      name="Containers"
      :href="`/endpoints/${endpoint.id}/docker/containers`"
    />
  </v-col>
  <v-col :cols="12" :md="6" :xs="12">
    <docker-dashboard-widget
      :icon="icon.faCopy"
      :count="endpoint.serviceInfo.Images || 0"
      name="Images"
      :href="`/endpoints/${endpoint.id}/docker/images`"
    />
  </v-col>
  <v-col :cols="12" :md="6" :xs="12">
    <docker-dashboard-widget
      :icon="icon.faHdd"
      :count="endpoint.serviceInfo.VolumeCount || 0"
      name="Volumes"
      :href="`/endpoints/${endpoint.id}/docker/volumes`"
    />
  </v-col>
  <v-col :cols="12" :md="6" :xs="12">
    <!-- <Widget :icon="icon.faSitemap" :count="networks.length" name="Networks" :href="`/${endpointId}/docker/networks`"/> -->
  </v-col>
</template>
