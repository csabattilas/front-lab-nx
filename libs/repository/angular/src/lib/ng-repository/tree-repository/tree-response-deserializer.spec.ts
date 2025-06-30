import { deserializeTreeData } from './tree-response-deserializer';
import { TreeApiResponse } from './tree-repository-dto.model';

describe('TreeResponseDeserializer', () => {
  describe('deserializeTreeData', () => {
    it('should transform API response to tree nodes', () => {
      const mockApiResponse: TreeApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [
            [1, 'Root Folder', null],
            [2, 'Subfolder', 1],
          ],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [
            [101, 'Item in Root', 1],
            [102, 'Item in Subfolder', 2],
          ],
        },
      };

      const result = deserializeTreeData(mockApiResponse);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Root Folder');
      expect(result[0].items?.length).toBe(2); // Subfolder and Item in Root

      const subfolder = result[0].items?.find(item => item.id === 2);
      expect(subfolder).toBeDefined();
      expect(subfolder?.title).toBe('Subfolder');
      expect(subfolder?.items?.length).toBe(1);
      expect(subfolder?.items?.[0].id).toBe(102);

      const itemInRoot = result[0].items?.find(item => item.id === 101);
      expect(itemInRoot).toBeDefined();
      expect(itemInRoot?.title).toBe('Item in Root');
    });

    it('should handle empty data', () => {
      const emptyResponse: TreeApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [],
        },
      };

      const result = deserializeTreeData(emptyResponse);

      expect(result).toEqual([]);
    });

    it('should throw error for missing required columns in folders', () => {
      const invalidResponse = {
        folders: {
          columns: ['wrong_id', 'title', 'parent_id'],
          data: [[1, 'Root Folder', null]],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [],
        },
      };

      expect(() =>
        deserializeTreeData(invalidResponse as TreeApiResponse)
      ).toThrowError(
        `Invalid folder data format: missing required column 'id'`
      );
    });

    it('should throw error for missing required columns in items', () => {
      const invalidResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [],
        },
        items: {
          columns: ['id', 'name', 'folder_id'],
          data: [[101, 'Item', 1]],
        },
      };

      expect(() =>
        deserializeTreeData(invalidResponse as TreeApiResponse)
      ).toThrowError(
        `Invalid item data format: missing required column 'title'`
      );
    });

    it('should sort folders before items and sort alphabetically within each type', () => {
      const response: TreeApiResponse = {
        folders: {
          columns: ['id', 'title', 'parent_id'],
          data: [
            [1, 'Z Root Folder', null],
            [2, 'B Subfolder', 1],
            [3, 'A Subfolder', 1],
          ],
        },
        items: {
          columns: ['id', 'title', 'folder_id'],
          data: [
            [101, 'Z Item', 1],
            [102, 'A Item', 1],
          ],
        },
      };

      const result = deserializeTreeData(response);

      expect(result[0].title).toBe('Z Root Folder');

      const children = result[0].items ?? [];
      expect(children.length).toBe(4);

      expect(children[0].title).toBe('A Subfolder');
      expect(children[1].title).toBe('B Subfolder');

      expect(children[2].title).toBe('A Item');
      expect(children[3].title).toBe('Z Item');
    });

    it('should handle complex nested structures', () => {
      const complexResponse: TreeApiResponse = {
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
            [101, 'Root Item', 1],
            [102, 'Level 1-A Item', 2],
            [103, 'Level 1-B Item', 3],
            [104, 'Level 2-A Item', 4],
            [105, 'Level 2-B Item', 5],
            [106, 'Level 3-A Item', 6],
          ],
        },
      };

      const result = deserializeTreeData(complexResponse);

      expect(result.length).toBe(1);

      const root = result[0];
      expect(root.title).toBe('Root');

      const level1A = root.items?.find(i => i.id === 2);
      expect(level1A?.title).toBe('Level 1-A');

      const level2A = level1A?.items?.find(i => i.id === 4);
      expect(level2A?.title).toBe('Level 2-A');

      const level3A = level2A?.items?.find(i => i.id === 6);
      expect(level3A?.title).toBe('Level 3-A');

      const level3AItem = level3A?.items?.[0];
      expect(level3AItem?.title).toBe('Level 3-A Item');
    });
  });
});
