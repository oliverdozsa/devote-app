import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingVisibilityAndAuthorizationComponent } from './voting-visibility-and-authorization.component';

describe('VotingVisibilityComponent', () => {
  let component: VotingVisibilityAndAuthorizationComponent;
  let fixture: ComponentFixture<VotingVisibilityAndAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingVisibilityAndAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingVisibilityAndAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
