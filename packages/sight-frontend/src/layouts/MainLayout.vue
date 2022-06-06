<template>
  <v-app class="app">
    <app-drawer class="app--drawer" ref="drawer" />
    <app-toolbar class="app--toolbar" @side-icon-click="handleDrawerVisible" />
    <v-main style="background: #f3f3f3">
      <div class="page-wrapper">
        <router-view/>
      </div>
    </v-main>
    <app-fab />
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import AppFab from '../components/AppFab';
import AppToolbar from '../components/AppToolbar';
import AppDrawer from '@/components/AppDrawer';

@Component({
  name: 'MainLayout',
  components: {
    AppDrawer,
    AppFab,
    AppToolbar
  },
  data: () => ({
    showDrawer: true
  })
})
export default class MainLayout extends Vue {
  handleDrawerVisible () {
    this.$refs.drawer.toggleDrawer();
  }
}
</script>

<style lang="sass" scoped>
.page-wrapper
  min-height: calc(100vh - 112px - 48px)
</style>
