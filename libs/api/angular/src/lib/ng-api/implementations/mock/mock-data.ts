export const MOCK_DATA: Record<string, unknown> = {
  tree: JSON.parse(`{
  "folders": {
    "columns": [
      "id",
      "title",
      "parent_id"
    ],
    "data": [
      [1, "Root 1", null],
      [2, "Root 2", null],
      [3, "Root 3", 2],
      [4, "Root 4", 2],
      [5, "Root 5", 1],
      [6, "Root 6", 1]
    ]
  },
  "items": {
    "columns": [
      "id",
      "title",
      "folder_id"
    ],
    "data": [
      [11, "Item 1-1", 1],
      [12, "Item 1-2", 1],
      [13, "Item 2-1", 2],
      [14, "Item 2-2", 2],
      [15, "Item 3-1", 3],
      [16, "Item 3-2", 3],
      [17, "Item 4-1", 4],
      [18, "Item 4-2", 4], 
      [19, "Item 5-1", 5],
      [20, "Item 5-2", 5],
      [21, "Item 6-1", 6],
      [22, "Item 6-2", 6]
    ]
  }
}`),
};
