import { describe, it, expect } from 'vitest';
import { deserializeTreeData } from './tree-response-deserializer';
import { TreeApiResponse } from './tree-repository-dto.model';

describe('tree-response-deserializer', () => {
  describe('deserializeTreeData', () => {
    it('should deserialize valid tree data correctly', () => {
      const mockApiResponse: TreeApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [
            [1, 'Root Folder', null],
            [2, 'Child Folder', 1],
            [3, 'Another Root', null],
            [4, 'Nested Folder', 2],
          ],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [
            [5, 'Item in Root', 1],
            [6, 'Item in Child', 2],
            [7, 'Item in Nested', 4],
            [8, 'Another Item in Root', 1],
          ],
        },
      };

      const result = deserializeTreeData(mockApiResponse);

      expect(result).toHaveLength(2);

      const rootFolder = result.find(node => node.id === 1);
      const anotherRoot = result.find(node => node.id === 3);

      expect(rootFolder).toBeDefined();
      expect(rootFolder?.title).toBe('Root Folder');
      expect(rootFolder?.items).toHaveLength(3);

      expect(anotherRoot).toBeDefined();
      expect(anotherRoot?.title).toBe('Another Root');
      expect(anotherRoot?.items).toHaveLength(0);

      const childFolder = rootFolder?.items?.find(node => node.id === 2);
      expect(childFolder).toBeDefined();
      expect(childFolder?.title).toBe('Child Folder');
      expect(childFolder?.items).toHaveLength(2);

      const nestedFolder = childFolder?.items?.find(node => node.id === 4);
      expect(nestedFolder).toBeDefined();
      expect(nestedFolder?.title).toBe('Nested Folder');
      expect(nestedFolder?.items).toHaveLength(1);

      const itemInRoot = rootFolder?.items?.find(node => node.id === 5);
      expect(itemInRoot).toBeDefined();
      expect(itemInRoot?.title).toBe('Item in Root');
      expect(itemInRoot?.items).toBeUndefined();

      const anotherItemInRoot = rootFolder?.items?.find(node => node.id === 8);
      expect(anotherItemInRoot).toBeDefined();
      expect(anotherItemInRoot?.title).toBe('Another Item in Root');

      const itemInChild = childFolder?.items?.find(node => node.id === 6);
      expect(itemInChild).toBeDefined();
      expect(itemInChild?.title).toBe('Item in Child');

      const itemInNested = nestedFolder?.items?.find(node => node.id === 7);
      expect(itemInNested).toBeDefined();
      expect(itemInNested?.title).toBe('Item in Nested');
    });

    it('should sort folders before items and sort alphabetically within each type', () => {
      const mockApiResponse: TreeApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [
            [1, 'Z Root Folder', null],
            [2, 'A Child Folder', 1],
            [3, 'B Child Folder', 1],
          ],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [
            [4, 'A Item', 1],
            [5, 'Z Item', 1],
            [6, 'M Item', 1],
          ],
        },
      };

      const result = deserializeTreeData(mockApiResponse);

      expect(result).toHaveLength(1);

      const rootFolder = result[0];
      expect(rootFolder.title).toBe('Z Root Folder');
      expect(rootFolder.items).toHaveLength(5);

      expect(rootFolder.items?.[0].title).toBe('A Child Folder');
      expect(rootFolder.items?.[1].title).toBe('B Child Folder');

      expect(rootFolder.items?.[2].title).toBe('A Item');
      expect(rootFolder.items?.[3].title).toBe('M Item');
      expect(rootFolder.items?.[4].title).toBe('Z Item');
    });

    it('should throw an error if required folder columns are missing', () => {
      const invalidFolderData: TreeApiResponse = {
        folders: {
          columns: ['id', 'title'],
          data: [[1, 'Root']],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [],
        },
      };

      expect(() => deserializeTreeData(invalidFolderData)).toThrow(
        "Invalid folder data format: missing required column 'parent_id'"
      );
    });

    it('should throw an error if required item columns are missing', () => {
      const invalidItemData: TreeApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [[1, 'Root', null]],
        },
        items: {
          columns: ['id', 'title'],
          data: [[2, 'Item']],
        },
      };

      expect(() => deserializeTreeData(invalidItemData)).toThrow(
        "Invalid item data format: missing required column 'folder_id'"
      );
    });

    it('should handle empty data correctly', () => {
      const emptyData: TreeApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [],
        },
      };

      const result = deserializeTreeData(emptyData);

      expect(result).toEqual([]);
    });

    it('should handle complex nested structure with multiple levels', () => {
      const complexData: TreeApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [
            [1, 'Root', null],
            [2, 'Level 1-A', 1],
            [3, 'Level 1-B', 1],
            [4, 'Level 2-A', 2],
            [5, 'Level 2-B', 3],
            [6, 'Level 3-A', 4],
          ],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [
            [7, 'Item Root', 1],
            [8, 'Item L1-A', 2],
            [9, 'Item L1-B', 3],
            [10, 'Item L2-A', 4],
            [11, 'Item L2-B', 5],
            [12, 'Item L3-A', 6],
          ],
        },
      };

      const result = deserializeTreeData(complexData);

      expect(result).toHaveLength(1);

      const root = result[0];
      const level1A = root.items?.find(node => node.id === 2);
      const level2A = level1A?.items?.find(node => node.id === 4);
      const level3A = level2A?.items?.find(node => node.id === 6);

      expect(level3A).toBeDefined();
      expect(level3A?.title).toBe('Level 3-A');
      expect(level3A?.items).toHaveLength(1);
      expect(level3A?.items?.[0].title).toBe('Item L3-A');
    });
  });
});
