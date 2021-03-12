<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-progress-linear indeterminate color="primary" v-if="idle" absolute top/>
        <v-card-subtitle class="font-weight-medium" style="color: #333">
          <i class="fa fa-cogs"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Actions</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          <template v-if="endpoint">
            <Action :endpoint="endpoint" :hash="hash" @idle="onIdle" @update="fetchContainer"/>
          </template>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="12" v-if="endpoint">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333">
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
                <td style="width: 20%">
                  ID
                </td>
                <td v-text="endpoint.Id"></td>
              </tr>
              <tr>
                <td style="width: 20%">
                  Name
                </td>
                <td v-text="endpoint.Name">Dev</td>
              </tr>
              <tr>
                <td style="width: 20%">Dev</td>
                <td>Dev</td>
              </tr>
              <tr>
                <td style="width: 20%">Status</td>
                <td>
                  <State text :state="endpoint.State.Status"/>
                </td>
              </tr>
              <tr>
                <td style="width: 20%">Created</td>
                <td> {{ endpoint.Created | moment("YYYY-MM-DD HH:mm:ss") }}</td>
              </tr>
              <tr style="width: 20%">
                <td>Finished</td>
                <td> {{ endpoint.State.FinishedAt | moment("YYYY-MM-DD HH:mm:ss") }}</td>
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
  </v-row>
</template>

<script>
import {fetchContainer} from "@/api/endpoints/docker";
import {fetchEndpoint} from "@/api/endpoints/api";
import State from "@/components/docker/State";
import Action from "@/components/docker/Action";

export default {
  components: {Action, State},
  props: {
    id: [String, Number],
    hash: [String, Number]
  },
  data: () => ({
    endpoint: false,
    idle: true
  }),
  methods: {
    onIdle(state) {
      this.idle = state
    },
    fetchContainer() {
      fetchContainer(this.id, this.hash).then((endpoint) => {
        this.endpoint = endpoint
        this.idle = false
      }).catch(() => {
        this.$router.push('/')
      })
    }
  },
  created() {
    fetchEndpoint(this.id).then(() => {
      this.fetchContainer()
    }).catch(() => {
      this.$router.push('/')
    })

  }
}
</script>
