import { defineStore } from "pinia"
import type { Endpoint } from "~/types/endpoint.types";

export const useAppStore = defineStore('appStore', {
  state: () => ({
    selectedEndpoint: null,
  }),
  actions: {
    setEndpoint(endpoint: Endpoint) {
      this.selectedEndpoint = endpoint;
    },
  },
  getters: {
    selectedEndpoint: state => state.selectedEndpoint,  
  }
})