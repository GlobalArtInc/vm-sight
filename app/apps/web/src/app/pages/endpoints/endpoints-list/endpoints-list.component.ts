import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Endpoint } from 'src/app/types/endpoint.types';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints-list.component.html',
  styleUrl: './endpoints-list.component.scss',
})
export class EndpointsListComponent implements OnInit, OnDestroy {
  protected isLoading = true;
  protected endpoints: Endpoint[] | null = null;
  protected datatableConfig: DataTables.Settings = {};

  // Reload emitter inside datatable
  protected reloadEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .get('protected/endpoint', { params: dataTablesParameters })
          .subscribe(resp => {
            callback(resp);
          });
      },
      columns: [
        {
          title: 'Name',
          data: 'name',
          render: function (data, type, full) {
            return data;
          },
        },
        {
          title: 'Actived',
          data: 'isActive',
          render: function (data, type, full) {
            const badgeClass = data ? 'badge-success' : 'badge-danger';
            const badgeText = data ? 'Yes' : 'No';

            return `<div class="badge ${badgeClass} fw-bold">${badgeText}</div>`;
          },
        },
        {
          title: 'Connection Type',
          data: 'connectionType',
          render: function (data, type, full) {
            return data;
          },
        },
      ],
    };
  }

  delete(id: number) {
    this.reloadEvent.emit(true);
    // this.apiService.deleteUser(id).subscribe(() => {
    // });
  }

  edit(id: number) {
    // this.aUser = this.apiService.getUser(id);
    // this.aUser.subscribe((user: IUserModel) => {
    //   this.userModel = user;
    // });
  }

  ngOnDestroy(): void {
    this.reloadEvent.unsubscribe();
  }
}
