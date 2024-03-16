import { NavigationGuardNext, Route, RouteMeta } from 'vue-router';
import endpointsService from '@/services/endpoints.service';

export const endpointsResolver = async (to: Route, from: Route, next: NavigationGuardNext) => {
  const meta = to.meta as RouteMeta;
  meta.endpoints = await endpointsService.getEndpoints();
  next();
};

export const endpointResolver = async (to: Route, from: Route, next: NavigationGuardNext) => {
  const meta = to.meta as RouteMeta;
  meta.endpoint = await endpointsService.getEndpoint(to.params.endpointId);
  next();
};
