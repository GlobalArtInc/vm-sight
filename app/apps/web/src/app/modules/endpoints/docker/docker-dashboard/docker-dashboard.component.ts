import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelpersService } from 'src/app/modules/helpers/helpers.service';
import { EndpointsService } from '../../endpoints.service';
import { Endpoint } from 'src/app/types/endpoint.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-endpoints-docker-dashboard',
  templateUrl: './docker-dashboard.component.html',
  styleUrl: './docker-dashboard.component.scss',
})
export class DockerDashboardComponent implements OnInit, OnDestroy {
  protected endpointInfo: Endpoint;
  protected isLoading = true;
  private subscription: Subscription[];

  constructor(
    private cdr: ChangeDetectorRef,
    private endpointsService: EndpointsService,
    protected helpersService: HelpersService,
  ) {}

  ngOnInit() {
    this.subscription = [
      this.endpointsService.event.subscribe((data) => {
        this.isLoading = false;
        this.endpointInfo = data;
        this.cdr.detectChanges();
      })
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
