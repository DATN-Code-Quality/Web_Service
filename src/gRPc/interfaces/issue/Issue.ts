export interface Issue {
  total: number;
  p: number;
  ps: number;
  effortTotal: number;
  issues: IssueDetail[];
  components: ComponentDetail[];
  //   facets: object[];
}

export interface IssueDetail {
  key: string;
  rule: string;
  severity: string;
  component: string;
  project: string;
  line: number;
  hash: string;
  textRange: TextRange;
  // flows: object[];
  status: string;
  message: string;
  effort: string;
  debt: string;
  //   tags: string[];
  creationDate: string;
  updateDate: string;
  type: string;
  scope: string;
}

export interface ComponentDetail {
  key: string;
  enabled: boolean;
  qualifier: string;
  name: string;
  longName: string;
  path: string;
}

export interface TextRange {
  startLine: number;
  endLine: number;
  startOffset: number;
  endOffset: number;
}

// export interface FacetsDetail {
// }
