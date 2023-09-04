import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Info } from '../model/info';
import { BookItem } from '../model/book-item';

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

  findInfo(key: string, value: string): Observable<Info> {
    let params = new HttpParams().set(key, value);
    return this.http.get<Info>(this.apiFindInfoEndpoint, {params: params});
  }

  findBook(key: string, value: string): Observable<BookItem> {
    let params = new HttpParams().set(key, value);
    return this.http.get<BookItem>(this.apiFindBookEndpoint, {params: params});
  }
}
