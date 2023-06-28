import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Author} from "../model/author";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  apiAuthorEndpointId: string = '';
  apiAuthorEndpoint: string = '';

  constructor(private http: HttpClient) {
    this.apiAuthorEndpointId = environment.apiAuthorEndpointId;
    this.apiAuthorEndpoint = environment.apiAuthorEndpoint;
  }

  getAuthor(authorId: number): Observable<Author> {
    if (authorId < 0) {
      return of({id: undefined, name: undefined, infoCount: undefined});
    } else {
      return this.http.get<Author>(this.apiAuthorEndpointId.replace(':id', `${authorId}`));
    }

  }

  saveAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(this.apiAuthorEndpoint, author);
  }

  deleteAuthor(authorId: number): Observable<HttpResponse<Object>> {
    return this.http.delete(this.apiAuthorEndpointId.replace(':id', `${authorId}`), {observe: 'response'});
  }
}
