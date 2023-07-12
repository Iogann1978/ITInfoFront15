import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Publisher} from "../model/publisher";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  apiPublisherEndpointId: string = '';
  apiPublisherEndpoint: string = '';

  constructor(private http: HttpClient) {
    this.apiPublisherEndpointId = environment.apiPublisherEndpointId;
    this.apiPublisherEndpoint = environment.apiPublisherEndpoint;
  }

  getPublisher(publisherId: number): Observable<Publisher> {
    if (publisherId < 0) {
      return of({id: undefined, name: undefined, infoCount: undefined});
    } else {
      return this.http.get<Publisher>(this.apiPublisherEndpointId.replace(':id', `${publisherId}`));
    }
  }

  deletePublisher(publisherId: number): Observable<any> {
    return this.http.delete(this.apiPublisherEndpointId.replace(':id', `${publisherId}`));
  }

  savePublisher(publisher: Publisher): Observable<Publisher> {
    return this.http.post<Publisher>(this.apiPublisherEndpoint, publisher);
  }
}
