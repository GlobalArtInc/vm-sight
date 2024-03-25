import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, from, debounceTime, switchMap, concatMap, delay, of } from 'rxjs';
import { DockerDataSharingService } from '../services/docker-data-sharing.service';
import { EndpointsService } from '../../endpoints.service';
import { Container, Endpoint } from 'src/app/types/endpoint.types';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-docker-containers',
  templateUrl: './docker-containers.component.html',
  styleUrl: './docker-containers.component.scss'
})
export class DockerContainersComponent implements OnInit, OnDestroy {
  protected endpointInfo: Endpoint;
  protected containers: Container[];
  protected isLoading = true;
  protected isActionInProgress = false;
  protected displayedColumns: string[] = ['select', 'Name', 'State', 'Image', 'Created', 'Ports'];
  protected selection = new SelectionModel<Container>(true, []);
  private subscription: Subscription[];
  
  constructor(
    private dockerDataSharingService: DockerDataSharingService,
    private endpointsService: EndpointsService,
    private httpClient: HttpClient,
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.containers.length;
    return numSelected === numRows;
  }
  
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.containers);
  }
  
  checkboxLabel(row?: Container): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id}`;
  }

  executeAction(action: string) {
    const selectedContainers = this.selection.selected;
    this.isActionInProgress = true;
    from(selectedContainers).pipe(
      concatMap((container) =>
        of(container).pipe(
          delay(250),
          switchMap((container) =>
            this.endpointsService.exec(this.endpointInfo?.id as string, {
              func: 'containers',
              action: action,
              params: { id: container.Id },
            })
          )
        )
      )
    ).subscribe(() => {
      this.endpointsService.exec(this.endpointInfo?.id as string, { func: 'containers', action: 'list' }).subscribe((containers) => {
        this.containers = containers as Container[];
        this.isActionInProgress = false;
        this.selection.clear();
        this.cdr.detectChanges();
      });
    });
  }
}
