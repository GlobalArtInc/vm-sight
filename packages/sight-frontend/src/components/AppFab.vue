<template>
  <v-fab-transition>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      :style="{
        bottom: fab ? '100px' : ''
      }"
      aria-label="Scroll to top"
      bottom
      small
      color="red"
      dark
      fab
      fixed
      right
      title="Scroll to top"
      @click="toTop"
    >
      <v-icon>mdi-rocket</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  data: () => ({
    fab: false
  })
})
export default class AppFabComponent extends Vue {
  onScroll () {
    if (typeof window === 'undefined') return;
    const top = window.pageYOffset || document.documentElement.offsetTop || 0;
    this.fab = top > 300;
  }

  toTop () {
    this.$vuetify.goTo(0);
  }
}
</script>
