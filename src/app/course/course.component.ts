import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable, Subject, Subscription} from "rxjs";
import {InfoFile} from "../model/info-file";
import {CourseItem} from "../model/course-item";
import {Rate} from "../model/rate";
import {State} from "../model/state";
import {map, startWith, takeUntil} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseService} from "./course.service";
import {Publisher} from "../model/publisher";
import {PublishersService} from "../publishers/publishers.service";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {Descript} from "../model/descript";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent  implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  rateValues = Rate;
  stateValues = State;
  publishers?: Publisher[];

  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags?: Observable<string[]>;
  tags: string[];
  allTags?: string[];
  coursePath: InfoFile;
  contentFile: InfoFile;
  descriptFile: InfoFile;
  course: CourseItem = {
    duration: 0,
    file: undefined,
    id: 0,
    publisher: undefined,
    rate: Rate.UNKNOWN,
    state: State.PLANNED,
    tags: [],
    title: "",
    year: 0,
    descripts: []
  };

  courseFormGroup: FormGroup;
  @ViewChild('tagInput') tagInput?: ElementRef<HTMLInputElement>;

  constructor(
    private courseService: CourseService,
    private publishersService: PublishersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.tags = [];

    courseService.getTags().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.allTags = data;
      this.filteredTags = this.courseFormGroup.get('tagCtrl')!.valueChanges.pipe(
        startWith(null),
        map((tag: string | null) => (tag ? this.filterTag(tag) : this.allTags!.slice()))
      );
    });
    this.coursePath = {id: 0, filename: '', size: 0};
    this.contentFile = {id: 0, filename: '', size: 0};
    this.descriptFile = {id: 0, filename: '', size: 0};
    this.courseFormGroup = new FormGroup({
      'tagCtrl': new FormControl(null),
      'titleCtrl': new FormControl(null, Validators.required),
      'publisherCtrl': new FormControl(null),
      'yearCtrl': new FormControl(null),
      'durationCtrl': new FormControl(null),
      'coursePathCtrl': new FormControl(null),
      'rateCtrl': new FormControl(null, Validators.required),
      'stateCtrl': new FormControl(null, Validators.required)
    });
    this.courseFormGroup.get('titleCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(title => this.course.title = title);
    this.courseFormGroup.get('publisherCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(publisher => this.course.publisher!.id = publisher);
    this.courseFormGroup.get('yearCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(year => this.course.year = year);
    this.courseFormGroup.get('durationCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(duration => this.course.duration = duration);
    this.courseFormGroup.get('rateCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(rate => this.course.rate = rate);
    this.courseFormGroup.get('stateCtrl')!.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => this.course.state = state);
    this.publishersService.getPublishers().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => this.publishers = data);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.courseFormGroup.get('tagCtrl')!.setValue(null);
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
    this.courseFormGroup.get('tagCtrl')!.setValue(null);
  }

  private filterTag(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags!.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  selectCoursePath(event: Event): void {
    let size = 0;
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    let descript: Descript = {id: undefined, name: 'Files', infoId: this.course.id!, text: '<html><body><table><caption>Files</caption>'};
    for (let i = 0; i < files.length; i++) {
      size += files[i].size;
      descript.text += '<tr><td>';
      descript.text += files[i].webkitRelativePath.split('/').pop()!;
      descript.text += '<td>';
      descript.text += files[i].size;
      descript.text += '</td>';
      descript.text += '</td></tr>';
    }
    descript.text += '</table></body></html>';
    descript.text = btoa(unescape(encodeURIComponent(descript.text!)));
    this.course.descripts!.push(descript);
    this.course.file = {filename: files[0]?.webkitRelativePath.split('/')[0], id: undefined, size: size};
    this.courseFormGroup.get('coursePathCtrl')!.setValue(this.course.file!.filename);
  }

  disableTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      let id = +params.get('id')!;
      this.courseService.getCourse(id).subscribe(courseItem => {
        this.course = courseItem;
        this.courseFormGroup.get('titleCtrl')!.setValue(this.course.title);
        this.courseFormGroup.get('publisherCtrl')!.setValue(this.course.publisher?.id);
        this.courseFormGroup.get('yearCtrl')!.setValue(this.course.year);
        this.courseFormGroup.get('durationCtrl')!.setValue(this.course.duration);
        this.courseFormGroup.get('coursePathCtrl')!.setValue(this.course.file?.filename);
        this.courseFormGroup.get('rateCtrl')!.setValue(Rate[this.course.rate!].toString());
        this.courseFormGroup.get('stateCtrl')!.setValue(State[this.course.state!].toString());
      });
      this.courseService.getCourseTags(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => this.tags = data);
    });
  }


  delete() {
    this.dialog.open(DeleteDialogComponent).afterClosed().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      if(result) {
        this.courseService.deleteCourse(this.course.id!).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
      }
    });
  }

  save() {
    if (this.courseFormGroup.valid) {
      this.course.tags = [];
      this.tags.forEach(tag => this.course.tags.push({tag:tag}));
      this.courseService.saveCourse(this.course).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => this.router.navigate(['/home'], {queryParams: {index: 1}}));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
