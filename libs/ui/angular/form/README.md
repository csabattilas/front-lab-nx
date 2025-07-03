# Angular Form Components Library

A collection of reusable Angular form components built with modern Angular patterns. This library provides standalone form components that can be easily integrated into any Angular application within the workspace.

## Form Components

### Folder Tree

A hierarchical folder tree custom form control.

The tree is built based on a JSON data structure. An example of this structure can be found here:

`libs/api/angular/src/lib/ng-api/implementations/mock/mock-data.ts`

Based on this data, the tree repository will build on more suitable data structure, which is fed to the folder tree component when used.

#### Basic usage:

```
<fl-form-folder-tree [formControl]="folderSelectionControlOutputBasedTree">
  @for (node of data; track node.id) {
    <fl-form-folder-tree-node-otp
      [node]="node"
      [expanded]="true"
    ></fl-form-folder-tree-node-otp>
  }
</fl-form-folder-tree>
```

Other usages can be found in the `apps/angular-app/src/app/features/folder-tree-demo/folder-tree-demo.html`

The `node` data will be provided by the tree repository lib, which builds the tree structure based on the provided endpoint.

I am trying to research the performance of various implementations of the folder tree component, hence there are three different implementations:

- **Output-based tree**: This implementation uses an output-based approach to render the tree nodes. Each child will tell its parent when its checked or intermediate state is changing.
- **ViewChild-based tree**: This implementation uses the new `viewchildren` signal to query the checked or intermediate state of the children.
- **Custom nodeMap-based tree**: This implementation registers the checked or intermediate (signal-based) state of each node into a Map based on a custom id (the folders and items can have the same id).

In order to link the tree node to the form control, we use a context object. For the `output` and `viewchild` based implementations, the context object is provided by the `FolderTreeComponent`, which implements the `ControlValueAccessor` interface.

While the `nodeMap` based implementation uses a separate context service, which is also responsible for registering the nodes in the custom nodemap. The context-based implementation has its own custom control (`FolderTreeCtxComponent`) too.

#### Component extensions

The node components share some similarities, so they are extended from a base component: `BaseFolderTreeNodeComponent`.

### Checkbox

Custom checkbox component with enhanced functionality and styling. Just to have a nicer checkbox.

## Testing Components

### View in Angular App

To test these components in action on a local development environment:

1. Start the Angular application:
   ```bash
   pnpm nx serve angular-app
   ```
2. Navigate to the components demo page in the browser

### Running Unit Tests

Run the unit tests for this library:

```bash
# Run tests for the entire library
pnpm run test:ng-form
```

## Development

This library uses Angular's standalone components pattern with signals for state management.

When making changes to components:

1. Update tests accordingly
2. Verify changes in the Angular app
3. Run linting to ensure code quality:
   ```bash
   pnpm nx lint ng-form
   ```
