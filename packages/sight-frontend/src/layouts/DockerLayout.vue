<template>
  <v-container class="main-container" v-if="endpoint.status === 1">
    <router-view/>
  </v-container>
  <v-container class="error--text text-center" v-else>
    Сервер не доступен
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DockerLayout extends Vue {
  endpoint = this?.$route?.meta?.endpoint;
}
</script>
