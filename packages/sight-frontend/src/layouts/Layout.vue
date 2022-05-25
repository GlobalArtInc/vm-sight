<template>
  <v-app class="app">
    <app-drawer class="app--drawer" ref="drawer" />
    <app-toolbar class="app--toolbar" @side-icon-click="handleDrawerVisiable" />
    <v-main style="background: #f3f3f3">
      <!-- Page Wrapper -->
      <div class="page-wrapper"><router-view /></div>
      <!-- App Footer -->
    </v-main>
    <!-- Go to top -->
    <app-fab />
  </v-app>
</template>

<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import AppFab from '@/components/AppFab'

export default {
  name: 'LayoutDefault',
  components: {
    AppDrawer,
    AppToolbar,
    AppFab
  },

  data() {
    return {
      showDrawer: true
    }
  },
  methods: {
    handleDrawerVisiable() {
      this.$refs.drawer.toggleDrawer()
    }
  }
}
</script>

<style lang="sass" scoped>
.page-wrapper
  min-height: calc(100vh - 112px - 48px)
</style>
