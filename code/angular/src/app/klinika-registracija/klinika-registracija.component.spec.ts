import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlinikaRegistracijaComponent } from './klinika-registracija.component';

describe('KlinikaRegistracijaComponent', () => {
  let component: KlinikaRegistracijaComponent;
  let fixture: ComponentFixture<KlinikaRegistracijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlinikaRegistracijaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KlinikaRegistracijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
