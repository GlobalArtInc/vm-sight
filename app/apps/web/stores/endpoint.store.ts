import { defineStore } from 'pinia';
import type { Endpoint } from '~/types/endpoint.types';

export const useEndpointStore = defineStore('endpointStore', {
  state: () => ({
    endpoints: [] as Endpoint[],
  }),
  actions: {
    async fetchEndpoints() {
      const response = await $fetch<Endpoint[]>('/api/protected/endpoint');
      this.endpoints = response;
    },
  },
});
