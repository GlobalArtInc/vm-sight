import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { DockerDataSharingService } from '../services/docker-data-sharing.service';
import { EndpointsService } from '../../endpoints.service';
import { Endpoint } from 'src/app/types/endpoint.types';

@Component({
  selector: 'app-docker-images',
  templateUrl: './docker-images.component.html',
  styleUrl: './docker-images.component.scss'
})
export class DockerImagesComponent  implements OnInit, OnDestroy {
  protected endpointInfo: Endpoint;
  protected images: any[];
  protected isLoading = true;
  displayedColumns: string[] = ['Id', 'RepoTags', 'Size', 'Created'];
  
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
          return this.endpointsService.exec(endpointInfo?.id as string, { func: 'images', action: 'list' });
        })
      ).subscribe((images) => {
        this.images = images as any[];
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sb) => sb.unsubscribe());
  }
}
