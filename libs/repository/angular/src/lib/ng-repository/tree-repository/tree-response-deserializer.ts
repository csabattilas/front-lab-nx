import { TreeApiResponse, TreeDataDto } from './tree-repository-dto.model';
import { CheckboxTreeNode } from '@front-lab-nx/ng-form';

export interface RawNode {
  id: number;
  title: string;
  folder_id: number | null;
}

/**
 * Validates that the required columns exist in the data and returns their indices
 */
function getIndicies(
  data: TreeDataDto,
  requiredColumns: string[],
  dataType: string
): Record<string, number> {
  const indices: Record<string, number> = {};

  for (const column of requiredColumns) {
    const index = data.columns.findIndex(c => c === column);
    if (index === -1) {
      throw new Error(
        `Invalid ${dataType} data format: missing required column '${column}'`
      );
    }
    indices[column] = index;
  }

  return indices;
}

function mapRawNode(
  row: (number | string | null)[],
  indices: Record<string, number>,
  parentIdName: 'folder_id' | 'parent_id' // to not have two different maping functions
): RawNode {
  return {
    id: Number(row[indices['id']]),
    title: String(row[indices['title']]),
    folder_id:
      row[indices[parentIdName]] !== null
        ? Number(row[indices[parentIdName]])
        : null,
  };
}

// comparison function for sorting nodes - folders first, then alphabetically
function compareNodes(a: CheckboxTreeNode, b: CheckboxTreeNode): number {
  // folders first, then items
  const aIsFolder = !!a.items;
  const bIsFolder = !!b.items;

  if (aIsFolder && !bIsFolder) {
    // a is a folder, b is an item, so a comes first
    return -1;
  } else if (!aIsFolder && bIsFolder) {
    // a is an item, b is a folder, so b comes first
    return 1;
  } else {
    return a.title.localeCompare(b.title);
  }
}

// also this could go to a util file, but currently this is tree data specific
function sortNodeItems(node: CheckboxTreeNode): void {
  if (node.items && node.items.length > 0) {
    node.items.sort(compareNodes);

    for (const itemNode of node.items) {
      if (itemNode.items && itemNode.items.length > 0) {
        sortNodeItems(itemNode);
      }
    }
  }
}

// build the tree data
export function deserializeTreeData(data: TreeApiResponse): CheckboxTreeNode[] {
  // get indices for folders and items
  const folderIndices = getIndicies(
    data.folders,
    ['id', 'title', 'parent_id'],
    'folder'
  );

  const itemIndices = getIndicies(
    data.items,
    ['id', 'title', 'folder_id'],
    'item'
  );

  // convert raw data to typed objects
  const folders: RawNode[] = data.folders.data.map(row =>
    mapRawNode(row, folderIndices, 'parent_id')
  );

  const items: RawNode[] = data.items.data.map(row =>
    mapRawNode(row, itemIndices, 'folder_id')
  );

  // this map is used to create the folder, item relationships
  const nodeMap = new Map<number, CheckboxTreeNode>();

  // create folder nodes
  folders.forEach(folder => {
    nodeMap.set(folder.id, {
      id: folder.id,
      title: folder.title,
      items: [],
    });
  });

  // attach folder hierarchy
  folders.forEach(folder => {
    if (folder.folder_id !== null) {
      const parent = nodeMap.get(folder.folder_id);
      if (parent?.items) {
        const folderNode = nodeMap.get(folder.id);
        if (folderNode) {
          parent.items.push(folderNode);
        }
      }
    }
  });

  // create and attach item nodes
  items.forEach(item => {
    if (item.folder_id) {
      const parent = nodeMap.get(item.folder_id);
      const itemNode: CheckboxTreeNode = {
        id: item.id,
        title: item.title,
      };

      if (parent?.items) {
        parent.items.push(itemNode);
      }
    }
  });

  // sort after it is constructed.
  // i took in considerations adding to the right place but it might be even worse
  // with sorting at the and we sort once each level, but adding to the right place can cause parsing the items full each time

  for (const node of nodeMap.values()) {
    sortNodeItems(node);
  }

  // get root nodes
  const rootNodes = folders
    .filter(f => f.folder_id === null)
    .map(f => nodeMap.get(f.id) as CheckboxTreeNode);

  // sort the root level
  rootNodes.sort(compareNodes);

  return rootNodes;
}
