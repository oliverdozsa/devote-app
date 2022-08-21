import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVotingMediatorComponent } from './create-voting-mediator.component';

describe('CreateVotingMediatorComponent', () => {
  let component: CreateVotingMediatorComponent;
  let fixture: ComponentFixture<CreateVotingMediatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVotingMediatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVotingMediatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
