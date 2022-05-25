<template>
  <div class="page-user">
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
                  placeholder="Type username"
                  v-model="filter['filter[username]']"
                  hide-details
                  clearable
                  @keyup.enter="handleApplyFilter"
                  @click:append="handleApplyFilter"
                  @click:prepend="showFilter = !showFilter"
                  @click:clear="handleClear"
              />
              <v-btn @click="handleRefreshItem" icon>
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn @click="handleCreateItem" icon>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider/>
            <v-card v-show="showFilter" flat class="grey lighten-4">
              <v-card-text>
                <v-btn-toggle
                    v-model="filter['filter[role]']"
                    tile
                    color="deep-purple accent-3"
                >
                  <v-btn value="0">
                    Users
                  </v-btn>
                  <v-btn value="1">
                    Admins
                  </v-btn>
                </v-btn-toggle>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="handleResetFilter" text>Reset</v-btn>
                <v-btn tile @click="handleApplyFilter" color="primary"
                >Apply
                </v-btn
                >
              </v-card-actions>
            </v-card>
            <v-card-text class="pa-0">
              <v-data-table
                  :loading="loadingItems"
                  :headers="headers"
                  :items="items"
                  :footer-props="footerProps"
                  :items-per-page-options="[5]"
                  :items-per-page="itemsPerPage"
                  :username.sync="filter['username']"
                  :page.sync="filter['page']"
                  @update:page="handlePageChanged"
                  item-key="id"
                  show-select
              >
                <template #item.role="{ item }">
                  <span v-if="item.role === 1">
                    Admin
                  </span>
                  <span v-else>
                    User
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
                          @click="action.click(item)">
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
import TooltipMixin from '@/mixins/Tooltip'
import {fetchUsers, deleteUser} from '@/api/users/users'

export default {
  mixins: [TooltipMixin],
  data() {
    return {
      search: '',
      loadingItems: false,
      serverItemsLength: 0,
      itemsPerPage: 50,
      showFilter: false,
      footerProps: {'items-per-page-options': [50, 100]},
      filter: {
        page: 1,
        'filter[username]': null,
        'filter[role]': null
      },
      headers: [
        {
          text: 'Name',
          value: 'username',
          sortable: false
        },
        {
          text: 'Role',
          value: 'role',
          sortable: false
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false
        }
      ],
      items: [],
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
        'filter[username]': null,
        'filter[role]': null
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []

      return fetchUsers(query)
          .then((data) => {
            if (this.filter['filter[role]'] !== null && this.filter['filter[role]'] !== undefined) {
              data = data.filter((i) => i.role === parseInt(this.filter['filter[role]']))
            }
            if (this.filter['filter[username]'] !== null && this.filter['filter[username]'] !== undefined) {
              data = data.filter((i) => i.username.includes(this.filter['filter[username]']))
            }

            this.items = data

            this.serverItemsLength = 0
            this.loadingItems = false
          })
          .catch(() => {
            this.loadingItems = false
          })
    },
    //action
    handleCreateItem() {
      this.$router.push({
        path: '/users/create'
      })
    },
    handleViewItem() {
    },
    handleEditItem({id}) {
      this.$router.push({
        path: `/users/${id}`
      })
    },
    handleDeleteItem({id}) {
      this.loadingItems = true
      deleteUser(id).then((data) => {
        this.fetchRecords(this.filter)
        window._VMA.$emit('SHOW_SNACKBAR', {
          text: data.message,
          color: 'success'
        })
        setTimeout(() => this.loadingItems = false, 500)
      }).catch((err) => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          text: err.response.data.message,
          color: 'error'
        })
        setTimeout(() => this.loadingItems = false, 500)
      })
    },
    handleSubmit() {
    },
    handleRefreshItem() {
      this.fetchRecords(this.filter)
    },
    // filter
    async handlePageChanged(page) {
      this.filter.page = page
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
    async handleResetFilter() {
      this.filter = {
        page: 1,
        'filter[username]': null,
        'filter[role]': null
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
    }
  }
}
</script>
