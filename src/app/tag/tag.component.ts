import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Tag} from "../model/tag";
import {TagService} from "./tag.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  tag: Tag = {tag: ''};
  tagFormGroup: FormGroup;

  constructor(
    private tagService: TagService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.tagFormGroup = new FormGroup({
      'tagCtrl': new FormControl(null, Validators.required)
    });
    this.tagFormGroup.get('tagCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(tag => this.tag.tag = tag);
  }

  delete(): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.tagService.deleteTag(this.tag.tag).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
      }
    });
  }

  save(): void {
    if (this.tagFormGroup.valid) {
      this.tagService.saveTag(this.tag).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => this.router.navigate(['/home'], {queryParams: {index: 4}}));
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
