import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelpersService } from 'src/app/modules/helpers/helpers.service';
import { EndpointsService } from '../../endpoints.service';
import { Endpoint } from 'src/app/types/endpoint.types';
import { Subscription } from 'rxjs';
import { DockerDataSharingService } from '../services/docker-data-sharing.service';

@Component({
  selector: 'app-endpoints-docker-dashboard',
  templateUrl: './docker-dashboard.component.html',
  styleUrl: './docker-dashboard.component.scss',
})
export class DockerDashboardComponent implements OnInit, OnDestroy {
  protected endpointInfo: Endpoint;
  protected isLoading = true;
  protected subscription: Subscription[];

  constructor(
    private dockerDataSharingService: DockerDataSharingService,
    protected helpersService: HelpersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscription = [
      this.dockerDataSharingService.endpointInfo$.subscribe(endpointInfo => {
        if (endpointInfo) {
          this.endpointInfo = endpointInfo as Endpoint;
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      })
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sb) => sb.unsubscribe());
  }
}
