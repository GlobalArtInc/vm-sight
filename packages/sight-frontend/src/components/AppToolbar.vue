<template>
  <v-app-bar color="primary" dark app>
    <v-app-bar-nav-icon @click="handleDrawerToggle"/>
    <v-spacer/>
    <v-toolbar-items>
      <v-menu offset-y origin="center center" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon large text slot="activator" v-on="on">
            <v-avatar size="30px">
              <img src="https://www.gravatar.com/avatar/asddw" alt=""/>
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item
            @click="handleLogout"
            rel="noopener">
            <v-list-item-action>
              <v-icon>mdi-power</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <v-toolbar elevation="0" dense slot="extension" color="white" light>
      <v-icon>mdi-home</v-icon>
      <v-breadcrumbs :items="breadcrumbs"/>
      <v-spacer></v-spacer>
    </v-toolbar>
  </v-app-bar>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { removeToken } from '@/utils/auth';

@Component({
  data: () => ({
    profileMenus: [
      {
        icon: 'mdi-power',
        href: '#',
        title: 'Logout'
      }
    ]
  }),
  computed: {
    ...mapGetters(['auth/user']),
    breadcrumbs () {
      const { matched } = this.$route;
      return matched.filter(route => !route.meta.hideInMenu).map((route, index) => {
        const text = this.t('menu.' + route.meta.title) ? this.t('menu.' + route.meta.title) : '';
        let to;
        if (route.meta.type === 'endpointDocker') {
          const url = this.$route.fullPath.split('/');
          to =
            index === matched.length - 1
              ? this.$route.path.replace(':endpointId', url[1]).replace(':id', url[4])
              : route.path.replace(':endpointId', url[1]).replace(':id', url[4]) || route.redirect;
        } else if (route.redirect) {
          to = route.redirect;
        } else {
          to =
            index === matched.length - 1
              ? this.$route.path
              : route.path || route.redirect;
        }
        return {
          text: text,
          to: to,
          exact: true,
          disabled: false
        };
      });
    }
  }
})
export default class AppToolbarComponent extends Vue {
  handleDrawerToggle () {
    this.$emit('side-icon-click');
  }

  handleLogout () {
    if (window.confirm('Are you sure to logout?')) {
      this.$toast('Logout successful', {
        type: 'success',
        position: 'top-center'
      });
      this.$store.dispatch('auth/logout');
      removeToken();
      this.$router.push('/auth');
    }
  }
}
</script>
