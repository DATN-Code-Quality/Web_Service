export interface RuleOverview {
  key: string;
  lang: string;
  langName: string;
  name: string;
  status: string;
}

export interface RuleDetail {
  key: string;
  repo: string;
  lang: string;
  langName: string;
  name: string;
  type: string;
  severity: string;
  debtRemFnOffset: string;

  htmlDesc: string;
  mdDesc: string;

  status: string;
  scope: string;
  createdAt: Date;
}
