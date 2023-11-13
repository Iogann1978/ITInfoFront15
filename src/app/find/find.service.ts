import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { FindItem } from '../model/find-item';

@Injectable({
  providedIn: 'root'
})
export class FindService {
  apiFindInfoEndpoint: string = '';
  apiFindBookEndpoint: string = '';

  constructor(private http: HttpClient) {
    this.apiFindInfoEndpoint = environment.apiFindInfoEndpoint;
    this.apiFindBookEndpoint = environment.apiFindBookEndpoint;
  }

  findInfo(key: string, value: string): Observable<FindItem[]> {
    let params = new HttpParams().set(key, value);
    return this.http.get<FindItem[]>(this.apiFindInfoEndpoint, {params: params});
  }

  findBook(key: string, value: string): Observable<FindItem[]> {
    let params = new HttpParams().set(key, value);
    return this.http.get<FindItem[]>(this.apiFindBookEndpoint, {params: params});
  }
}
