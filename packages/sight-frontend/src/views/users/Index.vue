<template>
  <div class="page-user">
    <v-container class="main-container">
      <v-row>
        <v-col cols="12">
          <v-card tile>
            <UsersToolbar :filter="filter" :show-filter="showFilter"
                          @handleApplyFilter="handleApplyFilter"
                          @showFilter="showFilter = !showFilter"
                          @handleClear="handleClear"
                          @handleRefreshItems="handleRefreshItem"
                          @handleCreateItem="handleCreateItem"
                          @handleResetFilter="handleResetFilter"
            />
            <v-card-text class="pa-0">
              <v-data-table
                :loading="loadingItems"
                :headers="headers"
                :items="items"
                :footer-props="footerProps"
                :items-per-page-options="[5]"
                :items-per-page="itemsPerPage"
                :email.sync="filter['email']"
                :page.sync="filter['page']"
                @update:page="handlePageChanged"
                item-key="id"
              >
                <template #item.index="{item, index}">
                  {{ index + 1 }}
                </template>
                <template #item.role="{ item }">
                  <span v-if="item.role === 100">
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
                      <template v-for="action in actions">
                        <v-list-item
                          :key="action.text"
                          @click="action.click(item)"
                          v-if="action.condition(item.id)"
                        >
                          <v-list-item-icon class="mr-2">
                            <v-icon small>{{ action.icon }}</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>{{ action.text }}</v-list-item-title>
                        </v-list-item>
                      </template>
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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import TooltipMixin from '@/mixins/Tooltip';
import usersService from '@/services/users.service';
import UsersToolbar from '@/views/users/UsersToolbar';

@Component({
  components: { UsersToolbar },
  mixins: [TooltipMixin],
  data () {
    return {
      search: '',
      loadingItems: false,
      serverItemsLength: 0,
      itemsPerPage: 50,
      showFilter: false,
      footerProps: { 'items-per-page-options': [50, 100] },
      filter: {
        page: 1,
        'filter[email]': null,
        'filter[role]': null
      },
      headers: [
        {
          text: '#',
          value: 'index',
          sortable: false
        },
        {
          text: 'Name',
          value: 'email',
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
          click: this.handleEditItem,
          condition: (id) => {
            return id;
          }
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
          condition: (id) => {
            return this.user.id !== id;
          }
        }
      ]
    };
  },
  created () {
    this.fetchRecords();
  },
  watch: {
    '$route.query': {
      handler (query) {
        this.updateFilterQuery(query);
        this.fetchRecords();
      },
      immediate: true
    }
  }

})
export default class UsersIndexView extends Vue {
  @Getter('user', { namespace: 'auth' }) user;

  async fetchRecords (pull = false) {
    let users = pull ? await usersService.getUsers() : this.$route.meta.users;
    if (this.filter['filter[role]'] !== null && this.filter['filter[role]'] !== undefined) {
      users = users.filter((i) => i.role === parseInt(this.filter['filter[role]']));
    }
    if (this.filter['filter[email]'] !== null && this.filter['filter[email]'] !== undefined) {
      users = users.filter((i) => i.email.includes(this.filter['filter[email]']));
    }

    this.items = users;

    this.serverItemsLength = 0;
    this.loadingItems = false;
  }

  resetFilter () {
    this.filter = {
      page: 1,
      'filter[email]': null,
      'filter[role]': null
    };
  }

  updateFilterQuery (query) {
    const filter = Object.assign(this.filter, query);
    filter.page = parseInt(filter.page);
    return filter;
  }

  handleEditItem ({ id }) {
    return this.$router.push('/users/' + id);
  }

  handleDeleteItem ({ id }) {
    this.loadingItems = true;
    usersService.deleteUser(id).then(async () => {
      await this.fetchRecords(true);
      this.$toast.success('User has been deleted');
    }).catch((err) => {
      this.$toast.error(err);
    }).finally(() => {
      this.loadingItems = false;
    });
  }

  async handleApplyFilter () {
    try {
      await this.$router.replace({
        path: this.$route.path,
        query: this.filter
      });
    } catch (err) {
      //
    } finally {
      this.showFilter = false;
    }
  }

  async handlePageChanged () {
    this.resetFilter();
    try {
      await this.$router.replace({
        path: this.$route.path,
        query: this.filter
      });
    } catch (err) {
      //
    } finally {
      this.showFilter = false;
    }
  }

  async handleResetFilter () {
    this.filter = {
      page: 1,
      'filter[email]': null,
      'filter[role]': null
    };
    try {
      await this.$router.replace({
        path: this.$route.path
      });
    } catch (err) {
      //
    } finally {
      this.showFilter = false;
    }
  }

  async handleClear () {
    this.resetFilter();
    try {
      await this.$router.replace({
        path: this.$route.path,
        query: this.filter
      });
    } catch (err) {
      //
    } finally {
      this.showFilter = false;
    }
  }

  handleRefreshItem () {
    this.loadingItems = true;
    this.fetchRecords(true).catch(() => {
      this.$toast.error('An error occursd');
    }).finally(() => {
      this.loadingItems = false;
    });
  }

  handleCreateItem () {
    return this.$router.push({
      path: '/users/create'
    });
  }
}
</script>
