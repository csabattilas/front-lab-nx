import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleCard } from './example-card';

describe('ExampleCard', () => {
  let component: ExampleCard;
  let fixture: ComponentFixture<ExampleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
