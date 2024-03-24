<script setup lang="ts">
import { faTachometerAlt, faMicrochip, faMemory } from '@fortawesome/free-solid-svg-icons';

const { endpoint } = defineProps(['endpoint']);
const icon = {
  faTachometerAlt,
  faMicrochip,
  faMemory,
};
</script>

<template>
  <v-card>
    <v-card-title style="background: #f6f6f6">
      <font-awesome-icon :icon="icon.faTachometerAlt" />
      <span class="pl-2" style="color: #333">Info</span>
    </v-card-title>
    <v-divider />
    <v-card-text style="padding: 0">
      <v-table v-if="endpoint" density="compact" class="font-weight-medium">
        <tbody>
          <tr>
            <td style="width: 30%">Endpoint</td>
            <td>
              {{ endpoint.name }}
              <font-awesome-icon :icon="icon.faMicrochip" class="space-left" />
              {{ endpoint.serviceInfo.NCPU }}
              <font-awesome-icon :icon="icon.faMemory" class="space-left" />
              {{ ByteToSize(endpoint.serviceInfo.MemTotal) }}
              {{ endpoint.serviceInfo.Swarm === 'active' ? 'Swarm' : 'Standalone' }}
              {{ endpoint.serviceInfo.DockerVersion }}
            </td>
          </tr>
          <tr>
            <td style="width: 30%">URL</td>
            <td v-if="endpoint.public_url">{{ endpoint.public_url }}</td>
            <td v-else>none</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
