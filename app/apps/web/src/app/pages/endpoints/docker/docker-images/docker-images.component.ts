import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, concatMap, delay, from, of, switchMap } from 'rxjs';
import { DockerDataSharingService } from '../services/docker-data-sharing.service';
import { EndpointsService } from '../../endpoints.service';
import { Endpoint } from 'src/app/types/endpoint.types';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-docker-images',
  templateUrl: './docker-images.component.html',
  styleUrl: './docker-images.component.scss',
})
export class DockerImagesComponent implements OnInit, OnDestroy {
  protected endpointInfo: Endpoint;
  protected images: any[];
  protected isLoading = true;
  protected isActionInProgress = false;
  protected displayedColumns: string[] = [
    'select',
    'Id',
    'RepoTags',
    'Size',
    'Created',
  ];
  protected selection = new SelectionModel<any>(true, []);

  private subscription: Subscription[];

  constructor(
    private dockerDataSharingService: DockerDataSharingService,
    private endpointsService: EndpointsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = [
      this.dockerDataSharingService.endpointInfo$
        .pipe(
          switchMap(endpointInfo => {
            this.endpointInfo = endpointInfo as Endpoint;
            return this.endpointsService.exec(endpointInfo?.id as string, {
              func: 'images',
              action: 'list',
            });
          })
        )
        .subscribe(images => {
          this.images = images as any[];
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
    ];
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sb => sb.unsubscribe());
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.images.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.images);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id}`;
  }

  execFn(action: string, params?: Record<string, unknown>) {
    const selectedContainers = this.selection.selected;
    this.isActionInProgress = true;
    from(selectedContainers)
      .pipe(
        concatMap(image =>
          of(image).pipe(
            delay(250),
            switchMap(image =>
              this.endpointsService.exec(this.endpointInfo?.id as string, {
                func: 'images',
                action: action,
                params: { id: image.Id, ...params },
              })
            )
          )
        )
      )
      .subscribe(() => {
        this.endpointsService
          .exec(this.endpointInfo?.id as string, {
            func: 'images',
            action: 'list',
          })
          .subscribe(images => {
            this.images = images as any[];
            this.isActionInProgress = false;
            this.selection.clear();
            this.cdr.detectChanges();
          });
      });
  }
}
