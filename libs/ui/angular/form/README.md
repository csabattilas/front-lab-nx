# Angular Form Components Library

A collection of reusable Angular form components built with modern Angular patterns. This library provides standalone form components that can be easily integrated into any Angular application within the workspace.

## Components

### Folder Tree

A hierarchical folder tree component with selection capabilities:

- `FolderTreeComponent`: Main component that implements `ControlValueAccessor` and provides context for the tree structure
- `FolderTreeCtxComponent`: Context provider component that manages tree selection state
- Node components:
  - `FolderTreeNodeOtpComponent`: Optimized tree node implementation
  - `FolderTreeNodeVcComponent`: View container implementation of tree nodes

### Checkbox

Custom checkbox component with enhanced functionality and styling.

## Usage

Import the required components in your Angular module or standalone component:

```typescript
import {
  FolderTreeComponent,
  FolderTreeCtxComponent,
} from '@front-lab-nx/ui/angular/form';
```

Example usage of folder tree:

```html
<fl-form-folder-tree-ctx>
  <fl-form-folder-tree [items]="folderItems"></fl-form-folder-tree>
</fl-form-folder-tree-ctx>
```

## Testing Components

### View in Angular App

To test these components in action:

1. Start the Angular application:
   ```bash
   pnpm nx serve angular-app
   ```
2. Navigate to the components demo page in the browser

### Running Unit Tests

Run the unit tests for this library:

```bash
# Run tests for the entire library
pnpm nx test ng-form

# Run tests with coverage
pnpm nx test ng-form --coverage
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
