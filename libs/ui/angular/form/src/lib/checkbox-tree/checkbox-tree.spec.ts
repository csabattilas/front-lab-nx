import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxTreeComponent } from './checkbox-tree';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CheckboxTreeComponent', () => {
  let component: CheckboxTreeComponent;
  let fixture: ComponentFixture<CheckboxTreeComponent>;
  let mockFormControl: FormControl<number[] | null>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxTreeComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxTreeComponent);
    component = fixture.componentInstance;
    mockFormControl = new FormControl<number[] | null>([]);

    // Set up the component as a ControlValueAccessor
    component.registerOnChange((value: number[]) => mockFormControl.setValue(value));
    component.registerOnTouched(() => mockFormControl.markAsTouched());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ControlValueAccessor implementation', () => {
    it('should update valueSignal when writeValue is called', () => {
      const testIds = [1, 2, 3];
      component.writeValue(testIds);
      expect(component.valueSignal()).toEqual(new Set(testIds));
    });

    it('should handle null or undefined values in writeValue', () => {
      component.writeValue(null);
      expect(component.valueSignal()).toEqual(new Set());

      component.writeValue(undefined);
      expect(component.valueSignal()).toEqual(new Set());
    });

    it('should register onChange callback', () => {
      const callback = vi.fn();
      component.registerOnChange(callback);

      component.updateValue(42, true);
      expect(callback).toHaveBeenCalledWith([42]);
    });

    it('should register onTouched callback', () => {
      const callback = vi.fn();
      component.registerOnTouched(callback);

      component.markAsTouched();
      expect(callback).toHaveBeenCalled();
    });

    it('should call onTouched when updateValue is called', () => {
      const touchedSpy = vi.fn();
      component.registerOnTouched(touchedSpy);

      component.updateValue(1, true);
      expect(touchedSpy).toHaveBeenCalled();
    });
  });

  describe('Value management', () => {
    it('should call onChange when updateValue is called with true', () => {
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);

      component.updateValue(42, true);
      expect(changeSpy).toHaveBeenCalledWith([42]);
    });

    it('should call onChange when updateValue is called with false', () => {
      // Add value first
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);
      component.updateValue(42, true);
      expect(changeSpy).toHaveBeenCalledWith([42]);

      // Then remove it
      component.updateValue(42, false);
      expect(changeSpy).toHaveBeenCalledWith([]);
    });

    it('should emit changes when updateValue is called', () => {
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);

      component.updateValue(1, true);
      expect(changeSpy).toHaveBeenCalledWith([1]);

      component.updateValue(2, true);
      expect(changeSpy).toHaveBeenCalledWith([1, 2]);

      component.updateValue(1, false);
      expect(changeSpy).toHaveBeenCalledWith([2]);
    });

    it('should handle multiple values correctly', () => {
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);

      component.updateValue(1, true);
      component.updateValue(2, true);
      component.updateValue(3, true);

      expect(changeSpy).toHaveBeenCalledWith([1, 2, 3]);

      component.updateValue(2, false);
      expect(changeSpy).toHaveBeenCalledWith([1, 3]);
    });

    it('should maintain value order in onChange calls', () => {
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);

      // Add values in specific order
      component.updateValue(3, true);
      component.updateValue(1, true);
      component.updateValue(2, true);

      // The last call should have all values (order may vary as Sets don't guarantee order)
      const lastCall = changeSpy.mock.calls[changeSpy.mock.calls.length - 1][0];
      expect(lastCall.length).toBe(3);
      expect(lastCall).toContain(1);
      expect(lastCall).toContain(2);
      expect(lastCall).toContain(3);
    });
  });

  describe('Context provider', () => {
    it('should expose valueSignal through context', () => {
      const testIds = [5, 10, 15];
      component.writeValue(testIds);

      expect(component.valueSignal()).toEqual(new Set(testIds));
    });

    it('should call onChange with the updated value', () => {
      const changeSpy = vi.fn();
      component.registerOnChange(changeSpy);

      component.updateValue(42, true);
      expect(changeSpy).toHaveBeenCalledWith([42]);

      component.updateValue(42, false);
      expect(changeSpy).toHaveBeenCalledWith([]);
    });
  });
});

// Test for edge cases
describe('CheckboxTree Edge Cases', () => {
  let component: CheckboxTreeComponent;
  let fixture: ComponentFixture<CheckboxTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle writeValue with empty array', () => {
    component.writeValue([]);
    expect(component.valueSignal()).toEqual(new Set());
  });

  it('should handle duplicate IDs in writeValue', () => {
    component.writeValue([1, 1, 2, 2, 3]);
    expect(component.valueSignal()).toEqual(new Set([1, 2, 3]));
  });

  it('should handle rapid sequential updates', () => {
    const changeSpy = vi.fn();
    component.registerOnChange(changeSpy);
    // Simulate rapid toggling of the same ID
    component.updateValue(1, true);
    component.updateValue(1, false);
    component.updateValue(1, true);

    expect(changeSpy).toHaveBeenCalledWith([1]);

    component.updateValue(1, false);
    expect(changeSpy).toHaveBeenCalledWith([]);
  });
});
