import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthorsService} from "./authors.service";
import {Author} from "../model/author";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css'],
  providers: [AuthorsService]
})
export class AuthorsComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<Author> = new MatTableDataSource<Author>();

  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild('authorsPaginator') authorsPaginator?: MatPaginator;

  constructor(
    private authorsService: AuthorsService,
    private dialog: MatDialog
  ) {
    this.displayedColumns = authorsService.getDisplayedColumns();
  }

  delete(authorId: number): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.authorsService.deleteAuthor(authorId).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(response => this.refreshData());
      }
    });
  }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.authorsService.getAuthors().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.authorsPaginator!;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
