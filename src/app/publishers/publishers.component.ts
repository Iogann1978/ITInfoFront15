import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Publisher} from "../model/publisher";
import {PublishersService} from "./publishers.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.css'],
  providers: [PublishersService]
})
export class PublishersComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<Publisher> = new MatTableDataSource<Publisher>();

  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild('publishersPaginator') publishersPaginator?: MatPaginator;

  constructor(
    private publishersService : PublishersService,
    private dialog: MatDialog
    ) {
    this.displayedColumns = publishersService.getDisplayedColumns();
    this.refreshData();
  }

  delete(publisherId: number): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.publishersService.deletePublisher(publisherId).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(response => this.refreshData());
      }
    });
  }

  refreshData(): void {
    this.publishersService.getPublishers().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.publishersPaginator!;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
