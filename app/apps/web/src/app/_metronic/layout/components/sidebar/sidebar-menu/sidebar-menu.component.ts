import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DockerDataSharingService } from 'src/app/pages/endpoints/docker/services/docker-data-sharing.service';
import { EndpointsService } from 'src/app/pages/endpoints/endpoints.service';
import { Endpoint } from 'src/app/types/endpoint.types';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
  protected selectedEndpoint: Endpoint;
  private subscribtion: Subscription[];

  constructor(
    public dockerDataSharingService: DockerDataSharingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribtion = [
      this.dockerDataSharingService.endpointInfo$.subscribe(data => {
        this.selectedEndpoint = data as Endpoint;
        this.cdr.detectChanges();
      }),
    ];
  }

  ngOnDestroy(): void {
    this.subscribtion.forEach(sb => sb.unsubscribe());
  }
}
