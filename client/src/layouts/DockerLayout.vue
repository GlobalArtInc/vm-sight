<template>
  <div class="page-docker">
    <v-container class="main-container">
      <router-view />
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'DockerLayout',
}
</script>

<style lang="sass" scoped>
.page-wrapper
  min-height: calc(100vh - 112px - 48px)
</style>
