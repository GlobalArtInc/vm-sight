<template>
  <v-card>
    <v-card-title>Endpoints</v-card-title>
    <template v-if="isLoaded">
      <v-data-table
          :headers="headers"
          :items="endpoints"
          hide-default-header
          :items-per-page="10"
          class="elevation-1"
      >
        <template #body="{items}">
          <v-list>
            <template v-for="(item, index) in items">
              <v-list-item :key="item.title">
                <template v-slot:default="{ active }">
                  <v-list-item-icon>
                    <font-awesome-icon style="font-size: 62px; color: #337ab7" :icon="['fab', 'docker']" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.Name }}

                      <v-chip label class="font-weight-black" small color="success" v-if="item.Status === 1">on</v-chip>
                      <v-chip label class="font-weight-black" small color="error" v-else>off</v-chip>

                    </v-list-item-title>

                    <v-list-item-subtitle
                        class="text--primary">asd</v-list-item-subtitle>

                    <v-list-item-subtitle>ads</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text v-text="item.action"></v-list-item-action-text>

                    <v-icon
                        v-if="!active"
                        color="grey lighten-1"
                    >
                      mdi-star-outline
                    </v-icon>

                    <v-icon
                        v-else
                        color="yellow darken-3"
                    >
                      mdi-star
                    </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                  v-if="index < items.length - 1"
                  :key="index"
              ></v-divider>
            </template>
          </v-list>
        </template>
      </v-data-table>
    </template>
    <template v-else>
      <v-progress-linear indeterminate height="10"/>
    </template>
  </v-card>
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