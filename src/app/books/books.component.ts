import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from "@angular/material/dialog";
import { Subject, takeUntil } from 'rxjs';
import { BooksService } from './books.service';
import {BookItem} from "../model/book-item";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<BookItem> = new MatTableDataSource<BookItem>();

  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild('booksPaginator') booksPaginator?: MatPaginator;

  pageIndex?: number;

  constructor(
    private booksService: BooksService,
    private dialog: MatDialog
  ) {
    this.displayedColumns = this.booksService.getDisplayedColumns();
    this.refreshData();
  }

  delete(bookId: number) {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.booksService.deleteBook(bookId).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(response => this.refreshData());
      }
    });
  }

  onChange(pageEvent: PageEvent): void {
    this.pageIndex = pageEvent.pageIndex;
    localStorage.setItem('booksPageIndex', `${this.pageIndex}`);
  }

  refreshData(): void {
    this.booksService.getBookItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data:BookItem[]) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.booksPaginator!;
    });
  }

  ngOnInit(): void {
    this.pageIndex = +localStorage.getItem('booksPageIndex')!;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
