import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
  OnInit,
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
export class FolderTreeCtxComponent implements ControlValueAccessor, OnInit {
  private readonly ctx = inject(TreeSelectionContextService);

  private readonly cdr = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.ctx.registerOnChange((value: number[]) => {
      this.onChange(value);
      this.cdr.markForCheck();
    });
  }

  public writeValue(value: number[]): void {
    this.ctx.updateSelectedItemsIds(value);

    queueMicrotask(() => {
      for (const node of this.ctx.nodeStates.values()) {
        node.writeValueChecked.set(false);
      }

      value?.forEach(id => {
        const nodeState = this.ctx.nodeStates.get(this.ctx.getMapId(id, false));

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
