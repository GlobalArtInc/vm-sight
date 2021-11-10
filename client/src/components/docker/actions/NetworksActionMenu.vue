<template>
  <div style="display: flex">
      <v-btn :disabled="selected.length === 0" large depressed tile color="error" @click="onRemove(false)">
        <v-icon class="mr-2">mdi-delete</v-icon>
        Remove
      </v-btn>
      <v-btn large depressed tile color="primary" class="ml-2" @click="onRemove(false)">
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add Network
      </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      default: []
    },
    remove: {
      type: Boolean,
      default: false
    },
    newImage: {
      type: Boolean,
      default: false
    },
    importExport: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
}
</script>