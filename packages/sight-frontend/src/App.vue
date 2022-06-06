<template>
  <div>
    <vue-progress-bar></vue-progress-bar>
    <v-app dark>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  mounted () {
    this.$Progress.finish();
  },
  created () {
    this.$Progress.start();
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start();
      next();
    });

    this.$router.afterEach(() => {
      this.$Progress.finish();
    });
  }
})
export default class extends Vue {
}
</script>
