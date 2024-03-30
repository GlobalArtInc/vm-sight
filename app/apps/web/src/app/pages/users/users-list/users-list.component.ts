import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  protected datatableConfig: DataTables.Settings = {};

  ngOnInit(): void {
    this.datatableConfig = {
      serverSide: false,
      data: [
        { name: 'dev', field2: 'field1-2' },
        { name: 'dev2', field2: 'field2-2' },
      ],
      columns: [
        {
          title: 'Name',
          data: 'name',
        },
        {
          title: 'Field 2',
          data: 'field2',
        },
      ],
    };
  }
}
