import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {BookComponent} from "./book/book.component";
import {CourseComponent} from "./course/course.component";
import {PublisherComponent} from "./publisher/publisher.component";
import {TagComponent} from "./tag/tag.component";
import {AuthorComponent} from "./author/author.component";
import {FileComponent} from "./file/file.component";
import {FindComponent} from "./find/find.component";
import {DescriptComponent} from "./descript/descript.component";
import {DescriptsComponent} from "./descripts/descripts.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'book/:id', component: BookComponent},
  {path: 'course/:id', component: CourseComponent},
  {path: 'publisher/:id', component: PublisherComponent},
  {path: 'tag/:tag', component: TagComponent},
  {path: 'author/:id', component: AuthorComponent},
  {path: 'file/:id', component: FileComponent},
  {path: 'find', component: FindComponent},
  {path: 'descript/:id', component: DescriptComponent},
  {path: 'descripts/:id', component: DescriptsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
