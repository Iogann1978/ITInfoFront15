import { Injectable } from '@angular/core';
import {Author} from "../model/author";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  displayedColumns: string[] = ['name', 'count', 'actions'];
  apiAuthorEndpoint: string = '';
  apiAuthorEndpointId: string = '';

  constructor(private http: HttpClient) {
    this.apiAuthorEndpoint = environment.apiAuthorEndpoint;
    this.apiAuthorEndpointId = environment.apiAuthorEndpointId;
  }

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiAuthorEndpoint);
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns;
  }

  deleteAuthor(authorId: number): Observable<HttpResponse<Object>> {
    return this.http.delete(this.apiAuthorEndpointId.replace(':id', `${authorId}`), {observe: 'response'});
  }
}
