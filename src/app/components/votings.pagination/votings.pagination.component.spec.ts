import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Votings.PaginationComponent } from './votings.pagination.component';

describe('Votings.PaginationComponent', () => {
  let component: Votings.PaginationComponent;
  let fixture: ComponentFixture<Votings.PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Votings.PaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Votings.PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
