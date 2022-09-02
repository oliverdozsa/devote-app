import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotesCapComponent } from './votes-cap.component';

describe('VotesCapComponent', () => {
  let component: VotesCapComponent;
  let fixture: ComponentFixture<VotesCapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotesCapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotesCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
