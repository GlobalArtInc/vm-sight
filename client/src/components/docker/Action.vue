<template>
  <div>
    <v-btn depressed :disabled="endpoint.State.Running" color="success" tile @click="onStart">
      <v-icon left>fa-play</v-icon>
      Start
    </v-btn>
    <v-btn depressed dense color="error" tile :disabled="!endpoint.State.Running" @click="onStop">
      <v-icon left>fa-stop</v-icon>
      Stop
    </v-btn>
    <v-btn depressed dense color="error" tile :disabled="!endpoint.State.Running" @click="onKill">
      <v-icon left>fa-bomb</v-icon>
      Kill
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="!endpoint.State.Running" @click="onRestart">
      <v-icon left>fa-sync</v-icon>
      Restart
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="endpoint.State.Paused" @click="onPause">
      <v-icon left>fa-pause</v-icon>
      Pause
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="!endpoint.State.Paused" @click="onResume">
      <v-icon left>fa-play</v-icon>
      Resume
    </v-btn>
    <v-btn depressed dense color="error" tile>
      <v-icon left>fa-trash</v-icon>
      Remove
    </v-btn>
    <v-btn class="ml-2" depressed dense color="error" tile>
      <v-icon left>fa-sync</v-icon>
      Recreate
    </v-btn>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {
  startContainer, stopContainer, killContainer,
  restartContainer, pauseContainer, resumeContainer
} from "@/api/endpoints/docker";

export default {
  props: {
    endpoint: {
      type: Object
    },
    hash: {
      type: String
    }
  },
  methods: {
    onStart() {
      startContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.$emit('update')
      })
    },
    onStop() {
      stopContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.$emit('update')
      })
    },
    onKill() {
      killContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.$emit('update')
      })
    },
    onRestart() {
      restartContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.$emit('update')
      })
    },
    onPause() {
      pauseContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.$emit('update')
      })
    },
    onResume() {
      resumeContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.$emit('update')
      })
    }
  }
}
</script>
