<template>
  <div>
    <v-toolbar flat>
      <v-text-field
        v-model="filter['filter[name]']"
        text
        solo
        flat
        :prepend-icon="showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'"
        append-icon="mdi-magnify"
        placeholder="Type name"
        hide-details
        clearable
        @keyup.enter="$emit('handleApplyFilter')"
        @click:append="$emit('handleApplyFilter')"
        @click:prepend="$emit('showFilter')"
        @click:clear="$emit('handleClear')"
      />
      <v-btn icon color="error" :disabled="selected.length === 0">
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
      <v-btn icon @click="$emit('handleRefreshItems')" class="space-left">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('handleCreateItem')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

    </v-toolbar>
    <v-divider />
    <v-card v-show="showFilter" flat class="grey lighten-4">
      <v-card-text>
        <v-select v-model="filter['filter[type]']" :items="selectTypes" item-value="type" item-text="name"
                  label="Type" outlined/>
        <v-select v-model="filter['filter[tls]']" :items="selectTLS" item-value="id" item-text="name"
                  label="TLS" outlined/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('handleResetFilter')" text>Reset</v-btn>
        <v-btn @click="$emit('handleApplyFilter')" tile color="primary">
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-divider v-if="showFilter"/>
  </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  data () {
    return {
      selectTLS: [
        { id: null, name: 'Any' },
        { id: '0', name: 'No' },
        { id: '1', name: 'Yes' }
      ],
      selectTypes: [
        { type: null, name: 'Any' },
        { type: 'docker', name: 'Docker' },
        { type: 'kubernetes', name: 'Kubernetes' }
      ]

    };
  }
})
export default class EndpointsToolbarComponent extends Vue {
  @Prop(Object) filter;
  @Prop(Boolean) showFilter;
  @Prop(Array) selected;
}
</script>
