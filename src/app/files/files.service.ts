import { Injectable } from '@angular/core';
import {InfoFile} from "../model/info-file";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  displayedColumns: string[] = ['filename', 'size', 'title', 'actions'];
  apiFileEndpoint: string = '';
  apiFileEndpointId: string = '';

  constructor(private http: HttpClient) {
    this.apiFileEndpoint = environment.apiFileEndpoint;
    this.apiFileEndpointId = environment.apiCourseEndpointId;
  }

  getFiles(): Observable<InfoFile[]> {
    return this.http.get<InfoFile[]>(this.apiFileEndpoint);
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns;
  }

  deleteFile(fileId: number): Observable<HttpResponse<Object>> {
    return this.http.delete(this.apiFileEndpointId.replace(':id', `${fileId}`), {observe: 'response'});
  }
}
