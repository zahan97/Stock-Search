import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchitComponent } from './searchit.component';

describe('SearchitComponent', () => {
  let component: SearchitComponent;
  let fixture: ComponentFixture<SearchitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
