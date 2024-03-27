import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { DockerDataSharingService } from '../services/docker-data-sharing.service';
import { EndpointsService } from '../../endpoints.service';
import { Container, Endpoint } from 'src/app/types/endpoint.types';

@Component({
  selector: 'app-docker-containers',
  templateUrl: './docker-containers.component.html',
  styleUrl: './docker-containers.component.scss'
})
export class DockerContainersComponent implements OnInit, OnDestroy {
  protected endpointInfo: Endpoint;
  protected containers: Container[];
  protected isLoading = true;
  displayedColumns: string[] = ['Name', 'State', 'Image', 'Created', 'Ports'];

  private subscription: Subscription[];
  
  
  constructor(
    private dockerDataSharingService: DockerDataSharingService,
    private endpointsService: EndpointsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscription = [
      this.dockerDataSharingService.endpointInfo$.pipe(
        switchMap((endpointInfo) => {
          this.endpointInfo = endpointInfo as Endpoint;
          return this.endpointsService.exec(endpointInfo?.id as string, { func: 'containers', action: 'list' });
        })
      ).subscribe((containers) => {
        this.containers = containers as Container[];
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sb) => sb.unsubscribe());
  }
}
