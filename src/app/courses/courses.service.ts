import { Injectable } from '@angular/core';
import {CourseItem} from "../model/course-item";
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  displayedColumns: string[] = ['title', 'publisher', 'rate', 'state', 'year', 'actions'];
  apiCourseEndpoint: string = '';
  apiCourseEndpointId: string = '';

  constructor(private http: HttpClient) {
    this.apiCourseEndpoint = environment.apiCourseEndpoint;
    this.apiCourseEndpointId = environment.apiCourseEndpointId;
  }

  getCourseItems(): Observable<CourseItem[]> {
    return this.http.get<CourseItem[]>(this.apiCourseEndpoint);
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns;
  }

  deleteCourse(courseId: number): Observable<HttpResponse<Object>> {
    return this.http.delete(this.apiCourseEndpointId.replace(':id', `${courseId}`),{observe: 'response'});
  }
}
