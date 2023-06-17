import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Rate} from "../model/rate";
import {State} from "../model/state";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject} from "rxjs";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {BookService} from "./book.service";
import {BookItem} from "../model/book-item";
import {ActivatedRoute, Router} from "@angular/router";
import {Publisher} from "../model/publisher";
import {PublishersService} from "../publishers/publishers.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {Tag} from "../model/tag";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  rateValues?: Rate;
  stateValues?: State;
  publishers?: Publisher[];

  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags?: Observable<string[]>;
  tags: string[];
  allTags?: string[];
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

  bookFormGroup: FormGroup;
  @ViewChild('tagInput') tagInput?: ElementRef<HTMLInputElement>;

  constructor(
    private bookService: BookService,
    private publishersService: PublishersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.tags = [];

    this.bookFormGroup = new FormGroup({
      'tagCtrl': new FormControl(null),
      'isbnCtrl': new FormControl(null),
      'titleCtrl': new FormControl(null, Validators.required),
      'publisherCtrl': new FormControl(null),
      'yearCtrl': new FormControl(null),
      'pagesCtrl': new FormControl(null),
      'bookFileCtrl': new FormControl(null),
      'rateCtrl': new FormControl(null, Validators.required),
      'stateCtrl': new FormControl(null, Validators.required),
      'authorsCtrl': new FormControl(null)
    });

    bookService.getTags().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.allTags = data;
      this.filteredTags = this.bookFormGroup.get('tagCtrl')!.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => (tag ? this.filterTag(tag) : this.allTags!.slice()))
      );
    });

    this.bookFormGroup.get('isbnCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(isbn => this.book.isbn = isbn);
    this.bookFormGroup.get('titleCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(title => this.book.title = title);
    this.bookFormGroup.get('publisherCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(publisher => this.book.publisher!.id = publisher);
    this.bookFormGroup.get('yearCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(year => this.book.year = year);
    this.bookFormGroup.get('pagesCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(pages => this.book.pages = pages);
    this.bookFormGroup.get('rateCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(rate => this.book.rate = rate);
    this.bookFormGroup.get('stateCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => this.book.state = state);
    this.publishersService.getPublishers().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => this.publishers = data);
    this.bookFormGroup.get('authorsCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((authors:string) => {
      this.book.authors = [];
      authors.split(',').map(a => this.book.authors.push({id:undefined, name: a}));
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.bookFormGroup.get('tagCtrl')!.setValue(null);
    this.allTags = this.allTags!.filter(tag => tag === value);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput!.nativeElement.value = '';
    this.bookFormGroup.get('tagCtrl')!.setValue(null);
  }

  private filterTag(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags!.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  selectBookFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.book.file = {filename: files[0].name, id: undefined, size: files[0].size};
    this.bookFormGroup.get('bookFileCtrl')!.setValue(this.book.file.filename);
  }

  disableTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      let id = +params.get('id')!;
      this.bookService.getBook(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(bookItem => {
        this.book = bookItem;
        this.bookFormGroup.get('isbnCtrl')!.setValue(this.book.isbn);
        this.bookFormGroup.get('titleCtrl')!.setValue(this.book.title);
        this.bookFormGroup.get('publisherCtrl')!.setValue(this.book.publisher?.id);
        this.bookFormGroup.get('yearCtrl')!.setValue(this.book.year);
        this.bookFormGroup.get('pagesCtrl')!.setValue(this.book.pages);
        this.bookFormGroup.get('bookFileCtrl')!.setValue(this.book.file?.filename);
        this.bookFormGroup.get('rateCtrl')!.setValue(Rate[this.book.rate].toString());
        this.bookFormGroup.get('stateCtrl')!.setValue(State[this.book.state].toString());
        this.bookFormGroup.get('authorsCtrl')!.setValue(this.book.authors.map(a => a.name).join(', '));
      });
      this.bookService.getBookTags(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => this.tags = data);
    });
  }

  delete(): void {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.bookService.deleteBook(this.book.id!).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
      }
    });
  }

  save(): void {
    if (this.bookFormGroup.valid) {
      this.book.tags = [];
      this.tags.forEach(tag => this.book.tags.push({tag:tag}));
      this.bookService.saveBook(this.book).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => this.router.navigate(['/home'], {queryParams: {index: 0}}));
    }
  }

  getGoogle(): void {
    this.bookService.getGoogle(this.bookFormGroup.get('isbnCtrl')!.value).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(bookItem => {
      this.book = bookItem;
      this.book.file = undefined;
      this.publishersService.getPublishers().pipe(takeUntil(this.ngUnsubscribe)).subscribe(pubs => {
        this.publishers = pubs;
        this.bookFormGroup.get('isbnCtrl')!.setValue(this.book.isbn);
        this.bookFormGroup.get('titleCtrl')!.setValue(this.book.title);
        this.bookFormGroup.get('publisherCtrl')!.setValue(this.book.publisher!.id);
        this.bookFormGroup.get('yearCtrl')!.setValue(this.book.year);
        this.bookFormGroup.get('pagesCtrl')!.setValue(this.book.pages);
        this.bookFormGroup.get('rateCtrl')!.setValue(Rate[this.book.rate].toString());
        this.bookFormGroup.get('stateCtrl')!.setValue(State[this.book.state].toString());
        this.bookFormGroup.get('authorsCtrl')!.setValue(this.book.authors.map(a => a.name).join(', '));
        this.tags = bookItem.tags.map((tag: Tag) => tag.tag);
      });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
