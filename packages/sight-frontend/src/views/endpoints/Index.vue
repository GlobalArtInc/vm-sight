<template>
  <div class="page-endpoints">
    <v-container class="main-container">
      <v-row>
        <v-col cols="12">
          <v-card tile>
            <EndpointsToolbar
              :filter="filter"
              @showFilter="showFilter = !showFilter"
              @handleApplyFilter="handleApplyFilter"
              @handleClear="handleClear"
              @handleRefreshItems="handleRefreshItems"
              @handleCreateItem="handleCreateItem"
              @handleResetFilter="handleResetFilter"
              :show-filter="showFilter"
              :selected="selected"
            />
            <v-data-table
              v-model="selected"
              :search="search"
              :headers="headers"
              :items="items"
              :items-per-page="50"
              :footer-props="footerProps"
              :loading="loadingItems"
              show-select
              item-key="id">
              <template #item.type="{item}">
                <font-awesome-icon :icon="getType(item.type).icon"/>
                <span class="space-left font-weight-medium">
                    {{ getType(item.type).name }}
                </span>
              </template>
              <template #item.tls="{item}">
                  <span class="font-weight-medium">
                  {{ item.tls === 1 ? 'Yes' : 'No' }}
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
import { Component, Vue } from 'vue-property-decorator';
import { getEndpointType } from '@/utils/endpoints';
import TooltipMixin from '@/mixins/Tooltip';
import endpointsService from '@/services/endpoints.service';
import EndpointsToolbar from '@/views/endpoints/EndpointsToolbar';

@Component({
  components: { EndpointsToolbar },
  mixins: [TooltipMixin],
  data () {
    return {
      showFilter: false,
      loadingItems: false,
      items: [],
      selected: [],
      search: '',
      footerProps: { 'items-per-page-options': [50, 100] },
      filter: {
        page: 1,
        'filter[name]': null,
        'filter[type]': null,
        'filter[tls]': null
      },
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
          value: 'name',
          sortable: false
        },
        {
          text: 'Type',
          value: 'type',
          sortable: false
        },
        {
          text: 'TLS',
          value: 'tls',
          sortable: false
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false
        }
      ]
    };
  },
  created () {
    this.items = this.$route.meta.endpoints;
  }
})
export default class EndpointsIndexView extends Vue {
  handleDeleteItem ({ id }) {
    endpointsService.deleteEndpoint(id).then(async () => {
      this.items = await endpointsService.getEndpoints();
      this.$toast.success('Endpoint has been deleted');
    }).catch((err) => {
      this.$toast.error(err.response.data.message ?? 'An error occurred');
    }).finally(() => {
      this.loadingItems = false;
    });
  }

  handleEditItem ({ id }) {
    return this.$router.push('/endpoints/' + id);
  }

  getType (typeId) {
    return getEndpointType(typeId);
  }

  handleRefreshItems () {
    this.loadingItems = true;
    endpointsService.getEndpoints().then((endpoints) => {
      this.items = endpoints;
      this.loadingItems = false;
    });
  }

  handleCreateItem () {
    return this.$router.push('/endpoints/create');
  }

  handleResetFilter () {
    //
  }

  handleApplyFilter () {
    //
  }

  handleClear () {
    //
  }
}
</script>
