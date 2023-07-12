import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Tag} from "../model/tag";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  apiTagEndpointId: string = '';
  apiTagEndpoint: string = '';

  constructor(private http: HttpClient) {
    this.apiTagEndpointId = environment.apiTagEndpointId;
    this.apiTagEndpoint = environment.apiTagEndpoint;
  }

  saveTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiTagEndpoint, tag);
  }

  deleteTag(tag: string): Observable<any> {
    return this.http.delete(this.apiTagEndpointId.replace(':tag', `${tag}`));
  }
}
