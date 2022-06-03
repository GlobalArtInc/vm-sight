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
              >
                <template #item.index="{item, index}">
                  {{ index + 1 }}
                </template>
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

<script>
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import TooltipMixin from '@/mixins/Tooltip';
import usersService from '@/services/users.service';

@Component({
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
        'filter[username]': null,
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
          click: this.handleEditItem,
          condition: () => {
            return true;
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
    this.items = this.$route.meta.users;
  }

})
export default class UsersIndexView extends Vue {
  @Getter('user', { namespace: 'auth' }) user;
  handleEditItem ({ id }) {
    return this.$router.push('/users/' + id);
  }

  handleDeleteItem ({ id }) {
    this.loadingItems = true;
    usersService.deleteUser(id).then(async () => {
      this.items = await usersService.getUsers();
      this.$toast.success('User has been deleted');
    }).catch((err) => {
      this.$toast.error(err.response.data.message);
    }).finally(() => {
      this.loadingItems = false;
    });
  }

  handleApplyFilter () {
    return true;
  }

  handlePageChanged () {
    return true;
  }

  handleResetFilter () {
    return true;
  }

  handleClear () {
    return true;
  }

  handleRefreshItem () {
    this.loadingItems = true;
    usersService.getUsers().then((users) => {
      this.items = users;
    }).catch(() => {
      this.$toast.error('An error occurred');
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
