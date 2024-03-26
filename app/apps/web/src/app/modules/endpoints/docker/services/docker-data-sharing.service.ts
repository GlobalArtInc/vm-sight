import { Injectable } from "@angular/core";
import { Container } from "dockerode";
import { BehaviorSubject, filter } from "rxjs";
import { Endpoint } from "src/app/types/endpoint.types";

@Injectable({
  providedIn: 'root'
})
export class DockerDataSharingService {
  private endpointInfoSource = new BehaviorSubject<Endpoint | null>(null);
  private endpointContainersSource = new BehaviorSubject<Container[] | null>(null);
  endpointInfo$ = this.endpointInfoSource.asObservable().pipe(filter((containers) => containers !== null));
  endpointContainers$ = this.endpointContainersSource.asObservable().pipe(filter((containers) => containers !== null));

  updateEndpointInfo(endpointInfo: Endpoint) {
    this.endpointInfoSource.next(endpointInfo);
  }

  updateEndpointContainers(containers: Container[]) {
    this.endpointContainersSource.next(containers);
  }
}
