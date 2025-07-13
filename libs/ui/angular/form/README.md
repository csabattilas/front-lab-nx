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

I am trying to research the performance of various implementations of the folder tree component, hence there are multiple different implementations:

Ultimately there were 4 variations implemented

#### Transactional writeValue

The two oldest variants are based on effects and imperative interaction (check/uncheck) handling.

These two variants are also using a so called "transactional" `writeValue` update to handle the selected item ids `selectedItemsIds` from which the value of the folder tree control is derived.

The need for this transactional update is due to the following:

- the `selectedItemsIds` is a signal, which is updated when the `writeValue` is called
- the `selectedItemsIds` only needs to be listened to when the `writeValue` is called from outside the control (e.g. when the form control is updated)

One of the variants is output based using output events from the children and the node object to count the children checked/unchecked/intermediate state.

The other variant is using the `viewChildren` signal to query the checked/unchecked/intermediate state of the children.

The components usage:

```html
<fl-form-folder-tree-transactional>
  @for (node of data; track node.id) {
  <fl-form-folder-tree-node-otp [node]="node"></fl-form-folder-tree-node-otp>
  }
</fl-form-folder-tree-transactional>
```

or

```html
<fl-form-folder-tree-transactional>
  @for (node of data; track node.id) {
  <fl-form-folder-tree-node-vc [node]="node"></fl-form-folder-tree-node-vc>
  }
</fl-form-folder-tree-transactional>
```

#### Context service

Each of the variants are using a contex to update the selected item ids (`selectedItemsIds`).

For the first two variants the context will be the folder tree control (component) itself.

But in order to eliminate the transactional `writeValue` update the third variant is implementing an external context service and drops the selectedItemsIds as signal. Instead it updates the selectedItemsIds directly.

The components usage:

```html
<fl-form-checkbox-tree-ctx>
  @for (node of data; track node.id) {
  <fl-form-folder-tree-node-ctx [node]="node"></fl-form-folder-tree-node-ctx>
  }
</fl-form-checkbox-tree-ctx>
```

#### Finding the cleanest solution

The 4th variant uses a different approach in order to eliminate the transactional `writeValue` update.

This variant drops the effect based imperative updates of the nodes and embraces an almost full declarative approach while still using the `viewChildren` signal to query the checked/unchecked/intermediate state of the children.

The `selectedItemsIds` can remain a signal and its changes are processed together with the signals constructed from the user interactions (parent and children initiated node updates).

Ultimately we still need some minimal amount of effects for the following purposes:

- to update the selected item ids (folder-tree control value) based on user interaction
- to update the performance mark
- to save the last checked/unchecked state of a node in case we do not have to update it
- to cut the update cycle. The parent node updates will be prioritized over `viewChildren`-based and `writeValue`-based updates (parent and children initiated node updates).

The components usage:

```html
<fl-form-folder-tree>
  @for (node of data; track node.id) {
  <fl-form-folder-tree-node [node]="node"></fl-form-folder-tree-node>
  }
</fl-form-folder-tree>
```

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
