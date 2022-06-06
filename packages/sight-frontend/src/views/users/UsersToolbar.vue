<template>
  <div>
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
        @keyup.enter="$emit('handleApplyFilter')"
        @click:append="$emit('handleApplyFilter')"
        @click:prepend="$emit('showFilter')"
        @click:clear="$emit('handleClear')"
      />
      <v-btn @click="$emit('handleRefreshItems')" icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn @click="$emit('handleCreateItem')" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <!--  Aside card  -->
    <v-divider/>
    <v-card v-show="showFilter" flat class="grey lighten-4">
      <v-card-text>
        <v-btn-toggle
          v-model="filter['filter[role]']"
          tile
          color="deep-purple accent-3">
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
        <v-btn @click="$emit('handleResetFilter')" text>Reset</v-btn>
        <v-btn tile @click="$emit('handleApplyFilter')" color="primary"
        >Apply
        </v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class UsersToolbarComponent {
  @Prop(Object) filter;
  @Prop(Boolean) showFilter;
}
</script>
