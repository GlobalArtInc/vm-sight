<template>
  <v-app class="app">
    <v-main style="background: #f3f3f3">
      <app-toolbar class="app--toolbar" />
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

@Component({
  name: 'MainLayout',
  components: {
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
