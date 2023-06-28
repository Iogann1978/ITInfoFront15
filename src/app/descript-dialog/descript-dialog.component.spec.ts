import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptDialogComponent } from './descript-dialog.component';

describe('DescriptDialogComponent', () => {
  let component: DescriptDialogComponent;
  let fixture: ComponentFixture<DescriptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
