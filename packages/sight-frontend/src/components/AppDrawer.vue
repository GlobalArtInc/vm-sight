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
              <span>{{ __("menu.home") }}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>{{ __("menu.home") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <template v-if="currentEndpoint">
          <v-subheader v-text="currentEndpoint.name"/>
          <v-list-item :to="`/${currentEndpoint.id}/docker/dashboard`">
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content v-if="drawerWidth !== 64">
              <v-list-item-title>{{ __("menu.dashboard") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="`/${currentEndpoint.id}/docker/containers`">
            <v-list-item-icon>
              <v-icon>fa-cubes</v-icon>
            </v-list-item-icon>
            <v-list-item-content v-if="drawerWidth !== 64">
              <v-list-item-title>{{ __("menu.containers") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="`/${currentEndpoint.id}/docker/images`">
            <v-list-item-icon>
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-icon>
            <v-list-item-content v-if="drawerWidth !== 64">
              <v-list-item-title>{{ __("menu.images") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="`/${currentEndpoint.id}/docker/networks`">
            <v-list-item-icon>
              <v-icon>mdi-sitemap</v-icon>
            </v-list-item-icon>
            <v-list-item-content v-if="drawerWidth !== 64">
              <v-list-item-title>{{ __("menu.networks") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-subheader>SETTINGS</v-subheader>
        <v-list-item to="/users">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-account-group</v-icon>
              </template>
              <span>{{ __("menu.users") }}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>{{ __("menu.users") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/endpoints" v-if="user.role === 1">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">fa-server</v-icon>
              </template>
              <span>{{ __("menu.endpoints") }}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>{{ __("menu.endpoints") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/registries" v-if="user.role === 1">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">fa-database</v-icon>
              </template>
              <span>{{ __("menu.registries") }}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>{{ __("menu.registries") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/settings/main" v-if="user.role === 1">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-cog</v-icon>
              </template>
              <span>{{ __("menu.settings") }}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>{{ __("menu.settings") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/settings/auth" v-if="user.role === 1">
          <v-list-item-icon>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">mdi-login</v-icon>
              </template>
              <span>{{ __("menu.settings_auth") }}</span>
            </v-tooltip>
          </v-list-item-icon>
          <v-list-item-content v-if="drawerWidth !== 64">
            <v-list-item-title>{{ __("menu.settings_auth") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <template v-slot:append>
      <div class="text-center white--text">
        {{ $store.getters.settings.Version }}
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script>
import {protectedRoute as routes} from '@/router'
import {mapGetters} from 'vuex';

export default {
  name: 'AppDrawer',
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
    ...mapGetters(['user', 'currentEndpoint']),
    computeLogo() {
      return '/static/m.png'
    },
    computeMenu() {
      return routes[0].children
    }
  },
  created() {
  },

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
