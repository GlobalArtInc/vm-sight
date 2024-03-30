import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Endpoint } from 'src/app/types/endpoint.types';

@Injectable()
export class EndpointsService {
  public selectedEndpoint: Endpoint;

  public _subject = new Subject<Endpoint>();
  public event = this._subject.asObservable();

  constructor(private httpClient: HttpClient) {}

  public publish(data: any) {
    this._subject.next(data);
  }

  info(endpointId: string) {
    return this.httpClient.get<Endpoint>(`protected/endpoint/${endpointId}`);
  }

  exec<T = unknown>(
    endpointId: string,
    data: { func: string; action?: string; params?: Record<string, unknown> }
  ): Observable<T> {
    return this.httpClient.post(
      `protected/endpoint/${endpointId}/exec`,
      data
    ) as Observable<T>;
  }
}
