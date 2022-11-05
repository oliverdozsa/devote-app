import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingsWhereIParticipateComponent } from './votings-where-i-participate.component';

describe('VotingsWhereIParticipateComponent', () => {
  let component: VotingsWhereIParticipateComponent;
  let fixture: ComponentFixture<VotingsWhereIParticipateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingsWhereIParticipateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingsWhereIParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
