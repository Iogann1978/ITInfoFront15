import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Author} from "../model/author";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthorService} from "./author.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  authorFormGroup: FormGroup;
  author: Author = {id: undefined, name: undefined, infoCount: undefined};

  constructor(
    private authorService: AuthorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.authorFormGroup = new FormGroup({
      'authorCtrl': new FormControl(null, Validators.required)
    });
    this.authorFormGroup.get('authorCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(author => this.author!.name = author);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      let id = +params.get('id')!;
      this.authorService.getAuthor(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(author => {
        this.author = author;
        this.authorFormGroup.get('authorCtrl')!.setValue(this.author.name);
      });
    });
  }

  delete(): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(result => {
      if(result) {
        this.authorService.deleteAuthor(this.author!.id!).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(response => this.router.navigate(['/home'], {queryParams: {index: 3}}));
      }
    });
  }

  save(): void {
    if (this.authorFormGroup.valid) {
      this.authorService.saveAuthor(this.author!).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => this.router.navigate(['/home'], {queryParams: {index: 3}}));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
