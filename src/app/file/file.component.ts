import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {InfoFile} from "../model/info-file";
import {ActivatedRoute} from "@angular/router";
import {FileService} from "./file.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  file?: InfoFile;
  fileFormGroup: FormGroup;

  constructor(
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.fileFormGroup = new FormGroup({
      'fileNameCtrl': new FormControl(null, Validators.required),
      'fileSizeCtrl': new FormControl(null, Validators.required)
    });
    this.fileFormGroup.get('fileNameCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(fileName => this.file!.filename = fileName);
    this.fileFormGroup.get('fileSizeCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(fileSize => this.file!.size = fileSize);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      let id = +params.get('id')!;
      this.fileService.getFile(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(file => {
        this.file = file;
        this.fileFormGroup.get('fileNameCtrl')!.setValue(this.file.filename);
        this.fileFormGroup.get('fileSizeCtrl')!.setValue(this.file.size);
      });
    });
  }

  delete(): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.fileService.deleteFile(this.file!.id!).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
      }
    });
  }

  save(): void {
    if (this.fileFormGroup.valid) {
      this.fileService.saveFile(this.file!).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
    }
  }

  refreshData(id: number) {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
