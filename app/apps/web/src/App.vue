<template>
  <div v-if="isLoaded">
    <vue-progress-bar></vue-progress-bar>
    <v-app dark>
      <router-view></router-view>
    </v-app>
  </div>
  <vue-splash
    v-else
    logo="/vue_logo.svg"
    :show="true"
    title="VM-SIGHT"
    color="#00bfa5"
    :size="180"
    :fixed="true"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  mounted () {
    this.$Progress.finish();
  }
})
export default class extends Vue {
  isLoaded = false

  created () {
    this.$Progress.start();

    this.$router.beforeResolve((to, from, next) => {
      setTimeout(() => {
        this.isLoaded = true;
      }, 1500);
      next();
    });

    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start();
      next();
    });

    this.$router.afterEach(() => {
      this.$Progress.finish();
    });
  }
}
</script>
