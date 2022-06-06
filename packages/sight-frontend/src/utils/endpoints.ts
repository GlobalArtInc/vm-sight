import { faDocker } from '@fortawesome/free-brands-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

export function getEndpointType (typeId: number) {
  switch (typeId) {
    case 1:
      return {
        icon: faDocker,
        name: 'Docker'
      };
    case 2:
      return {
        icon: faDocker,
        name: 'Docker (via Socket)'
      };
    default:
      return {
        icon: faQuestion,
        name: 'unknown'
      };
  }
}
