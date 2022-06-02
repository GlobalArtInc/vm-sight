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
    ...mapGetters(['auth/user'])
  }
})
export default class AppToolbarComponent extends Vue {
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
