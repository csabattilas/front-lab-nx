export const MOCK_DATA: Record<string, unknown> = {
  tree: JSON.parse(`{
  "folders": {
    "columns": [
      "id",
      "title",
      "parent_id"
    ],
    "data": [
      [
        1,
        "Audio",
        null
      ],
      [
        4,
        "Speakers",
        1
      ],
      [
        8,
        "Rigging",
        null
      ],
      [
        10,
        "Active speakers",
        4
      ],
      [
        2,
        "Passive speakers",
        4
      ],
      [
        6,
        "Truss",
        8
      ]
    ]
  },
  "items": {
    "columns": [
      "id",
      "title",
      "folder_id"
    ],
    "data": [
      [
        3,
        "Passive Speakers Item 1",
        2
      ],
      [
        8,
        "Truss item 2",
        6
      ],
      [
        7,
        "B Speaker item 1",
        4
      ],
      [
        5,
        "Audio item 1",
        1
      ],
      [
        1,
        "Active Speakers Item 1",
        10
      ],
      [
        4,
        "A Speaker item 2",
        4
      ],
      [
        6,
        "Truss item 1",
        6
      ]
    ]
  }
}`),
};
