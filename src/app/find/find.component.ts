import {Component, OnDestroy, OnInit} from '@angular/core';
import {FindService} from "./find.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Tag} from "../model/tag";
import {Publisher} from "../model/publisher";
import {TagsService} from "../tags/tags.service";
import {PublishersService} from "../publishers/publishers.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css']
})
export class FindComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  tags?: Tag[];
  publishers?: Publisher[];
  findFormGroup: FormGroup;

  constructor(
    private findService: FindService,
    private tagsService: TagsService,
    private publishersService: PublishersService
    ) {
    this.tagsService.getTags().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => this.tags = data);
    this.publishersService.getPublishers().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => this.publishers = data);
    this.findFormGroup = new FormGroup({
      'tagCtrl': new FormControl(null),
      'titleCtrl': new FormControl(null),
      'publisherCtrl': new FormControl(null),
      'authorCtrl': new FormControl(null)
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
