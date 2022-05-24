<template>
  <div class="page-docker">
    <v-progress-linear v-if="!isLoading" indeterminate/>
    <template v-else>
      <template v-if="isLoading">
        <v-container class="main-container" v-if="endpoint.status === 1">
          <router-view/>
        </v-container>
        <v-container class="error--text text-center" v-else-if="endpoint.status === 0">
          Сервер не доступен
        </v-container>
      </template>
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
  async created() {
    try {
      await this.$store.dispatch('app/getEndpoint', this.id)
    } catch (err) {
      this.$toast(err.response.data.message, {
        type: 'error'
      });
      await this.$router.push('/endpoints')
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
