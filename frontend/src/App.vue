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

export default {
  name: 'App',
  data: () => ({
    rightDrawer: false,
    snackbar: {
      show: false,
      text: '',
      color: ''
    }
  }),
  created() {
    if (getToken()) {
      this.$store.dispatch('user/getInfo')
    }
  }
}
</script>

