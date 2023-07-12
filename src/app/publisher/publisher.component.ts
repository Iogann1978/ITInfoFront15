import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PublisherService} from "./publisher.service";
import {Publisher} from "../model/publisher";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})
export class PublisherComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  publisher: Publisher = {id: undefined, name: undefined, infoCount: undefined};
  publisherFormGroup: FormGroup;

  constructor(
    private publisherService: PublisherService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.publisherFormGroup = new FormGroup({
      'nameCtrl': new FormControl(null, Validators.required)
    });
    this.publisherFormGroup.get('nameCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(name => this.publisher!.name = name);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      let id = +params.get('id')!;
      this.publisherService.getPublisher(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(publisher => {
        this.publisher = publisher;
        this.publisherFormGroup.get('nameCtrl')!.setValue(this.publisher.name);
      });
    });
  }

  delete(): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.publisherService.deletePublisher(this.publisher!.id!).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
      }
    });
  }

  save(): void {
    if (this.publisherFormGroup.valid) {
      this.publisherService.savePublisher(this.publisher!).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => this.router.navigate(['/home'], {queryParams: {index: 2}}));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
