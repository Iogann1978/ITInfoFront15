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
import { BookItem } from '../model/book-item';

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
  book: BookItem = {
    authors: [],
    file: undefined,
    isbn: "",
    pages: 0,
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
      'authorCtrl': new FormControl(null),
      'descriptCtrl': new FormControl(null)
    });
  }

  ngOnInit(): void {
  }

  findByTitle(): void {
    this.findInfo('title', this.findFormGroup.get('titleCtrl')!.value);
  }

  findByDescript(): void {
    this.findInfo('descript', this.findFormGroup.get('descriptCtrl')!.value);
  }

  findByTag(): void {
    this.findInfo('tag', this.findFormGroup.get('tagCtrl')!.value);
  }

  findByPublisher(): void {
    this.findInfo('publisher', this.findFormGroup.get('publisherCtrl')!.value);
  }

  findByAuthor(): void {
    this.findBook('author', this.findFormGroup.get('authorCtrl')!.value);
  }

  private findInfo(key: string, value: string): void {
    this.findService.findInfo(key, value)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(info => this.info = info);
  }

  private findBook(key: string, value: string): void {
    this.findService.findBook(key, value)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(book => this.book = book);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
