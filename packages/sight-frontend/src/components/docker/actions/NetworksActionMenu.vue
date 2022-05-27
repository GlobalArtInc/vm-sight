<template>
  <div style="display: flex">
    <v-btn :disabled="selected.length === 0" large depressed tile color="error" @click="onRemove">
      <v-icon class="mr-2">mdi-delete</v-icon>
      Remove
    </v-btn>
    <v-btn large depressed tile color="primary" class="ml-2" to="networks/add">
      <v-icon class="mr-2">mdi-plus</v-icon>
      Add Network
    </v-btn>
  </div>
</template>

<script>
import {removeNetwork} from "@/api/endpoints/networks";

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
    onRemove() {
      this.selected.map(async (item, i) => {
        if (this.selected.length === i + 1) {
          try {
            await removeNetwork(this.$route.params.id, item.Id)
            this.$toast(this.__('networks.removed'), {
              type: 'success'
            });
            this.$emit("delete", item.Id)
          } catch (err) {
            this.$toast(err.response.data.message, {
              type: 'error'
            });
          } finally {
            this.$emit('update')
          }
        }
      })
    }
  }
}
</script>
