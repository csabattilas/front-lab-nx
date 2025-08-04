# Angular Form Components Library

A collection of reusable Angular form components built with modern Angular patterns. This library provides standalone form components that can be easily integrated into any Angular application within the workspace.

## Form Components

### Checkbox Tree

A hierarchical checkbox tree component that allows selecting items in a tree structure. The component is built using Angular signals and supports both server-side rendering (SSR) and client-side rendering.

#### Features

- **Custom Checkbox Support**: Allows using any checkbox-like component that implements the `CheckboxLike` interface
- **Angular 20 Features**: Leverages Angular 20's direct input/output binding with ngComponentOutlet
- **Hierarchical Selection**: Supports parent-child relationships with proper indeterminate states

#### Input data structure

The tree is built based on a JSON data structure. An example of this structure can be found here:

`libs/api/angular/src/lib/ng-api/implementations/mock/mock-data.ts`

Based on this data, the tree repository will build on more suitable data structure, which is fed to the folder tree component when used.

#### Basic usage:

```html
<fl-form-checkbox-tree [data]="data">
  @for (node of data; track node.id) {
  <fl-form-checkbox-tree-node [node]="node"></fl-form-checkbox-tree-node>
  }
</fl-form-checkbox-tree>
```

#### Using Custom Checkbox Components

You can provide your own checkbox component as long as it implements the `CheckboxLike` interface:

```typescript
interface CheckboxLike {
  checked: boolean | InputSignal<boolean>;
  indeterminate: boolean | InputSignal<boolean>;
  change: EventEmitter<boolean>;
}
```

Example with a custom checkbox component:

```html
<fl-form-checkbox-tree [data]="data" [checkboxComponent]="CustomCheckbox">
  @for (node of data; track node.id) {
  <fl-form-checkbox-tree-node [node]="node"></fl-form-checkbox-tree-node>
  }
</fl-form-checkbox-tree>
```

### Checkbox

Custom checkbox component with enhanced functionality and styling. It is just a basic nicer checkbox.

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
