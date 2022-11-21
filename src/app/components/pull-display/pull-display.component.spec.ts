import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullDisplayComponent } from './pull-display.component';

describe('PullDisplayComponent', () => {
  let component: PullDisplayComponent;
  let fixture: ComponentFixture<PullDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
