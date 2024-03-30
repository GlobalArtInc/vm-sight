import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import {
  Observable,
  Subscription,
  map,
  merge,
  pipe,
  startWith,
  switchMap,
} from 'rxjs';
import { HelpersService } from 'src/app/modules/helpers/helpers.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['endpoint'];
  dataSource: any = [];
  isLoadingResults = true;
  endpointsDatabase: EndpointsHttpDatabase | null;

  constructor(
    private _httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
    public helpersService: HelpersService
  ) {}

  ngOnInit() {
    this.endpointsDatabase = new EndpointsHttpDatabase(this._httpClient);

    this.endpointsDatabase!.fetch()
      .pipe(
        map(res => {
          this.isLoadingResults = false;
          this.dataSource = new MatTableDataSource(res.data);
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }
}

export class EndpointsHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  fetch(): Observable<any> {
    return this._httpClient.get<any>('protected/endpoint');
  }
}
