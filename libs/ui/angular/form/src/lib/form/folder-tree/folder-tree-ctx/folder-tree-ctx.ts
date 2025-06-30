import {
  Component,
  forwardRef,
  effect,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FOLDER_TREE_CONTEXT } from '../model/folder-tree-model';
import { TreeSelectionContextService } from './folder-tree-context';

@Component({
  selector: 'fl-form-folder-tree-ctx',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    TreeSelectionContextService,
    {
      provide: FOLDER_TREE_CONTEXT,
      useClass: TreeSelectionContextService,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FolderTreeCtxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// should we have validation? perhaps next iteration
export class FolderTreeCtxComponent implements ControlValueAccessor {
  private readonly ctx = inject(TreeSelectionContextService);

  constructor() {
    effect(() => {
      const selectedIds = this.ctx.selectedItemsIds();
      this.onChange(Array.from(selectedIds));
      this.onTouched();
    });
  }

  public writeValue(value: number[]): void {
    this.ctx.transaction(() => {
      this.ctx.updateSelectedItemsIds(value);
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
    //
  };

  private onTouched = (): void => {
    //
  };
}
