import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockerNetworksComponent } from './docker-networks.component';

describe('DockerNetworksComponent', () => {
  let component: DockerNetworksComponent;
  let fixture: ComponentFixture<DockerNetworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockerNetworksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DockerNetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
