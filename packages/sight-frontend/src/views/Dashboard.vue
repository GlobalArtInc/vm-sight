<template>
  <div class="page-dashboard">
    <v-container class="main-container">
      <v-card>
        <v-card-title>Endpoints</v-card-title>
        <v-data-table
          v-if="endpoints.length > 0"
          :headers="headers"
          :items="endpoints"
          hide-default-header
          :items-per-page="10"
          class="elevation-1">
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
                          {{ item.name }}

                          <v-chip label class="font-weight-black" small color="success"
                                  v-if="item.status === 1">on</v-chip>
                          <v-chip label class="font-weight-black" small color="error" v-else>off</v-chip>
                            {{ convertDate(item.snapshot.Time) }}
                          </span>
                    </v-list-item-title>

                    <v-list-item-subtitle class="text--primary">
                        <span v-if="item.snapshot">
                          <span style="padding: 0 7px 0 0;">
                            <font-awesome-icon :icon="icon.faListAlt"/>
                            {{ item.snapshot.ServiceCount }} services
                          </span>
                          <span>
                            <font-awesome-icon :icon="icon.faCubes"/>
                            {{ item.snapshot.Containers }} containers
                          </span>
                        </span>
                      <span style="float:right;padding-right: 1em" v-if="item.snapshot">
                          {{ item.snapshot.Swarm ? "Swarm" : "Standalone" }} {{ item.snapshot.DockerVersion }}
                        </span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span>
                          <span class="small text-muted ng-binding">
                            <font-awesome-icon :icon="icon.faMicrochip"/>
                            {{ item.snapshot.TotalCPU }}
                            <font-awesome-icon class="space-left" :icon="icon.faMemory"/>
                            {{convert(item.snapshot.TotalMemory)}}
                          </span>
                        </span>
                      <span style="float:right;padding-right: 1em">
                          {{ item.host }}
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
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';
import { ByteToSize } from '@/utils/math';
import { faListAlt, faCubes, faMicrochip, faMemory } from '@fortawesome/free-solid-svg-icons';

@Component({
  data: () => ({
    endpoints: [],
    icon: {
      faListAlt,
      faCubes,
      faMicrochip,
      faMemory
    },
    headers: [
      {
        text: 'endpoint'
      }
    ]
  }),
  created () {
    this.endpoints = this.$route.meta.endpoints;
  }
})
export default class DashboardView extends Vue {
  convert (number) {
    return ByteToSize(number);
  }

  convertDate (time) {
    return moment.unix(time).format('DD-MM-YYYY, hh:mm:ss a');
  }

  goCluster (endpoint) {
    if (endpoint.type === 1 || endpoint.type === 2) {
      this.$router.push(`/${endpoint.id}/docker/dashboard`);
    }
  }
}
</script>
