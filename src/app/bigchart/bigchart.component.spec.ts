import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigchartComponent } from './bigchart.component';

describe('BigchartComponent', () => {
  let component: BigchartComponent;
  let fixture: ComponentFixture<BigchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BigchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
