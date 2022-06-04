<template>
  <v-navigation-drawer
    app
    class="app-drawer"
    :mini-variant.sync="mini"
    v-model="drawer"
    :width="drawerWidth"
    style="background: #30426A"
  >
    <v-toolbar color="#2D3E63" dark st>
      <v-toolbar-title class="ml-0 pl-3">
        <span>VM-SIGHT</span>
      </v-toolbar-title>
    </v-toolbar>
    <div class="app-drawer__inner">
      <v-list dark :dense="drawerWidth !== 64" class="pa-0">
        <v-list-item to="/dashboard">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-view-dashboard</v-icon>
              </template>
              <span>Home</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-subheader>SETTINGS</v-subheader>
        <v-list-item :to="item.to" :key="key" v-for="(item, key) of items">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" v-if="item.iconType === 'mdi'">{{ item.icon }}</v-icon>
                <font-awesome-icon class="v-icon notranslate" v-else-if="item.iconType === 'fa'" :icon="item.icon"></font-awesome-icon>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <template v-slot:append>
      <div class="text-center white--text">

      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { faServer, faDatabase } from '@fortawesome/free-solid-svg-icons';

@Component({
  data: () => ({
    mini: false,
    drawerWidth: 256,
    drawer: true,
    scrollSettings: {
      maxScrollbarLength: 160
    },
    items: [
      {
        title: 'Users',
        iconType: 'mdi',
        icon: 'mdi-account-group',
        to: '/users'
      },
      {
        title: 'Endpoints',
        iconType: 'fa',
        icon: faServer,
        to: '/endpoints'
      },
      {
        title: 'Registries',
        iconType: 'fa',
        icon: faDatabase,
        to: '/registries'
      }
    ],
    sponsor: {
      href: 'https://www.kamefiber.com/',
      src: '/sponsor/logo.png',
      srcMini: '/sponsor/logo_mini.png'
    }
  })
})
export default class AppDrawer extends Vue {
  handleDrawerCollapse () {
    this.drawerWidth = this.drawerWidth === 256 ? 64 : 256;
  }

  toggleDrawer () {
    this.drawer = !this.drawer;
  }

  computeGroupExpanded (item, $route) {
    return $route.matched.map((item) => item.path).includes(item.path);
  }
}
</script>

<style lang="sass" scoped>
.app-drawer
  overflow: hidden !important

  &__inner
    height: calc(100vh - 100px)

  .drawer-menu--scroll
    height: calc(100vh - 48px)
    overflow: auto
</style>
