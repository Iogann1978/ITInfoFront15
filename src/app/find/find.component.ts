import {Component, OnDestroy, OnInit} from '@angular/core';
import {FindService} from "./find.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Tag} from "../model/tag";
import {Publisher} from "../model/publisher";
import {TagsService} from "../tags/tags.service";
import {PublishersService} from "../publishers/publishers.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import { Info } from '../model/info';
import { Rate } from '../model/rate';
import { State } from '../model/state';

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
  info: Info = {
    file: undefined,
    publisher: undefined,
    rate: Rate.UNKNOWN,
    state: State.PLANNED,
    tags: [],
    title: "",
    year: 0,
    id: undefined,
    descripts: []
  };

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

  findByTitle(): void {
    this.findService.findInfo('title', this.findFormGroup.get('titleCtrl')!.value)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(info => {
      this.info = info;
      this.info.file = undefined;
      this.publishersService.getPublishers().pipe(takeUntil(this.ngUnsubscribe)).subscribe(pubs => {
        this.publishers = pubs;
      });
    });
  }

  findByDescript(): void {

  }

  findByAuthor(): void {

  }

  findByTag(): void {

  }

  findByPublisher(): void {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
