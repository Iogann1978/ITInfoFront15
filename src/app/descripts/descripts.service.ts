import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Info} from "../model/info";

@Injectable({
  providedIn: 'root'
})
export class DescriptsService {
  apiDescriptEndpoint: string = '';
  apiDescriptEndpointId: string = '';
  apiInfoEndpointId: string = '';
  apiInfoEndpoint: string = '';
  displayedColumns: string[] = ['name', 'actions'];

  constructor(private http: HttpClient) {
    this.apiDescriptEndpointId = environment.apiDescriptEndpointId;
    this.apiDescriptEndpoint = environment.apiDescriptEndpoint;
    this.apiInfoEndpointId = environment.apiInfoEndpointId;
    this.apiInfoEndpoint = environment.apiInfoEndpoint;
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns;
  }

  getInfo(id: number): Observable<Info> {
    return this.http.get<Info>(this.apiInfoEndpointId.replace(':id', `${id}`));
  }

  deleteDescript(id: number): Observable<HttpResponse<Object>> {
    return this.http.delete(this.apiDescriptEndpointId.replace(':id', `${id}`), {observe: 'response'});
  }

  saveInfo(info: Info) {
    this.http.post<Info>(this.apiInfoEndpoint, info).subscribe();
  }

  saveDescriptFile(formData: FormData, id: number): Observable<FormData> {
    return this.http.post<FormData>(this.apiDescriptEndpointId.replace(':id', `${id}`), formData);
  }
}
