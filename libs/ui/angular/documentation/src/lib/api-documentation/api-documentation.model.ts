export interface ApiEntryBlock {
  name: string;
  type: string;
  description?: string;
}

export interface ApiDocumentationBlock {
  name: string;
  entries: ApiEntryBlock[];
}
