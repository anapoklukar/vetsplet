import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingLoginComponent } from './existing-login.component';

describe('ExistingLoginComponent', () => {
  let component: ExistingLoginComponent;
  let fixture: ComponentFixture<ExistingLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExistingLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
