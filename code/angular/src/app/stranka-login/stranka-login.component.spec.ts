import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrankaLoginComponent } from './stranka-login.component';
import { LogoComponent } from '../logo/logo.component';

describe('StrankaLoginComponent', () => {
  let component: StrankaLoginComponent;
  let fixture: ComponentFixture<StrankaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrankaLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StrankaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
