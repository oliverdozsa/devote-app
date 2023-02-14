import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotTypeComponent } from './ballot-type.component';

describe('BallotTypeComponent', () => {
  let component: BallotTypeComponent;
  let fixture: ComponentFixture<BallotTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BallotTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
