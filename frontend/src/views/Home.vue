<template>
  <div class="page-dashboard">
    <v-container class="main-container">
      <v-card>
        <v-card-title>Endpoints</v-card-title>
        <template v-if="isLoaded">
          <v-data-table
              v-if="endpoints.length > 0"
              :headers="headers"
              :items="endpoints"
              hide-default-header
              :items-per-page="10"
              class="elevation-1"
          >
            <template #body="{items}">
              <v-list>
                <template v-for="(item, index) in items">
                  <v-list-item :key="item.title" @click="goCluster(item)">
                    <v-list-item-icon>
                      <font-awesome-icon style="font-size: 62px; color: #337ab7" :icon="['fab', 'docker']"/>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                          <span style="float:left">
                          {{ item.Name }}

                          <v-chip label class="font-weight-black" small color="success" v-if="item.Status === 1">on
                          </v-chip>
                          <v-chip label class="font-weight-black" small color="error" v-else>off</v-chip>
                          </span>
                        <span style="float:right;padding-right: 1em">
                            sw
                        </span>
                      </v-list-item-title>

                      <v-list-item-subtitle class="text--primary">
                        <span v-if="item.Snapshot">
                          <span style="padding: 0 7px 0 0;">
                            <i class="fa fa-list-alt"/>
                            {{ item.Snapshot.ServiceCount }} services
                          </span>
                          <span>
                            <i class="fa fa-cubes" />
                            {{ item.Snapshot.Containers }} containers
                          </span>
                        </span>
                        <span style="float:right;padding-right: 1em" v-if="item.Snapshot">
                          {{ item.Snapshot.Swarm ? "Swarm" : "Standalone" }} {{ item.Snapshot.DockerVersion }}
                        </span>
                      </v-list-item-subtitle>

                      <v-list-item-subtitle>
                        <span>
                          s
                        </span>
                        <span style="float:right;padding-right: 1em">
                          {{ item.URL }}
                        </span>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider
                      v-if="index < items.length - 1"
                      :key="index"
                  ></v-divider>
                </template>
              </v-list>
            </template>
          </v-data-table>
          <div v-else style="padding: 1em;color: #777" class="text-center font-weight-medium">
            No endpoints available.
          </div>
        </template>
        <template v-else>
          <v-progress-linear indeterminate height="10"/>
        </template>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import {motd} from "@/api/api";
import {getEndpoints} from "@/api/endpoints/api";

export default {
  data: () => ({
    isLoaded: false,
    endpoints: [],
    headers: [
      {
        text: "endpoint"
      }
    ]
  }),
  methods: {
    goCluster(endpoint) {
      if (endpoint.Type === 1) {
        this.$router.push(`/${endpoint.Id}/docker/dashboard`)
      }
    }
  },
  created() {
    motd().then(() => {
      getEndpoints().then((endpoints) => {
        setTimeout(() => this.isLoaded = true, 1000)
        this.endpoints = endpoints
      })
    })
  }
}
</script>
