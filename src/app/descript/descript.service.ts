import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, of} from "rxjs";
import {Descript} from "../model/descript";

@Injectable({
  providedIn: 'root'
})
export class DescriptService {
  apiDescriptEndpointId: string = '';

  constructor(private http: HttpClient) {
    this.apiDescriptEndpointId = environment.apiDescriptEndpointId;
  }

  getDescript(id: number): Observable<Descript> {
    if (id < 0) {
      return of();
    } else {
      return this.http.get<Descript>(this.apiDescriptEndpointId.replace(':id',`${id}`));
    }
  }

  decodeBase64(base64: string) {
    const text = atob(base64);
    const length = text.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }
}
