import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TagsService} from "./tags.service";
import {Tag} from "../model/tag";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [TagsService]
})
export class TagsComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<Tag> = new MatTableDataSource<Tag>();

  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild('tagsPaginator') tagsPaginator!: MatPaginator;

  constructor(
    private tagsService: TagsService,
    private dialog: MatDialog
    ) {
    this.displayedColumns = tagsService.getDisplayedColumns();
    this.refreshData();
  }

  delete(tag: string): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.tagsService.deleteTag(tag).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(response => this.refreshData());
      }
    });
  }

  refreshData(): void {
    this.tagsService.getTags().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.tagsPaginator;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
