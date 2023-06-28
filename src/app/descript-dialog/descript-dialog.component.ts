import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-descript-dialog',
  templateUrl: './descript-dialog.component.html',
  styleUrls: ['./descript-dialog.component.css']
})
export class DescriptDialogComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  descriptFormGroup: FormGroup;
  name?: string;
  formData?: FormData;

  constructor(
    private dialogRef: MatDialogRef<DescriptDialogComponent>
  ) {
    this.descriptFormGroup = new FormGroup({
      'titleCtrl': new FormControl(null, Validators.required),
      'fileCtrl': new FormControl(null)
    });
    this.descriptFormGroup.get('titleCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(name => this.name = name);
    this.formData = new FormData();
  }

  ngOnInit(): void {
  }

  close(flag: boolean): void {
    if (!flag) {
      this.formData = undefined;
    }
    this.dialogRef.close(this.formData);
  }

  selectDescriptFile(event: Event): void {

    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file: File = files[0];
    if (file) {
      this.formData!.append('file', file, this.name);
      this.descriptFormGroup.get('fileCtrl')!.setValue(file.name);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
