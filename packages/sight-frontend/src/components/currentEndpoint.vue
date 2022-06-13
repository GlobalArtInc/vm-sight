<template>
  <div v-if="endpoint !== null">
  <v-subheader v-text="endpoint.name" />
  <template v-if="[1, 2].indexOf(endpoint.type) !== -1">
    <v-list>
      <v-list-item :to="`/${endpoint.endpointId}/docker/dashboard`">
        <v-list-item-icon>
          <font-awesome-icon class="v-icon" :icon="icon.faDashboard" />
        </v-list-item-icon>
        <v-list-item-content>
          Dashboard
        </v-list-item-content>
      </v-list-item>

      <v-list-item :to="`/${endpoint.endpointId}/docker/containers`">
        <v-list-item-icon>
          <font-awesome-icon class="v-icon" :icon="icon.faCubes" />
        </v-list-item-icon>
        <v-list-item-content>
          Containers
        </v-list-item-content>
      </v-list-item>

      <v-list-item :to="`/${endpoint.endpointId}/docker/images`">
        <v-list-item-icon>
          <font-awesome-icon class="v-icon" :icon="icon.faCopy" />
        </v-list-item-icon>
        <v-list-item-content>
          Images
        </v-list-item-content>
      </v-list-item>

      <v-list-item :to="`/${endpoint.endpointId}/docker/networks`">
        <v-list-item-icon>
          <font-awesome-icon class="v-icon" :icon="icon.faSitemap" />
        </v-list-item-icon>
        <v-list-item-content>
          Networks
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Endpoint } from '@sight-types';
import { faDashboard, faCubes, faCopy, faSitemap } from '@fortawesome/free-solid-svg-icons';

@Component
export default class CurrentEndpointComponent extends Vue {
  @Prop({ default: null }) endpoint?: Endpoint | null;
  icon = { faDashboard, faCubes, faCopy, faSitemap };
}
</script>
