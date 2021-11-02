<template>
  <div style="display: flex">
    <div class="btn-group" v-if="remove" role="group" aria-label="...">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn large depressed tile color="error">Remove</v-btn>
          <v-btn large depressed tile v-on="on" v-bind="attrs" color="error">
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>Force Remove</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-btn large v-if="newImage" class="ml-2" depressed dense color="primary" tile>
      Build a new image
    </v-btn>
    <div v-if="importExport" class="btn-group ml-2" role="group" aria-label="...">
      <v-btn large depressed color="primary" tile>
        Import
      </v-btn>
      <v-btn large depressed color="primary" tile>
        Export
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
  methods: {
    async onToggleChange(e) {
      console.log(e)
      // e.preventDefault()
    }
  }
}
</script>