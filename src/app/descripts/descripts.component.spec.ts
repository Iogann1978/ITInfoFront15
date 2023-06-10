import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptsComponent } from './descripts.component';

describe('DescriptsComponent', () => {
  let component: DescriptsComponent;
  let fixture: ComponentFixture<DescriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
