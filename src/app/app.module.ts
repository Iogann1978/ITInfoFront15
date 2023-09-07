import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { BooksComponent } from './books/books.component';
import { CoursesComponent } from './courses/courses.component';
import { PublishersComponent } from './publishers/publishers.component';

import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatBadgeModule} from '@angular/material/badge';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FilesComponent } from './files/files.component';
import { TagsComponent } from './tags/tags.component';
import { AuthorsComponent } from './authors/authors.component';
import { BookComponent } from './book/book.component';
import { CourseComponent } from './course/course.component';
import { PublisherComponent } from './publisher/publisher.component';
import { TagComponent } from './tag/tag.component';
import { AuthorComponent } from './author/author.component';
import { FileComponent } from './file/file.component';
import { FindComponent } from './find/find.component';
import { DescriptComponent } from './descript/descript.component';
import { DescriptsComponent } from './descripts/descripts.component';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";
import { KeysPipe } from './keys.pipe';
import { DescriptDialogComponent } from './descript-dialog/descript-dialog.component';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    CoursesComponent,
    BooksComponent,
    PublishersComponent,
    DeleteDialogComponent,
    FilesComponent,
    TagsComponent,
    AuthorsComponent,
    BookComponent,
    CourseComponent,
    PublisherComponent,
    TagComponent,
    AuthorComponent,
    FileComponent,
    FindComponent,
    DescriptComponent,
    DescriptsComponent,
    KeysPipe,
    DescriptDialogComponent,
    CoursesComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatBadgeModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
