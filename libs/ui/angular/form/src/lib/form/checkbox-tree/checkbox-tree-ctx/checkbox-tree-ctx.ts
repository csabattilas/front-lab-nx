import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxTreeSelectionContextService } from './checkbox-tree-context';
import { PerformanceService } from '../performance/performance';

@Component({
  selector: 'fl-form-checkbox-tree-ctx',
  template: '<ng-content></ng-content>',
  providers: [
    CheckboxTreeSelectionContextService,
    PerformanceService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxTreeCtxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// should we have validation? perhaps next iteration
export class CheckboxTreeCtxComponent implements ControlValueAccessor, OnInit {
  private readonly ctx = inject(CheckboxTreeSelectionContextService);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly performanceService = inject(PerformanceService);

  public ngOnInit(): void {
    this.ctx.registerOnChange((value: number[]) => {
      this.onChange(value);
      this.cdr.markForCheck();
    });
  }

  public writeValue(value: number[]): void {
    this.ctx.updateSelectedItemsIds(value);
    this.performanceService.resetCheckedCount();

    queueMicrotask(() => {
      for (const node of this.ctx.nodeStates.values()) {
        node.writeValueChecked.set(false);
      }

      value?.forEach(id => {
        const nodeState = this.ctx.nodeStates.get(id);

        if (nodeState) {
          nodeState.writeValueChecked.set(true);
        }
      });
    });
  }

  public registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public markAsTouched(): void {
    this.onTouched();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: number[]): void => {
    this.cdr.markForCheck();
  };

  private onTouched = (): void => {
    //
  };
}
