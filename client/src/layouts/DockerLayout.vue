<template>
  <v-progress-linear v-if="!isLoading" indeterminate />
  <div class="page-docker" v-else>
    <template v-if="isLoading">
      <v-container class="main-container" v-if="endpoint.Status === 1">
        <router-view/>
      </v-container>
      <v-container class="error--text text-center" v-else-if="endpoint.Status === 0">
        Сервер не доступен
      </v-container>
    </template>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'DockerLayout',
  data: () => ({
    isLoading: false
  }),
  props: {
    id: {type: String}
  },
  computed: {
    ...mapGetters(['endpoint'])
  },
  created() {
    try {
      this.$store.dispatch('app/getEndpoint', this.id)
    } finally {
      setTimeout(() => {
        this.isLoading = true
      }, 500)
    }
  }
}
</script>

<style lang="sass" scoped>
.page-wrapper
  min-height: calc(100vh - 112px - 48px)
</style>
