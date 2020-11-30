import { environment as defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  app: {
    baseUrl: 'https://citizen-portal.com/',
  },
  api: {
    baseUrl: 'https://api.citizen-portal.com/',
  },
};
