import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinarLoginComponent } from './veterinar-login.component';

describe('VeterinarLoginComponent', () => {
  let component: VeterinarLoginComponent;
  let fixture: ComponentFixture<VeterinarLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinarLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VeterinarLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
