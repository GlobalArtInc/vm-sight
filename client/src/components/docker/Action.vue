<template>
  <div>
    <v-btn depressed :disabled="disableAll ||  endpoint.State.Running" color="success" tile @click="onStart">
      <v-icon left>fa-play</v-icon>
      Start
    </v-btn>
    <v-btn depressed dense color="error" tile :disabled="disableAll || !endpoint.State.Running" @click="onStop">
      <v-icon left>fa-stop</v-icon>
      Stop
    </v-btn>
    <v-btn depressed dense color="error" tile :disabled="disableAll || !endpoint.State.Running" @click="onKill">
      <v-icon left>fa-bomb</v-icon>
      Kill
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="disableAll || !endpoint.State.Running" @click="onRestart">
      <v-icon left>fa-sync</v-icon>
      Restart
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="disableAll || endpoint.State.Paused" @click="onPause">
      <v-icon left>fa-pause</v-icon>
      Pause
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="disableAll || !endpoint.State.Paused" @click="onResume">
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
  data: () => ({
    disableAll: false
  }),
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
      this.disableAll = true
      this.$emit('idle', true)
      startContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.disableAll = false
        this.$toast(this.__('containers.started'), {
          type: 'success'
        });
        this.$emit('update')
      })
    },
    onStop() {
      this.disableAll = true
      this.$emit('idle', true)
      stopContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.disableAll = false
        this.$toast(this.__('containers.stopped'), {
          type: 'success'
        });
        this.$emit('update')
      })
    },
    onKill() {
      this.disableAll = true
      this.$emit('idle', true)
      killContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.disableAll = false
        this.$toast(this.__('containers.killed'), {
          type: 'success'
        });
        this.$emit('update')
      })
    },
    onRestart() {
      this.disableAll = true
      this.$emit('idle', true)
      restartContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.disableAll = false
        this.$toast(this.__('containers.restarted'), {
          type: 'success'
        });
        this.$emit('update')
      })
    },
    onPause() {
      this.disableAll = true
      this.$emit('idle', true)
      pauseContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.disableAll = false
        this.$toast(this.__('containers.paused'), {
          type: 'success'
        });
        this.$emit('update')
      })
    },
    onResume() {
      this.disableAll = true
      this.$emit('idle', true)
      resumeContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.disableAll = false
        this.$toast(this.__('containers.resumed'), {
          type: 'success'
        });
        this.$emit('update')
      })
    }
  }
}
</script>
