import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostComponent } from './gost.component';

describe('GostComponent', () => {
  let component: GostComponent;
  let fixture: ComponentFixture<GostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
