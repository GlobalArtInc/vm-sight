import { defineStore } from 'pinia';
import type { Endpoint } from '~/types/endpoint.types';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    selectedEndpoint: null,
  }),
  actions: {
    async fetchEndpoint(endpointId: string) {
      const response = await $fetch<Endpoint>(`/api/protected/endpoint/${endpointId}`);

      this.selectedEndpoint = response;
    },
    setEndpoint(endpoint: Endpoint) {
      this.selectedEndpoint = endpoint;
    },
  },
});
