import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Public.VotingsComponent } from './public.votings.component';

describe('Public.VotingsComponent', () => {
  let component: Public.VotingsComponent;
  let fixture: ComponentFixture<Public.VotingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Public.VotingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Public.VotingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
