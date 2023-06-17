import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, Subscription} from "rxjs";
import {Tag} from "../model/tag";
import {map} from "rxjs/operators";
import {BookItem} from "../model/book-item";
import {TagsService} from "../tags/tags.service";
import {environment} from "../../environments/environment";
import {Rate} from "../model/rate";
import {State} from "../model/state";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  apiGoogleEndpoint: string = '';
  apiBookEndpointId: string = '';
  apiBookEndpoint: string = '';

  constructor(private http: HttpClient, private tagsService: TagsService) {
    this.apiGoogleEndpoint = environment.apiGoogleEndpoint;
    this.apiBookEndpointId = environment.apiBookEndpointId;
    this.apiBookEndpoint = environment.apiBookEndpoint;
  }

  getTags(): Observable<string[]> {
    return this.tagsService.getTags()
      .pipe(
        map((data: Tag[]) => data.map((tag: Tag) => tag.tag))
      );
  }

  getBookTags(bookId: number): Observable<string[]> {
    if (bookId < 0) {
      return of();
    } else {
      return this.http.get<BookItem>(this.apiBookEndpointId.replace(':id', `${bookId}`))
        .pipe(
          map((book: BookItem) => book.tags),
          map((data: Tag[]) => data.map((tag: Tag) => tag.tag))
        );
    }
  }

  getBook(bookId: number): Observable<BookItem> {
    if (bookId < 0) {
      return of({id: undefined, isbn: undefined, pages: undefined, authors: [], title: undefined, year: undefined, rate: Rate.UNKNOWN, state: State.PLANNED, publisher: {id: undefined, name: undefined}, file: undefined, tags: [], content: {id: undefined, text: undefined}, descripts: []});
    } else {
      return this.http.get<BookItem>(this.apiBookEndpointId.replace(':id', `${bookId}`));
    }
  }

  getGoogle(isbn: string): Observable<BookItem> {
    return this.http.get<BookItem>(this.apiGoogleEndpoint.replace(':isbn', `${isbn}`));
  }

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(this.apiBookEndpointId.replace(':id', `${bookId}`));
  }

  saveBook(book: BookItem): Observable<BookItem> {
    return this.http.post<BookItem>(this.apiBookEndpoint, book);
  }
 }
