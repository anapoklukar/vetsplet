import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrankaComponent } from './stranka.component';

describe('StrankaComponent', () => {
  let component: StrankaComponent;
  let fixture: ComponentFixture<StrankaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrankaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StrankaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
