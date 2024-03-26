import { Component, OnInit } from '@angular/core';
import { EndpointsService } from 'src/app/modules/endpoints/endpoints.service';
import { Endpoint } from 'src/app/types/endpoint.types';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  protected selectedInfo: Endpoint;

  constructor(public endpointsService: EndpointsService) { }

  ngOnInit(): void {
    this.endpointsService.event.subscribe({
      next: (data) => {
        this.selectedInfo = data;
      },
    })
  }

}
