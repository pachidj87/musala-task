export const environment = {
  production: true,
  servicesURL: 'http://api:3000',
  constants: {
    cacheSize: 1,
    refreshInterval: 30000,
    retries: 3,
    delay: 500,
    notificationPosition: 'bottom-right',
    excludedStatus: [400, 401, 403], // Excluded status from reply the request
    maxDevicesPerGatewayAllowed: 10
  },
};
