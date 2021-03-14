<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-progress-linear indeterminate color="primary" v-if="idle" absolute top/>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-cogs"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Actions</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          <template v-if="container">
            <Action :container="container" :hash="hash" @idle="onIdle" @update="fetchContainer"/>
          </template>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="12" v-if="container">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-server"></i>
          <span class="font-weight-medium pl-1" style="color: #333">
            Container status
          </span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
              <tr>
                <td style="width: 25%">
                  ID
                </td>
                <td v-text="container.Id"></td>
              </tr>
              <tr>
                <td style="width: 25%">
                  Name
                </td>
                <td v-text="container.Name.substr(1)" />
              </tr>
              <tr>
                <td style="width: 25%">Dev</td>
                <td>Dev</td>
              </tr>
              <tr>
                <td style="width: 25%">Status</td>
                <td>
                  <State text :state="container.State.Status"/>
                </td>
              </tr>
              <tr>
                <td style="width: 25%">Created</td>
                <td> {{ container.Created | moment("YYYY-MM-DD HH:mm:ss") }}</td>
              </tr>
              <tr style="width: 25%">
                <td>Finished</td>
                <td> {{ container.State.FinishedAt | moment("YYYY-MM-DD HH:mm:ss") }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-divider/>
        <v-card-actions style="padding: 1em">
          <v-btn text v-text="this.__('endpoints.logs')" @click="$router.push(`${hash}/logs`)"/>
          <v-btn text class="space-left" v-text="this.__('endpoints.inspect')"/>
          <v-btn text class="space-left" v-text="this.__('endpoints.stats')"/>
          <v-btn text class="space-left" v-text="this.__('endpoints.console')"/>
          <v-btn text class="space-left" v-text="this.__('endpoints.attach')"/>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col :cols="12" v-if="container">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-server"></i>
          <span class="font-weight-medium pl-1" style="color: #333">
            Container details
          </span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
              <tr>
                <td style="width: 25%">
                  IMAGE
                </td>
                <td>{{ container.Image }}</td>
              </tr>
              <tr>
                <td style="width: 25%">
                  Port Configuration
                </td>
                <td>Port Configuration</td>
              </tr>
              <tr>
                <td style="width: 25%">CMD</td>
                <td><span class="code" v-if="container.Config.Cmd" v-text="container.Config.Cmd.join(' ')"/></td>
              </tr>
              <tr>
                <td style="width: 25%">
                  ENTRYPOINT
                </td>
                <td><span class="code" v-if="container.Config.Entrypoint" v-text="container.Config.Entrypoint.join('')"/></td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="12" v-if="container && container.Mounts.length > 0">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-hdd"></i>
          <span class="font-weight-medium pl-1" style="color: #333">
            Volumes
          </span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-simple-table dense>
            <thead>
            <tr>
              <th><span class="font-weight-black" style="font-size: 1.2em">Host/Volume</span></th>
              <th><span class="font-weight-black" style="font-size: 1.2em">Path in container</span></th>
            </tr>
            </thead>
            <tbody>
            <tr :key="volume.Source" v-for="volume in container.Mounts">
              <td v-text="volume.Name" v-if="volume.Name" />
              <td v-text="volume.Source" v-else />
              <td v-text="volume.Destination" />
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>

  </v-row>
</template>

<script>
import {fetchContainer} from "@/api/endpoints/docker";
import State from "@/components/docker/State";
import Action from "@/components/docker/Action";

export default {
  components: {Action, State},
  props: {
    id: [String, Number],
    hash: [String, Number]
  },
  data: () => ({
    container: false,
    idle: true
  }),
  methods: {
    onIdle(state) {
      this.idle = state
    },
    fetchContainer() {
      fetchContainer(this.id, this.hash).then((container) => {
        this.container = container
        this.idle = false
      }).catch(() => {
        this.$router.push('/')
      })
    }
  },
  created() {
    this.$store.dispatch('app/getEndpoint', this.id).then(() => {
      this.fetchContainer()
    }).catch(() => {
      this.$router.push('/')
    })

  }
}
</script>
