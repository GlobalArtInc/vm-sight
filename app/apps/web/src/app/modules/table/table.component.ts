import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @Input() datatableConfig: DataTables.Settings = {};

  protected dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      dom:
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      processing: true,
      ...this.datatableConfig,
    };
  }
}
