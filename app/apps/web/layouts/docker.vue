<script setup lang="ts">
import AppDrawer from '~/components/AppDrawer/app-drawer.vue';
import AppToolbar from '~/components/AppTopbar/app-toolbar.vue';
import { useAppStore } from '~/stores/app.store';

const route = useRoute();
const store = useAppStore();
onMounted(async () => {
  await store.fetchEndpoint(route.params.id as string);
});
</script>

<template>
  <v-app class="app">
    <app-drawer ref="drawer" class="app--drawer" />
    <app-toolbar class="app--toolbar" />
    <v-main style="background: #f3f3f3">
      <div class="page-wrapper">
        <v-container>
          <slot />
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/default.scss';
</style>
