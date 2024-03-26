import { Component, OnInit } from '@angular/core';
import { EndpointsService } from '../endpoints.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-endpoints-docker',
  templateUrl: './docker.component.html',
  styleUrl: './docker.component.scss'
})
export class DockerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private endpointsService: EndpointsService,
    ) { }

  ngOnInit() {
    this.endpointsService.info(this.route.snapshot.paramMap.get('endpointId') as string).subscribe((data) => {
      this.endpointsService.publish(data);
    });
  }

}
