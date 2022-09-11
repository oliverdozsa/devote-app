import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingAuthorizationInputComponent } from './voting-authorization-input.component';

describe('VotingAuthorizationInputComponent', () => {
  let component: VotingAuthorizationInputComponent;
  let fixture: ComponentFixture<VotingAuthorizationInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingAuthorizationInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingAuthorizationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
