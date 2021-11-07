<template>
  <div style="display: flex">
    <div class="btn-group" v-if="remove" role="group" aria-label="...">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn :disabled="selected.length === 0" large depressed tile color="error" @click="onRemove(false)">
            <v-icon class="mr-2">mdi-delete</v-icon>
            Remove
          </v-btn>
          <v-btn :disabled="selected.length === 0" large depressed tile v-on="on" v-bind="attrs" color="error">
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="onRemove(true)">
            <v-list-item-title>Force Remove</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <v-btn large v-if="newImage" class="ml-2" depressed dense color="primary" tile>
      <v-icon class="mr-2">mdi-plus</v-icon>
      Build a new image
    </v-btn>
    <div v-if="importExport" class="btn-group ml-2" role="group" aria-label="...">
      <v-btn  large depressed color="primary" tile>
        <v-icon class="mr-2">mdi-upload</v-icon>
        Import
      </v-btn>
      <v-btn :disabled="selected.length === 0" @click="onExport" large depressed color="primary" tile>
        <v-icon class="mr-2">mdi-download</v-icon>
        Export
      </v-btn>
    </div>
  </div>
</template>

<script>
import {exportImages, removeImage} from "../../api/endpoints/images";

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
  methods: {
    onExport() {
      exportImages(this.$route.params.id, this.selected[0].RepoTags[0])
    },
    // eslint-disable-next-line no-unused-vars
    onRemove(force = false) {
      this.selected.map(async (item, i) => {
        if (this.selected.length === i + 1) {
          removeImage(this.$route.params.id, item.Id)
              .then(() => {
                this.$toast(this.__('images.removed'), {
                  type: 'success'
                });
              })
              .catch((err) => {
                this.$toast(err.response.data.message, {
                  type: 'error'
                });
              })
              .finally(() => {
                this.$emit('update')
              })
        } else {
          removeImage(this.$route.params.id, item.Id)
              .then(() => {
                this.$toast(this.__('images.removed'), {
                  type: 'success'
                });
              })
              .catch((err) => {
                this.$toast(err.response.data.message, {
                  type: 'error'
                });
              })
        }
      })
    },
    async onToggleChange(e) {
      console.log(e)
      // e.preventDefault()
    }
  }
}
</script>