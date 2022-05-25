<template>
  <v-app dark>
    <router-view></router-view>
    <!-- setting drawer -->
    <v-navigation-drawer
        class="setting-drawer"
        temporary
        right
        v-model="rightDrawer"
        hide-overlay
        fixed
    >
    </v-navigation-drawer>
    <!-- global snackbar -->
    <v-snackbar
        :timeout="3000"
        app
        top
        centered
        :color="snackbar.color"
        v-model="snackbar.show"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import {getToken} from "@/utils/auth";
import {mapGetters} from 'vuex'

export default {
  mounted() {
    if (typeof window !== undefined && window._VMA === undefined) {
      window._VMA = this
    }
  },
  name: 'App',
  data: () => ({
    rightDrawer: false,
    snackbar: {
      show: false,
      text: '',
      color: ''
    }
  }),
  computed: {
    ...mapGetters(['loaded'])
  },
  created() {
    this.$store.dispatch('app/getPublicSettings')
    if (getToken()) {
      this.$store.dispatch('user/getInfo')
    }
    this.$on('SHOW_SNACKBAR', (e) => {
      this.snackbar = {
        show: true,
        text: e.text,
        color: e.color
      }
    })
    this.$on('AUTH_FAIELD', () => {
      this.snackbar = {
        show: true,
        text: 'Auth Failed',
        color: 'error'
      }
      this.$router.push({
        path: '/auth/login',
        query: {
          redirect: this.$route.path
        }
      })
    })
    this.$on('SERVER_ERROR', () => {
      this.snackbar = {
        show: true,
        text: 'Server Error',
        color: 'error'
      }
    })
  }
}
</script>

