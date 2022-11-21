import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullGroupComponent } from './pull-group.component';

describe('PullGroupComponent', () => {
  let component: PullGroupComponent;
  let fixture: ComponentFixture<PullGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
