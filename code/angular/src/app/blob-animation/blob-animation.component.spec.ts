import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlobAnimationComponent } from './blob-animation.component';

describe('BlobAnimationComponent', () => {
  let component: BlobAnimationComponent;
  let fixture: ComponentFixture<BlobAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlobAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlobAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
