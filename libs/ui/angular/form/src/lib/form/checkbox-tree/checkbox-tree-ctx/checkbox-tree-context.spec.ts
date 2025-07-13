import { TestBed } from '@angular/core/testing';
import { CheckboxTreeSelectionContextService } from './checkbox-tree-context';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('TreeSelectionContextService', () => {
  let service: CheckboxTreeSelectionContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckboxTreeSelectionContextService],
    });
    service = TestBed.inject(CheckboxTreeSelectionContextService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty selectedItemsIds', () => {
    expect(service.selectedItemsIds.size).toBe(0);
  });

  describe('registerNode', () => {
    it('should register a node and return its state', () => {
      const nodeState = service.registerNode(1);
      expect(nodeState).toBeTruthy();
      expect(nodeState.checked()).toBe(false);
      expect(nodeState.indeterminate()).toBe(false);
      expect(nodeState.writeValueChecked()).toBe(false);
    });

    it('should return existing node state if node is already registered', () => {
      const nodeState1 = service.registerNode(1);
      const nodeState2 = service.registerNode(1);
      expect(nodeState1).toBe(nodeState2);
    });

    it('should differentiate between nodes with same id but different hasChildren flag', () => {
      const itemNodeState = service.registerNode(1);
      const noneLeafNodeState = service.registerNode(1);
      expect(itemNodeState).not.toBe(noneLeafNodeState);
    });
  });

  describe('updateIndeterminateNodeSelection', () => {
    it('should update indeterminate state of a node', () => {
      const nodeState = service.registerNode(1);
      expect(nodeState.indeterminate()).toBe(false);

      service.updateIndeterminateNodeSelection(1, true);
      expect(nodeState.indeterminate()).toBe(true);
    });
  });

  describe('updateNodeCheckedSelection', () => {
    it('should update checked state of a node', () => {
      const nodeState = service.registerNode(1);
      expect(nodeState.checked()).toBe(false);
      expect(nodeState.writeValueChecked()).toBe(false);

      service.updateNodeCheckedSelection(1, true, false);
      expect(nodeState.checked()).toBe(true);
      expect(nodeState.writeValueChecked()).toBe(true);
    });
  });

  describe('updateSelectedItemsIds', () => {
    it('should update selected items ids', () => {
      expect(service.selectedItemsIds.size).toBe(0);

      service.updateSelectedItemsIds([1, 2, 3]);
      expect(service.selectedItemsIds.size).toBe(3);
      expect(service.selectedItemsIds.has(1)).toBe(true);
      expect(service.selectedItemsIds.has(2)).toBe(true);
      expect(service.selectedItemsIds.has(3)).toBe(true);
    });
  });

  describe('addSelectedItems', () => {
    it('should add an item to selectedItemsIds', () => {
      const onChangeSpy = vi.fn();
      service.registerOnChange(onChangeSpy);

      service.addSelectedItems(1);
      expect(service.selectedItemsIds.has(1)).toBe(true);
      expect(onChangeSpy).toHaveBeenCalledWith([1]);
    });

    it('should not call onChange if item is already selected', () => {
      const onChangeSpy = vi.fn();
      service.registerOnChange(onChangeSpy);

      service.addSelectedItems(1);
      expect(onChangeSpy).toHaveBeenCalledTimes(1);

      service.addSelectedItems(1);
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeSelectedItems', () => {
    it('should remove an item from selectedItemsIds', () => {
      const onChangeSpy = vi.fn();
      service.registerOnChange(onChangeSpy);

      service.addSelectedItems(1);
      expect(service.selectedItemsIds.has(1)).toBe(true);

      service.removeSelectedItems(1);
      expect(service.selectedItemsIds.has(1)).toBe(false);
      expect(onChangeSpy).toHaveBeenCalledWith([]);
    });

    it('should not call onChange if item is not selected', () => {
      const onChangeSpy = vi.fn();
      service.registerOnChange(onChangeSpy);

      service.removeSelectedItems(1);
      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('getNode', () => {
    it('should return node state for registered node', () => {
      const nodeState = service.registerNode(1);
      const retrievedState = service.getNode(1);
      expect(retrievedState).toBe(nodeState);
    });

    it('should throw error for non-registered node', () => {
      expect(() => service.getNode(999)).toThrow('Node not found');
    });
  });
});
