import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { EndpointsService } from '../endpoints.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Endpoint } from 'src/app/types/endpoint.types';
import { DockerDataSharingService } from './services/docker-data-sharing.service';

@Component({
  selector: 'app-endpoints-docker',
  templateUrl: './docker.component.html',
  styleUrl: './docker.component.scss'
})
export class DockerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private endpointsService: EndpointsService,
    private dockerDataSharingService: DockerDataSharingService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.endpointsService.info(this.route.snapshot.paramMap.get('endpointId') as string).subscribe((data) => {
      this.dockerDataSharingService.updateEndpointInfo(data);
      this.cdr.detectChanges();
    });
  }

}
