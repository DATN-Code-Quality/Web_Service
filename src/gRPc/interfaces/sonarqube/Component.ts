export interface Components {
  paging: Paging;
  components: Component[];
}

export interface Paging {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export interface Component {
  key: string;
  name: string;
  qualifier: string;
  path: string;
  uuid: string;
}

export interface ComponentRequest {
  submissionId: string;
  // page: number;
  // pageSize: number;
}

export interface ComponentResponse {
  data: Components;
  error: number;
  message: string;
}
