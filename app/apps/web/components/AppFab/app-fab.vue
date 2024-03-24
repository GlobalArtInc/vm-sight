<script setup lang="ts">
// const onTop = () => {
//   $vuetify.goTo(0);
// };
</script>

<template>
  <v-fab-transition>
    <v-btn aria-label="Scroll to top" bottom small color="red" dark fab fixed right title="Scroll to top">
      <v-icon>mdi-rocket</v-icon>
    </v-btn>
  </v-fab-transition>
</template>
