<script setup lang="ts">
import { useAppStore } from '~/stores/app.store';
import { faTachometerAlt, faMicrochip, faMemory } from '@fortawesome/free-solid-svg-icons';

definePageMeta({
  layout: 'docker',
});
const store = useAppStore();
</script>

<template>
  <v-row v-if="store.selectedEndpoint">
    <v-col :cols="12">
      <docker-dashboard-info :endpoint="store.selectedEndpoint" />
    </v-col>
  </v-row>
  <div>
    <v-row v-if="store.selectedEndpoint">
      <docker-dashboard-widgets :endpoint="store.selectedEndpoint" />
    </v-row>
  </div>
</template>
