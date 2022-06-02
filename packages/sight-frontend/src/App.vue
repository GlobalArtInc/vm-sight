<template>
  <v-app dark>
      <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import authService from '@/services/auth.service';
import { getToken } from '@/utils/auth';

@Component({
  created () {
    if (getToken()) {
      authService.me().then((user) => {
        this.$store.dispatch('auth/getInfo', user);
      });
    }
  }
})
export default class extends Vue {
}
</script>
