<script setup lang="ts">
import { faServer, faDatabase, faCubes } from '@fortawesome/free-solid-svg-icons';

const items = [
  {
    title: 'Users',
    iconType: 'mdi',
    icon: 'mdi-account-group',
    to: '/users',
  },
  {
    title: 'Endpoints',
    iconType: 'fa',
    icon: faServer,
    to: '/endpoints',
  },
  {
    title: 'Registries',
    iconType: 'fa',
    icon: faDatabase,
    to: '/registries',
  },
];
</script>

<template>
  <v-list class="pa-0">
    <v-list-subheader style="color: #fff">SETTINGS</v-list-subheader>
    <v-list-item v-for="(item, key) of items" :key="key" :to="item.to">
      <template #prepend>
        <v-icon>
          <template v-if="item.iconType === 'mdi'">
            {{ item.icon }}
          </template>
          <font-awesome-icon
            v-else-if="item.iconType === 'fa'"
            class="v-icon notranslate"
            :icon="item.icon"
          ></font-awesome-icon>
        </v-icon>
      </template>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
