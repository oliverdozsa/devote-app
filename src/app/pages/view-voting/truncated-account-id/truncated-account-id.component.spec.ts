import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruncatedAccountIdComponent } from './truncated-account-id.component';

describe('TruncatedTextComponent', () => {
  let component: TruncatedAccountIdComponent;
  let fixture: ComponentFixture<TruncatedAccountIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruncatedAccountIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruncatedAccountIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
