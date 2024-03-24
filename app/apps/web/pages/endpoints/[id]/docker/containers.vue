<script setup lang="ts">
import { faCubes, faSync } from '@fortawesome/free-solid-svg-icons';
definePageMeta({
  layout: 'docker',
});

const { id } = useRoute().params;
const icon = { faCubes, faSync };

const containers = await $fetch(`/api/protected/endpoint/${id}/exec`, {
  method: 'POST',
  body: {
    func: 'containers',
    action: 'list',
  },
});

const headers = [
  {
    text: 'Name',
    value: 'Name',
  },
  {
    text: 'State',
    value: 'State',
  },
  {
    text: 'Quick actions',
    value: 'Actions',
    sortable: false,
  },
  {
    text: 'Stack',
    value: 'Stack',
  },
  {
    text: 'Image',
    value: 'Image',
  },
  {
    text: 'Created',
    value: 'Created',
  },
  {
    text: 'Published Ports',
    value: 'Ports',
  },
];
const itemsPerPage = 10;

const search = reactive({
  value: '',
});
</script>

<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-title class="font-weight-medium" style="color: #333; background: #f6f6f6">
          <font-awesome-icon :icon="icon.faCubes" />
          <span class="font-weight-medium pl-1" style="color: #333">Containers</span>
          <v-btn variant="text" icon class="space-left" color="primary" density="compact">
            <font-awesome-icon :icon="icon.faSync" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-subtitle>
          <ContainerActionMenu />
        </v-card-subtitle>
        <v-divider />
        <v-text-field
          v-model="search.value"
          dense
          text
          solo
          flat
          prepend-inner-icon="mdi-magnify"
          placeholder="Type something"
          hide-details
          clearable
        />
        <v-divider />
        <v-data-table
          :headers="headers"
          :items="containers"
          :search="search.value"
          :items-per-page-options="[15, 30, 50]"
          :items-per-page="itemsPerPage"
          item-key="Id"
          show-select
        >
          <template #item.Name="{ item }">
            <NuxtLink :to="`containers/${item.Id}`">{{ item.Names[0] }}</NuxtLink>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>
