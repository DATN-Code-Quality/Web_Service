const settings: AppSettings = {
  clientId: 'cd6968a3-3b9b-4658-8e2d-ce846578e092',
  tenantId: 'common',
  // graphUserScopes: ['user.read', 'mail.read', 'mail.send'],
  graphUserScopes: ['user.read'],
};

export interface AppSettings {
  clientId: string;
  tenantId: string;
  graphUserScopes: string[];
}

export default settings;
