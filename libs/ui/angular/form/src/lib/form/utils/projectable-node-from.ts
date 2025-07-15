import { TemplateRef } from '@angular/core';

export function projectableNodesFrom<T>(
  template: TemplateRef<T>,
  context: T
): Node[] {
  const viewRef = template.createEmbeddedView(context);
  viewRef.detectChanges();
  const nodes = viewRef.rootNodes;
  viewRef.destroy();
  return nodes;
}
