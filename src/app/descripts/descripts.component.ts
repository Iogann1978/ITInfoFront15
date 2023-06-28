import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Descript} from "../model/descript";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DescriptsService} from "./descripts.service";
import {Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Info} from "../model/info";
import {DescriptDialogComponent} from "../descript-dialog/descript-dialog.component";
import {BookService} from "../book/book.service";
import {CourseService} from "../course/course.service";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-descripts',
  templateUrl: './descripts.component.html',
  styleUrls: ['./descripts.component.css']
})
export class DescriptsComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<Descript> = new MatTableDataSource<Descript>();
  info: Info = {
    file: undefined,
    id: 0,
    publisher: undefined,
    rate: undefined,
    state: undefined,
    tags: [],
    title: "",
    year: 0
  };

  constructor(
    private descriptsService: DescriptsService,
    private bookService: BookService,
    private courseService?: CourseService,
    private dialog?: MatDialog,
    private activatedRoute?: ActivatedRoute
  ) {
    this.displayedColumns = this.descriptsService.getDisplayedColumns();
  }

  ngOnInit(): void {
    this.activatedRoute!.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      let id = +params.get('id')!;
      this.refreshData(id);
    });
  }

  delete(id: number): void {
    this.dialog!.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.descriptsService.deleteDescript(id).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(response => this.refreshData(this.info.id!));
      }
    });
  }

  addDescript(): void {
    this.dialog!.open(DescriptDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((formData: FormData) => {
      if(formData != null) {
        this.descriptsService.saveDescriptFile(formData, this.info.id!).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(response => this.refreshData(this.info.id!));
      }
    });
  }

  refreshData(id: number) {
    this.descriptsService.getInfo(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(info => {
      this.info = info;
      this.dataSource.data = info.descripts!;
    });
  }

  export() {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
