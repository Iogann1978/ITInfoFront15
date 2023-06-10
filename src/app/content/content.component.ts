import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  tabIndex?: number;

  constructor() { }

  onChange(tabIndex: number): void {
    this.tabIndex = tabIndex;
    localStorage.setItem('tabIndex', `${this.tabIndex}`);
  }

  ngOnInit(): void {
    this.tabIndex = +localStorage.getItem('tabIndex')!;
  }

}
