<template>
  <div class="page-endpoints">
    <v-container class="main-container">
      <v-row>
        <v-col cols="12">
          <v-card tile>
            <v-card-subtitle class="font-weight-medium" style="color: #333">
              <i class="fa fa-cubes"></i>
              <span class="font-weight-medium pl-1" style="color: #333">Endpoints</span>
              <v-btn icon @click="handleRefreshItems" class="space-left">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn icon @click="handleCreateItem">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-subtitle>
            <v-divider/>
            <v-card-subtitle>
              <v-btn color="error" :disabled="selected.length === 0" @click="handleDeleteItems(selected)">
                <v-icon left>
                  mdi-delete
                </v-icon>
                <span>
                  Delete
                </span>
              </v-btn>
              <v-btn color="primary" class="ml-3" @click="handleCreateItem">
                <v-icon left>
                  mdi-plus
                </v-icon>
                <span>
                  Add Endpoint
                </span>
              </v-btn>
            </v-card-subtitle>
            <v-divider/>
            <v-text-field
                dense
                v-model="search"
                text
                solo
                flat
                prepend-inner-icon="mdi-magnify"
                placeholder="Type something"
                hide-details
                clearable
            />
            <v-divider/>
            <v-data-table
                v-model="selected"
                :search="search"
                :loading="loadingItems"
                :headers="headers"
                :items="endpoints"
                :items-per-page-options="[15, 30, 50]"
                :items-per-page="10"
                show-select
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
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {listEndpoints, deleteEndpoint} from "@/api/endpoints/api";
import TooltipMixin from '@/mixins/Tooltip'
import {getEndpointType} from "@/utils/global";

export default {
  mixins: [TooltipMixin],
  data() {
    return {
      loadingItems: false,
      endpoints: [],
      selected: [],
      search: "",
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
    handleRefreshItems() {
      this.loadingItems = true
      listEndpoints().then((data) => {
        this.endpoints = data
        setTimeout(() => {
          this.loadingItems = false
        }, 500)
      })
    },
    handleCreateItem() {
      this.$router.push({
        path: '/endpoints/create'
      })
    },
    getType(type) {
      return getEndpointType(type, true)
    },
    handleEditItem({Id}) {
      return this.$router.push('/endpoints/' + Id)
    },
    async handleDeleteItems(ids) {
      for (let i = 0; i < ids.length; i++) {
        if (ids.length - 1 === i) {
          deleteEndpoint(ids[i].Id).then(() => {
            this.selected = []
            this.getEndpoints()
          })
        } else {
          await deleteEndpoint(ids[i].Id)
        }
      }
    },
    async handleDeleteItem({Id}) {
      this.loadingItems = true
      deleteEndpoint(Id).then(() => {
        listEndpoints().then((data) => {
          this.endpoints = data
          setTimeout(() => {
            this.loadingItems = false
          }, 500)
        })
      })
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
