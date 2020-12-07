import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallchartComponent } from './smallchart.component';

describe('SmallchartComponent', () => {
  let component: SmallchartComponent;
  let fixture: ComponentFixture<SmallchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
