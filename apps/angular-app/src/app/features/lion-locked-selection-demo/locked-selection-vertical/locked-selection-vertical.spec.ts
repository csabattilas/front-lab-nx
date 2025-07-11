import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedSelectionVertical } from './locked-selection-vertical';

describe('LockedSelectionVertical', () => {
  let component: LockedSelectionVertical;
  let fixture: ComponentFixture<LockedSelectionVertical>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockedSelectionVertical]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockedSelectionVertical);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
