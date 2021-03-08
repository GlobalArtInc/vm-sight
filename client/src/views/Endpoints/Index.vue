<template>
  <div class="page-endpoints">
    <v-container class="main-container">
      <v-row>
        <v-col cols="12">
          <v-card tile>
            <v-toolbar flat>
              <v-text-field
                  text
                  solo
                  flat
                  append-icon="mdi-magnify"
                  placeholder="Type something"
                  hide-details
                  clearable
              />
              <v-btn icon>
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider/>
            <v-card-text>
              <v-data-table
                  :loading="loadingItems"
                  :headers="headers"
                  :items="endpoints"
                  :items-per-page-options="[15, 30, 50]"
                  :items-per-page="10"
                  item-key="Id"
              >
                <template #item.Type="{item}">
                  <i :class="getType(item.Type).icon"></i>
                  <span class="space-left font-weight-medium">
                    {{ getType(item.Type).name }}
                  </span>
                </template>
                <template #item.TLS="{item}">
                  <span class="font-weight-medium">
                  {{ item.TLS === 1 ? __('yes') : __('no') }}
                  </span>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-menu>
                    <template v-slot:activator="{ on: menu }">
                      <v-btn icon v-on="onTooltip({ ...menu })">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list class="pa-0" dense>
                      <v-list-item
                          v-for="action in actions"
                          :key="action.text"
                          @click="action.click(item)"
                      >
                        <v-list-item-icon class="mr-2">
                          <v-icon small>{{ action.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ action.text }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {listEndpoints} from "@/api/endpoints/api";
import TooltipMixin from '@/mixins/Tooltip'
import {getEndpointType} from "@/utils/global";

export default {
  mixins: [TooltipMixin],
  data() {
    return {
      loadingItems: false,
      endpoints: [],
      actions: [
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem
        }
      ],
      headers: [
        {
          text: 'Name',
          value: 'Name'
        },
        {
          text: 'Type',
          value: 'Type'
        },
        {
          text: 'TLS',
          value: 'TLS'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ]
    }
  },
  methods: {
    getType(type) {
      return getEndpointType(type, true)
    },
    handleEditItem({Id}) {
      return this.$router.push('/endpoints/' + Id)
    },
    async handleDeleteItem() {

    },
    async getEndpoints() {
      listEndpoints().then((data) => {
        this.endpoints = data
      })
    }
  },
  created() {
    this.getEndpoints().then(() => {
      setTimeout(() => {
        this.loadingItems = false
      }, 750)
    })
  }
}
</script>