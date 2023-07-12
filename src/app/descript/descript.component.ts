import {Component, OnDestroy, OnInit} from '@angular/core';
import {DescriptService} from "./descript.service";
import {Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Descript} from "../model/descript";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-descript',
  templateUrl: './descript.component.html',
  styleUrls: ['./descript.component.css']
})
export class DescriptComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();
  descript: Descript;

  constructor(
    private descriptService: DescriptService,
    private activatedRoute: ActivatedRoute
    ) {
    this.descript = {id: undefined, name: undefined, text: '', infoId: undefined};
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      let id = +params.get('id')!;
      this.descriptService.getDescript(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(descript => {
        this.descript = descript;
        this.descript.text = this.descriptService.decodeBase64(descript.text!);
      });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
