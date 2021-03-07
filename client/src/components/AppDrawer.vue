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
        <v-list-item to="/home">
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
        <v-list-item to="/users">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-account-group</v-icon>
              </template>
              <span>Users</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/settings" v-if="user.role === 1">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-cog</v-icon>
              </template>
              <span>Settings</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>
<script>
import { protectedRoute as routes } from '@/router'
import {mapGetters} from 'vuex';

export default {
  name: 'AppDrawer',
  components: {},
  props: {
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mini: false,
      drawerWidth: 256,
      drawer: true,
      scrollSettings: {
        maxScrollbarLength: 160
      },
      sponsor: {
        href: 'https://www.kamefiber.com/',
        src: '/sponsor/logo.png',
        srcMini: '/sponsor/logo_mini.png'
      }
    }
  },

  computed: {
    ...mapGetters(['user']),
    computeLogo() {
      return '/static/m.png'
    },
    computeMenu() {
      return routes[0].children
    }
  },
  created() {},

  methods: {
    handleDrawerCollapse() {
      this.drawerWidth = this.drawerWidth === 256 ? 64 : 256
    },
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    computeGroupExpanded(item, $route) {
      return $route.matched.map((item) => item.path).includes(item.path)
    }
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
