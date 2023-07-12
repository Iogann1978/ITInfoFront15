import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InfoFile} from "../model/info-file";
import {FilesService} from "./files.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  providers: [FilesService]
})
export class FilesComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<InfoFile> = new MatTableDataSource<InfoFile>();

  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild('filesPaginator') filesPaginator?: MatPaginator;

  constructor(
    private filesService: FilesService,
    private dialog: MatDialog
  ) {
    this.displayedColumns = filesService.getDisplayedColumns();
  }

  delete(fileId: number): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.filesService.deleteFile(fileId).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(response => this.refreshData());
      }
    });
  }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.filesService.getFiles().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.filesPaginator!;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
