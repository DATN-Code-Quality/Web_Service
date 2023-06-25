const settings: AppSettings = {
  clientId: 'cd6968a3-3b9b-4658-8e2d-ce846578e092',
  secretId: 'K3X8Q~KCCjA2Qz_jqNwWZXFKbLhWtzC0h3djkakF',

  // clientId: '9db64d5c-3b3d-4b04-aa30-1d904b106615',
  tenantId: 'common',
  // graphUserScopes: ['user.read', 'mail.read', 'mail.send'],
  graphUserScopes: ['user.read'],
};

export interface AppSettings {
  clientId: string;
  secretId: string;
  tenantId: string;
  graphUserScopes: string[];
}

export default settings;
