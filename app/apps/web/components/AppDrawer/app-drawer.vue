<script setup lang="ts">
const drawer = ref(true);
const drawerMini = ref(false);
const drawerWidth = ref(256);
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    v-model:mini-variant="drawerMini"
    app
    :width="drawerWidth"
    class="app-drawer"
    style="background: #30426a"
  >
    <app-drawer-toolbar />
    <div class="app-drawer__inner">
      <app-drawer-list-inner />
      <app-drawer-list-management />
      <app-drawer-list-settings />
    </div>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/app-drawer.scss';
</style>
