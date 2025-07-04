import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FolderTreeComponent,
  FolderTreeNodeOtpComponent,
  FolderTreeNodeVcComponent,
  FolderTreeCtxComponent,
  FolderTreeNodeCtxComponent,
} from '@front-lab-nx/ng-form';
import { TreeRepositoryService } from '@front-lab-nx/ng-repository';

import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'fl-tree-demo',
  imports: [
    FolderTreeComponent,
    FolderTreeNodeOtpComponent,
    FolderTreeNodeVcComponent,
    FolderTreeCtxComponent,
    FolderTreeNodeCtxComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './folder-tree-demo.scss',
  templateUrl: './folder-tree-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeDemoComponent {
  public treeData = inject(TreeRepositoryService).getTreeDataResource();
  public largeTreeData = inject(TreeRepositoryService).getTreeDataResource(
    'largeTree'
  );
  public folderSelectionControlOutputBasedTree = new FormControl<number[]>([3]);
  public folderSelectionControlViewChildBasedTree = new FormControl<number[]>([
    4,
  ]);

  public folderSelectionControlContextServiceBasedTree = new FormControl<
    number[]
  >([3]);

  private isLargeTree = false;

  public clearSelectionOutputBasedTree(): void {
    this.folderSelectionControlOutputBasedTree.reset();
  }

  public clearSelectionViewchildBasedTree(): void {
    this.folderSelectionControlViewChildBasedTree.reset();
  }

  public clearSelectionContextBasedTree(): void {
    this.folderSelectionControlContextServiceBasedTree.reset();
  }

  public setNewValueOutputBasedTree(): void {
    if (this.isLargeTree) {
      this.folderSelectionControlOutputBasedTree.setValue([
        1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012,
        1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024,
        1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
        1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
        1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
        1061, 1062, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074,
        1075, 1076, 1077, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088,
        1089, 1090, 1091, 1092, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102,
      ]);
    } else {
      this.folderSelectionControlOutputBasedTree.setValue([8]);
    }
  }

  public setNewValueViewChildBasedTree(): void {
    if (this.isLargeTree) {
      this.folderSelectionControlViewChildBasedTree.setValue([
        1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012,
        1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024,
        1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
        1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
        1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
        1061, 1062, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074,
        1075, 1076, 1077, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088,
        1089, 1090, 1091, 1092, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102,
      ]);
    } else {
      this.folderSelectionControlViewChildBasedTree.setValue([8]);
    }
  }

  public setNewValueContextBasedTree(): void {
    if (this.isLargeTree) {
      this.folderSelectionControlContextServiceBasedTree.setValue([
        1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012,
        1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024,
        1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
        1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
        1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
        1061, 1062, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074,
        1075, 1076, 1077, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088,
        1089, 1090, 1091, 1092, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102,
      ]);
    } else {
      this.folderSelectionControlContextServiceBasedTree.setValue([8]);
    }
  }

  public switchToLargeTree(): void {
    this.treeData = this.largeTreeData;
    this.isLargeTree = true;
    setTimeout(() => {
      this.folderSelectionControlOutputBasedTree.setValue([
        1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012,
        1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024,
        1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
        1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
        1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
        1061, 1062, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074,
        1075, 1076, 1077, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088,
        1089, 1090, 1091, 1092, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102,
        1103, 1104, 1105, 1106, 1107, 1110, 1111, 1112, 1113, 1114, 1115, 1116,
        1117, 1118, 1119, 1120, 1121, 1122, 1123, 1130, 1131, 1132, 1133, 1134,
        1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143, 1144, 1150, 1151,
        1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161, 1162, 1163,
        1164, 1165, 1170, 1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179,
        1180, 1181, 1182, 1183, 1184, 1185, 1186, 1190, 1191, 1192, 1193, 1194,
        1195, 1196, 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1206,
        1207, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217,
      ]);
      this.folderSelectionControlViewChildBasedTree.setValue([
        1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012,
        1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024,
        1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
        1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
        1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
        1061, 1062, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074,
        1075, 1076, 1077, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088,
        1089, 1090, 1091, 1092, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102,
        1103, 1104, 1105, 1106, 1107, 1110, 1111, 1112, 1113, 1114, 1115, 1116,
        1117, 1118, 1119, 1120, 1121, 1122, 1123, 1130, 1131, 1132, 1133, 1134,
        1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143, 1144, 1150, 1151,
        1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161, 1162, 1163,
        1164, 1165, 1170, 1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179,
        1180, 1181, 1182, 1183, 1184, 1185, 1186, 1190, 1191, 1192, 1193, 1194,
        1195, 1196, 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1206,
        1207, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217,
      ]);
      this.folderSelectionControlContextServiceBasedTree.setValue([
        1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012,
        1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024,
        1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036,
        1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048,
        1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060,
        1061, 1062, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074,
        1075, 1076, 1077, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088,
        1089, 1090, 1091, 1092, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102,
        1103, 1104, 1105, 1106, 1107, 1110, 1111, 1112, 1113, 1114, 1115, 1116,
        1117, 1118, 1119, 1120, 1121, 1122, 1123, 1130, 1131, 1132, 1133, 1134,
        1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143, 1144, 1150, 1151,
        1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161, 1162, 1163,
        1164, 1165, 1170, 1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179,
        1180, 1181, 1182, 1183, 1184, 1185, 1186, 1190, 1191, 1192, 1193, 1194,
        1195, 1196, 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1206,
        1207, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217,
      ]);
    }, 0);
  }
}
