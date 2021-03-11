<template>
  <div class="btn-group" role="group" aria-label="...">
    <v-btn depressed :disabled="selected.length === 0" color="success" tile @click="onStart">
      <v-icon left>fa-play</v-icon>
      Start
    </v-btn>
    <v-btn depressed :disabled="selected.length === 0" dense color="error" tile @click="onStop">
      <v-icon left>fa-stop</v-icon>
      Stop
    </v-btn>
    <v-btn depressed :disabled="selected.length === 0" dense color="error" tile @click="onKill">
      <v-icon left>fa-bomb</v-icon>
      Kill
    </v-btn>
    <v-btn depressed :disabled="selected.length === 0" dense color="primary" tile @click="onRestart">
      <v-icon left>fa-sync</v-icon>
      Restart
    </v-btn>
    <v-btn depressed :disabled="selected.length === 0" dense color="primary" tile @click="onPause">
      <v-icon left>fa-pause</v-icon>
      Pause
    </v-btn>
    <v-btn depressed :disabled="selected.length === 0" dense color="primary" tile @click="onResume">
      <v-icon left>fa-play</v-icon>
      Resume
    </v-btn>
    <v-btn depressed :disabled="selected.length === 0" dense color="error" tile @click="onRemove">
      <v-icon left>fa-trash</v-icon>
      Remove
    </v-btn>
  </div>
</template>

<script>
import {
  startContainer, stopContainer, killContainer,
  restartContainer, pauseContainer, resumeContainer,
  removeContainer
} from "@/api/endpoints/docker";

export default {
  props: {
    selected: {
      type: Array
    }
  },
  methods: {
    onStart() {
      const selected = this.selected.filter((i) => i.State === 'exited');
      selected.map(async (item, i) => {
        if (selected.length === i + 1) {
          startContainer(this.$route.params.id, item.Id).then(() => {
            this.$emit('update')
          })
        } else {
          await startContainer(this.$route.params.id, item.Id)
        }
      })
    },
    async onStop() {
      const selected = this.selected.filter((i) => i.State === 'running');
      selected.map(async (item, i) => {
        if (selected.length === i + 1) {
          await stopContainer(this.$route.params.id, item.Id)
          await this.$emit('update')
        } else {
          await stopContainer(this.$route.params.id, item.Id)
        }
      })
    },
    async onKill() {
      const selected = this.selected;
      selected.map(async (item, i) => {
        if (selected.length === i + 1) {
          await killContainer(this.$route.params.id, item.Id)
          await this.$emit('update')
        } else {
          await killContainer(this.$route.params.id, item.Id)
        }
      })
    },
    async onRestart() {
      const selected = this.selected.filter((i) => i.State === 'running');
      selected.map(async (item, i) => {
        if (selected.length === i + 1) {
          await restartContainer(this.$route.params.id, item.Id)
          await this.$emit('update')
        } else {
          await restartContainer(this.$route.params.id, item.Id)
        }
      })
    },
    async onPause() {
      const selected = this.selected.filter((i) => i.State === 'running');
      selected.map(async (item, i) => {
        if (selected.length === i + 1) {
          await pauseContainer(this.$route.params.id, item.Id)
          await this.$emit('update')
        } else {
          await pauseContainer(this.$route.params.id, item.Id)
        }
      })
    },
    async onResume() {
      const selected = this.selected.filter((i) => i.State === 'paused');
      selected.map(async (item, i) => {
        if (selected.length === i + 1) {
          await resumeContainer(this.$route.params.id, item.Id)
          await this.$emit('update')
        } else {
          await resumeContainer(this.$route.params.id, item.Id)
        }
      })
    },
    async onRemove() {
      const selected = this.selected;
      selected.map(async (item, i) => {
        if (selected.length === i + 1) {
          await removeContainer(this.$route.params.id, item.Id)
          await this.$emit('update')
        } else {
          await removeContainer(this.$route.params.id, item.Id)
        }
      })
    }
  }
}
</script>
