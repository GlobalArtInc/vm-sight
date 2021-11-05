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
                  :prepend-icon="showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'"
                  append-icon="mdi-magnify"
                  placeholder="Type name"
                  hide-details
                  clearable
                  @keyup.enter="handleApplyFilter"
                  @click:append="handleApplyFilter"
                  @click:prepend="showFilter = !showFilter"
                  @click:clear="handleClear"
              />
              <v-btn icon color="error" :disabled="selected.length === 0" @click="handleDeleteItems(selected)">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
              <v-btn icon @click="handleRefreshItems" class="space-left">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn icon @click="handleCreateItem">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider/>

            <v-card v-show="showFilter" flat class="grey lighten-4">
              <v-card-text>
                <v-select v-model="filter['filter[type]']" :items="selectTypes" item-value="type" item-text="name"
                          label="Type" outlined/>
                <v-select v-model="filter['filter[tls]']" :items="selectTLS" item-value="id" item-text="name"
                          label="TLS" outlined/>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="handleResetFilter" text>Reset</v-btn>
                <v-btn @click="handleApplyFilter" tile color="primary">
                  Apply
                </v-btn>
              </v-card-actions>
            </v-card>

            <v-divider v-if="showFilter"/>
            <v-data-table
                v-model="selected"
                :search="search"
                :loading="loadingItems"
                :headers="headers"
                :items="items"
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
import {getEndpointType} from "../../utils/global";
import TooltipMixin from '@/mixins/Tooltip'

export default {
  mixins: [TooltipMixin],
  data() {
    return {
      loadingItems: false,
      showFilter: false,
      items: [],
      selected: [],
      search: "",
      filter: {
        page: 1,
        'filter[name]': null,
        'filter[type]': null,
        'filter[tls]': null
      },
      selectTLS: [
        {id: null, name: "Any"},
        {id: 0, name: "No"},
        {id: 1, name: "Yes"}
      ],
      selectTypes: [
        {type: null, name: 'Any'},
        {type: 'docker', name: 'Docker'}
      ],
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
          value: 'Name',
          sortable: false
        },
        {
          text: 'Type',
          value: 'Type',
          sortable: false
        },
        {
          text: 'TLS',
          value: 'TLS',
          sortable: false
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false
        }
      ]
    }
  },
  watch: {
    '$route.query': {
      handler(query) {
        const filter = this.updateFilterQuery(query)
        this.fetchRecords(filter)
      },
      immediate: true
    }
  },
  methods: {
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, query)
      filter.page = parseInt(filter.page)
      return filter
    },
    resetFilter() {
      this.filter = {
        page: 1,
        'filter[name]': null,
        'filter[type]': null,
        'filter[tls]': null
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      listEndpoints(query).then((data) => {
        this.loadingItems = false
        this.items = data
      })
    },
    handleRefreshItem() {
      this.fetchRecords(this.filter)
    },
    async handleResetFilter() {
      this.filter = {
        page: 1,
        'filter[name]': null,
        'filter[type]': null,
        'filter[tls]': null
      }
      try {
        await this.$router.replace({
          path: this.$route.path
        })
      } catch (err) {
        //
      } finally {
        this.showFilter = false
      }
    },
    async handleApplyFilter() {
      try {
        await this.$router.replace({
          path: this.$route.path,
          query: this.filter
        })
      } catch (err) {
        //
      } finally {
        this.showFilter = false
      }
    },
    async handleClear() {
      this.resetFilter()
      try {
        await this.$router.replace({
          path: this.$route.path,
          query: this.filter
        })
      } catch (err) {
        //
      } finally {
        this.showFilter = false
      }
    },
    handleRefreshItems() {

    },
    handleCreateItem() {
      this.$router.push({
        path: '/endpoints/create'
      })
    },
    async handleDeleteItems(ids) {
      for (let i = 0; i < ids.length; i++) {
        if (ids.length - 1 === i) {
          deleteEndpoint(ids[i].Id).then(() => {
            this.selected = []
            //this.getEndpoints()
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
    getType(type) {
      return getEndpointType(type, true)
    },
    // handleRefreshItems() {
    //   this.loadingItems = true
    //   listEndpoints().then((data) => {
    //     this.endpoints = data
    //     setTimeout(() => {
    //       this.loadingItems = false
    //     }, 500)
    //   })
    // },
    // handleCreateItem() {
    //   this.$router.push({
    //     path: '/endpoints/create'
    //   })
    // },
    // getType(type) {
    //   return getEndpointType(type, true)
    // },
    // handleEditItem({Id}) {
    //   return this.$router.push('/endpoints/' + Id)
    // },
    // async handleDeleteItems(ids) {
    //   for (let i = 0; i < ids.length; i++) {
    //     if (ids.length - 1 === i) {
    //       deleteEndpoint(ids[i].Id).then(() => {
    //         this.selected = []
    //         this.getEndpoints()
    //       })
    //     } else {
    //       await deleteEndpoint(ids[i].Id)
    //     }
    //   }
    // },
    // async handleDeleteItem({Id}) {
    //   this.loadingItems = true
    //   deleteEndpoint(Id).then(() => {
    //     listEndpoints().then((data) => {
    //       this.endpoints = data
    //       setTimeout(() => {
    //         this.loadingItems = false
    //       }, 500)
    //     })
    //   })
    // },
    // async getEndpoints() {
    //   listEndpoints().then((data) => {
    //     this.endpoints = data
    //   })
    // }
  },
  async created() {
    try {
      await this.getEndpoints()
    } catch (err) {
      //
    } finally {
      setTimeout(() => {
        this.loadingItems = false
      }, 750)
    }
  }
}
</script>
