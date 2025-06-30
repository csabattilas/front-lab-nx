import { TestBed } from '@angular/core/testing';
import { TreeSelectionContextService } from './folder-tree-context';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TreeSelectionContextService', () => {
  let service: TreeSelectionContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeSelectionContextService],
    });
    service = TestBed.inject(TreeSelectionContextService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty selectedItemsIds', () => {
    expect(service.selectedItemsIds().size).toBe(0);
  });

  it('should initialize with isFormUpdate set to false', () => {
    expect(service.isFormUpdate()).toBe(false);
  });

  describe('transaction', () => {
    it('should set isFormUpdate to true during transaction', () => {
      service.transaction(() => {
        expect(service.isFormUpdate()).toBe(true);
      });
    });

    it('should reset isFormUpdate to false after transaction', async () => {
      vi.useFakeTimers();

      service.transaction(() => {
        //
      });

      expect(service.isFormUpdate()).toBe(true);

      vi.runAllTimers();
      expect(service.isFormUpdate()).toBe(false);

      vi.useRealTimers();
    });

    it('should return the result of the transaction function', () => {
      const result = service.transaction(() => 'test result');
      expect(result).toBe('test result');
    });

    it('should set isFormUpdate to false even if transaction throws', async () => {
      vi.useFakeTimers();

      try {
        service.transaction(() => {
          throw new Error('Test error');
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        //
      }

      vi.runAllTimers();
      expect(service.isFormUpdate()).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('registerNode', () => {
    it('should register a node and return its state', () => {
      const nodeState = service.registerNode(1, false);
      expect(nodeState).toBeTruthy();
      expect(nodeState.checked()).toBe(false);
      expect(nodeState.indeterminate()).toBe(false);
    });

    it('should return existing node state if node is already registered', () => {
      const nodeState1 = service.registerNode(1, false);
      const nodeState2 = service.registerNode(1, false);
      expect(nodeState1).toBe(nodeState2);
    });

    it('should differentiate between nodes with same id but different hasChildren flag', () => {
      const itemNodeState = service.registerNode(1, false);
      const folderNodeState = service.registerNode(1, true);
      expect(itemNodeState).not.toBe(folderNodeState);
    });
  });

  describe('updateIndeterminateNodeSelection', () => {
    it('should update indeterminate state of a node', () => {
      const nodeState = service.registerNode(1, true);
      expect(nodeState.indeterminate()).toBe(false);

      service.updateIndeterminateNodeSelection(1, true);
      expect(nodeState.indeterminate()).toBe(true);
    });

    it('should not throw if node does not exist', () => {
      expect(() => {
        service.updateIndeterminateNodeSelection(999, true);
      }).not.toThrow();
    });
  });

  describe('updateNodeCheckedSelection', () => {
    it('should update checked state of a leaf node', () => {
      const nodeState = service.registerNode(1, false);
      expect(nodeState.checked()).toBe(false);

      service.updateNodeCheckedSelection(1, true, false);
      expect(nodeState.checked()).toBe(true);
    });

    it('should update checked state of a folder node', () => {
      const nodeState = service.registerNode(1, true);
      expect(nodeState.checked()).toBe(false);

      service.updateNodeCheckedSelection(1, true, true);
      expect(nodeState.checked()).toBe(true);
    });

    it('should not throw if node does not exist', () => {
      expect(() => {
        service.updateNodeCheckedSelection(999, true, false);
      }).not.toThrow();
    });
  });

  describe('updateSelectedItemsIds', () => {
    it('should update selectedItemsIds with provided ids', () => {
      service.updateSelectedItemsIds([1, 2, 3]);
      expect(service.selectedItemsIds().size).toBe(3);
      expect(service.selectedItemsIds().has(1)).toBe(true);
      expect(service.selectedItemsIds().has(2)).toBe(true);
      expect(service.selectedItemsIds().has(3)).toBe(true);
    });

    it('should replace existing selectedItemsIds', () => {
      service.updateSelectedItemsIds([1, 2]);
      service.updateSelectedItemsIds([3, 4]);
      expect(service.selectedItemsIds().size).toBe(2);
      expect(service.selectedItemsIds().has(1)).toBe(false);
      expect(service.selectedItemsIds().has(2)).toBe(false);
      expect(service.selectedItemsIds().has(3)).toBe(true);
      expect(service.selectedItemsIds().has(4)).toBe(true);
    });
  });

  describe('addSelectedItems', () => {
    it('should add item to selectedItemsIds', () => {
      service.addSelectedItems(1);
      expect(service.selectedItemsIds().has(1)).toBe(true);
    });

    it('should not add duplicate items', () => {
      service.addSelectedItems(1);
      service.addSelectedItems(1);
      expect(service.selectedItemsIds().size).toBe(1);
    });

    it('should not add items when isFormUpdate is true', () => {
      service.transaction(() => {
        service.addSelectedItems(1);
        expect(service.selectedItemsIds().has(1)).toBe(false);
      });
    });
  });

  describe('removeSelectedItems', () => {
    beforeEach(() => {
      service.updateSelectedItemsIds([1, 2, 3]);
    });

    it('should remove item from selectedItemsIds', () => {
      service.removeSelectedItems(1);
      expect(service.selectedItemsIds().has(1)).toBe(false);
      expect(service.selectedItemsIds().has(2)).toBe(true);
      expect(service.selectedItemsIds().has(3)).toBe(true);
    });

    it('should not throw when removing non-existent item', () => {
      expect(() => {
        service.removeSelectedItems(999);
      }).not.toThrow();
    });

    it('should not remove items when isFormUpdate is true', () => {
      service.transaction(() => {
        service.removeSelectedItems(1);
        expect(service.selectedItemsIds().has(1)).toBe(true);
      });
    });
  });

  describe('getNode and getMapId', () => {
    it('should throw error when getting non-existent node', () => {
      expect(() => {
        // fancy private access :D
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).getNode(999, false);
      }).toThrow('Node not found');
    });

    it('should generate different map IDs for same ID with different hasChildren flag', () => {
      // register two nodes with same ID but different hasChildren flag
      const folderNode = service.registerNode(1, true);
      const itemNode = service.registerNode(1, false);

      expect(folderNode).not.toBe(itemNode);
    });
  });
});
