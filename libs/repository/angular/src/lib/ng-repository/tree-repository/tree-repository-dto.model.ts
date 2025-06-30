export interface TreeDataDto {
  columns: string[];
  data: (number | string | null)[][];
}

export interface TreeApiResponse {
  folders: TreeDataDto;
  items: TreeDataDto;
}
