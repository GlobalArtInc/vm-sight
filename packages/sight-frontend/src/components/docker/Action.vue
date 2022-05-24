<template>
  <div>
    <v-btn depressed :disabled="disableAll ||  container.State.Running" color="success" tile @click="onStart">
      <v-icon left>fa-play</v-icon>
      Start
    </v-btn>
    <v-btn depressed dense color="error" tile :disabled="disableAll || !container.State.Running" @click="onStop">
      <v-icon left>fa-stop</v-icon>
      Stop
    </v-btn>
    <v-btn depressed dense color="error" tile :disabled="disableAll || !container.State.Running" @click="onKill">
      <v-icon left>fa-bomb</v-icon>
      Kill
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="disableAll || !container.State.Running" @click="onRestart">
      <v-icon left>fa-sync</v-icon>
      Restart
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="disableAll || container.State.Paused" @click="onPause">
      <v-icon left>fa-pause</v-icon>
      Pause
    </v-btn>
    <v-btn depressed dense color="primary" tile :disabled="disableAll || !container.State.Paused" @click="onResume">
      <v-icon left>fa-play</v-icon>
      Resume
    </v-btn>

    <v-dialog
        v-model="dialog.remove"
        width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            v-bind="attrs"
            v-on="on"
            depressed dense color="error" tile>
          <v-icon left>fa-trash</v-icon>
          Remove
        </v-btn>
      </template>
      <v-card>
        <v-toolbar
            color="primary"
            dark>You are about to remove a running container.
        </v-toolbar>
        <v-card-text>
          <p style="margin: 10px">
            This container will be deleted.
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog.remove = false">
            Close
          </v-btn>
          <v-btn class="space-left" tile @click="onRemove" color="error">
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="dialog.recreate"
        width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ml-2"
               v-bind="attrs"
               v-on="on"
               depressed dense color="error" tile>
          <v-icon left>fa-sync</v-icon>
          Recreate
        </v-btn>
      </template>
      <v-card>
        <v-toolbar
            color="primary"
            dark>Are you sure?
        </v-toolbar>
        <v-card-text>
          <p style="margin: 10px">
            You're about to re-create this container, any non-persisted data will be lost. This container will be
            removed and another one will be created using the same configuration.
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog.recreate = false">
            Close
          </v-btn>
          <v-btn class="space-left" tile @click="onRecreate" color="error">
            Recreate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {
  startContainer, stopContainer, killContainer,
  restartContainer, pauseContainer, resumeContainer,
  // eslint-disable-next-line no-unused-vars
  createContainer, removeContainer, renameContainer
} from "@/api/endpoints/docker";

// eslint-disable-next-line no-unused-vars
import {connectNetwork} from "@/api/endpoints/networks";

export default {
  data: () => ({
    disableAll: false,
    dialog: {
      recreate: "",
      remove: ""
    }
  }),
  props: {
    endpointId: {
      type: String
    },
    container: {
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
    },
    onRemove() {
      this.dialog.remove = false
      this.disableAll = true
      this.$emit('idle', true)
      removeContainer(this.$route.params.id, this.$route.params.hash).then(() => {
        this.disableAll = false
        this.$toast(this.__('containers.removed'), {
          type: 'success'
        });
        this.$router.push(`/${this.$route.params.id}/docker/containers`)
      })
    },
    async onRecreate() {
      let container = this.container
      container.Config.name = this.container.name.substr(1)
      await stopContainer(this.endpointId, this.container.Id)
      await renameContainer(this.endpointId, this.container.Id, this.container.Name.substr(1) + '_old')
      const newContainer = await createContainer(this.endpointId, container.Config)
      await connectNetwork(this.endpointId, Object.keys(container.NetworkSettings.Networks)[0], newContainer.id)
      await startContainer(this.endpointId, newContainer.id)
      await removeContainer(this.endpointId, this.container.Id)
      await this.$router.push(`/${this.endpointId}/docker/containers`)
    }
  }
}
</script>
