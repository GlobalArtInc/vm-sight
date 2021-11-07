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
            <Action :endpointId="id" :container="container" :hash="hash" @idle="onIdle" @update="fetchContainer"/>
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
                <td>
                  {{ container.Name.substr(1) }}
                  <v-btn style="margin-left: 0.3em" icon @click="openRenameDialog">
                    <v-icon color="primary" small>
                      fa-edit
                    </v-icon>
                    <v-dialog width="500" v-model="dialog.rename.show">
                      <v-card>
                        <v-card-title>Change name of container</v-card-title>
                        <v-divider></v-divider>

                        <v-card-text>
                          <v-text-field v-model="dialog.rename.name" style="margin-top: 1.5em" filled label="Name"/>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" text @click="dialog.rename.show = false">
                            Close
                          </v-btn>
                          <v-btn color="primary" @click="onRename">Rename</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-btn>
                </td>
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
          <v-btn text class="space-left" v-text="this.__('endpoints.console')" @click="$router.push(`${hash}/exec`)"/>
          <v-btn text class="space-left" v-text="this.__('endpoints.attach')" @click="$router.push(`${hash}/attach`)"/>
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
                <td>
                  <template v-for="ports in container.NetworkSettings.Ports">
                    <template v-for="(port, portKey) in ports">
                      <span :key="portKey">
                        {{ port.HostIp }}:{{ port.HostPort }}
                        <br />
                      </span>
                    </template>
                  </template>
                </td>
              </tr>
              <tr>
                <td style="width: 25%">CMD</td>
                <td><span class="code" v-if="container.Config.Cmd" v-text="container.Config.Cmd.join(' ')"/></td>
              </tr>
              <tr>
                <td style="width: 25%">
                  ENTRYPOINT
                </td>
                <td><span class="code" v-if="container.Config.Entrypoint"
                          v-text="container.Config.Entrypoint.join('')"/></td>
              </tr>
              <tr>
                <td style="width: 25%">
                  Restart Policy
                </td>
                <td>
                  <div style="display: flex;padding-top: 1em">
                    <div style="width: 25%">
                      <v-select
                          dense
                          v-model="container.HostConfig.RestartPolicy.Name"
                          :items="restartPolicyItems"
                          item-text="text"
                          item-value="Name"/>
                    </div>
                    <v-btn @click="onUpdate({
                          RestartPolicy: {
                            Name: container.HostConfig.RestartPolicy.Name,
                            MaximumRetryCount: container.HostConfig.RestartPolicy.MaximumRetryCount
                          }}, 'restartPolicy')" style="margin-left: 2em" color="primary">
                      Update
                    </v-btn>
                  </div>
                </td>
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
              <td v-text="volume.Name" v-if="volume.Name"/>
              <td v-text="volume.Source" v-else/>
              <td v-text="volume.Destination"/>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="12" v-if="container">
      <v-card>
        <v-card-subtitle class="font-weight-medium">
          <i class="fa fa-sitemap"></i>
          <span class="font-weight-medium pl-1" style="color: #333">
            Connected networks
          </span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-subtitle>
          <div style="display: flex">
            <v-select style="max-width: 20%" v-model="currentNetwork" :items="networks" outlined item-text="Name"
                      item-value="Id" dense/>
            <v-btn color="primary" class="space-left" @click="connectNetwork(currentNetwork)">
              Join
            </v-btn>
          </div>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0;margin-bottom: 6em">
          <v-simple-table class="font-weight-medium">
            <thead>
            <tr>
              <th>Network</th>
              <th>IP Address</th>
              <th>IP Gateway</th>
              <th>MAC</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="key" v-for="(network, key) in container.NetworkSettings.Networks">
              <td>{{ key }}</td>
              <td>{{ network.IPAddress }}</td>
              <td>{{ network.Gateway }}</td>
              <td>{{ network.MacAddress }}</td>
              <td>
                <v-btn @click="disconnectNetwork(network.NetworkID)" large icon color="error">
                  <v-icon class="space-right">fa-trash</v-icon>
                </v-btn>
              </td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>

  </v-row>
</template>

<script>
import {disconnectNetwork, connectNetwork} from "@/api/endpoints/networks";
import {renameContainer, updateContainer} from "../../../api/endpoints/docker";
import {fetchContainer} from "@/api/endpoints/docker";
import {fetchNetworks} from "@/api/endpoints/networks";
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
    idle: true,
    restartPolicyItems: [
      {
        text: "None",
        Name: "no"
      },
      {
        text: "On Failure",
        Name: "on-failure"
      },
      {
        text: "Always",
        Name: "always"
      },
      {
        text: "Unless Stopped",
        Name: "unless-stopped"
      }
    ],
    currentNetwork: "",
    dialog: {
      rename: {
        show: false,
        name: ""
      }
    },
    networkHeaders: [
      {
        text: 'Network',
        value: 'Network'
      },
      {
        text: 'IPAddress',
        value: 'IPAddress'
      },
      {}
    ],
    networks: []
  }),
  methods: {
    async onUpdate(data, type) {
      try {
        await updateContainer(this.id, this.hash, data)
        if (type === 'restartPolicy') {
          this.$toast("The restart policy has been updated", {
            type: 'success'
          });
        }
      } catch (err) {
        this.$toast("An error occurred", {
          type: 'error'
        });
      }
    },
    openRenameDialog() {
      this.dialog.rename.show = true
      this.dialog.rename.name = this.container.Name.substr(1)
    },
    onRename() {
      renameContainer(this.id, this.hash, this.dialog.rename.name).then(() => {
        this.dialog.rename.show = false
        this.container.Name = '/' + this.dialog.rename.name
        this.$toast(this.__('containers.renamed'), {
          type: 'success'
        });
      }).catch((err) => {
        this.$toast(err.response.data.message, {
          type: 'error'
        });
      })
    },
    connectNetwork(network) {
      connectNetwork(this.id, network, this.hash).then(() => {
        this.fetchContainer()
        this.$toast(this.__('networks.connected'), {
          type: 'success'
        });
      }).catch((err) => {
        this.$toast(err.response.data.message, {
          type: 'error'
        });
      })
    },
    disconnectNetwork(network) {
      disconnectNetwork(this.id, network, this.hash).then(() => {
        this.fetchContainer()
        this.$toast(this.__('networks.disconnected'), {
          type: 'success'
        });
      })
    },
    onIdle(state) {
      this.idle = state
    },
    fetchContainer() {
      fetchContainer(this.id, this.hash).then((container) => {
        fetchNetworks(this.id).then((networks) => {
          this.container = container
          this.networks = networks
          this.idle = false
        })
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
