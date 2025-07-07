import { Component, effect, input, OnInit } from '@angular/core';
import { TreeNode } from '@front-lab-nx/ng-form';
import { FormControl, ValueChangeEvent } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'fl-folder-tree-transactional-opt-demo',
  template: '',
})
export class FolderTreeBaseDemo implements OnInit {
  public data = input<TreeNode[]>();
  public isLargeTree = input<boolean>();
  public newValue = '';
  public folderTreeControl = new FormControl<number[]>([3]);
  public newValueControl = new FormControl<string>('3');

  // @ts-expect-error TS6133
  private readonly isLargeEffects = effect(() => {
    const value = this.isLargeTree()
      ? `1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012,
      1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024,
      1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
      1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
      1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
      1061, 1062, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074,
      1075, 1076, 1077, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088,
      1089, 1090, 1091, 1092, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102`
      : '3';
    this.newValueControl.setValue(value);
  });

  public ngOnInit(): void {
    this.newValueControl.events
      .pipe(filter(event => event instanceof ValueChangeEvent))
      .subscribe(({ value }) =>
        this.folderTreeControl.setValue(
          value
            .split(',')
            .map((v: string) => parseInt(v.trim(), 10))
            .filter(Boolean)
        )
      );
  }

  public resetControl(): void {
    this.folderTreeControl.reset();
  }
}
