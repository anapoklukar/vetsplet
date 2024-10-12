import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinarComponent } from './veterinar.component';

describe('VeterinarComponent', () => {
  let component: VeterinarComponent;
  let fixture: ComponentFixture<VeterinarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VeterinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
