import { NavigationGuardNext, Route } from 'vue-router';
import endpointsService from '@/services/endpoints.service';
import dockerService from '@/services/docker.service';
import { Vue } from 'vue-property-decorator';
import { AxiosError } from 'axios';

export type dockerResolverActionsTypes = 'endpoint' | 'containers' | 'container' | 'networks'

export const dockerResolver = async (actions: dockerResolverActionsTypes[], to: Route, from: Route, next: NavigationGuardNext) => {
  try {
    for (const action of actions) {
      let data;
      switch (action) {
        case 'endpoint':
          data = await endpointsService.getEndpoint(to.params.endpointId);
          break;
        case 'containers':
          data = await dockerService.getContainers(to.params.endpointId);
          break;
        case 'container':
          data = await dockerService.getContainerById(to.params.endpointId, to.params.id);
          break;
        case 'networks':
          data = await dockerService.getNetworks(to.params.endpointId);
          break;
        default:
          console.log(`${action} don't implemented`);
          break;
      }
      if (to.meta) { to.meta[action] = data; }
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      Vue.$toast.error(err.response?.data.message ?? 'An error occurred');
    }
    next('/dashboard');
  }
  next();
};
