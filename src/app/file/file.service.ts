import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {InfoFile} from "../model/info-file";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  apiFileEndpointId: string = '';
  apiFileEndpoint: string = '';

  constructor(private http: HttpClient) {
    this.apiFileEndpointId = environment.apiFileEndpointId;
    this.apiFileEndpoint = environment.apiFileEndpoint;
  }

  getFile(fileId: number): Observable<InfoFile> {
    return this.http.get<InfoFile>(this.apiFileEndpointId.replace(':id', `${fileId}`));
  }

  deleteFile(fileId: number): Observable<any> {
    return this.http.delete(this.apiFileEndpointId.replace(':id', `${fileId}`));
  }

  saveFile(file: InfoFile): Observable<any> {
    return this.http.post<InfoFile>(this.apiFileEndpoint, file);
  }
}
