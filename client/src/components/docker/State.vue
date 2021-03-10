<template>
  <v-chip color="success" v-if="state === 'running'" class="font-weight-bold">
    Running
  </v-chip>
  <v-chip color="error" v-else class="font-weight-bold">
    Stopped
  </v-chip>
</template>

<script>
export default {
  props: {
    state: {
      type: String
    },
    status: {
      type: String
    }
  }
}
</script>
