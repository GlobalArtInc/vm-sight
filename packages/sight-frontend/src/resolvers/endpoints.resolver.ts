import { Route } from 'vue-router';
import endpointsService from '@/services/endpoints.service';

export const endpointsResolver = async (to: any, from: Route, next: any) => {
  to.meta.endpoints = await endpointsService.getEndpoints();
  next();
};
