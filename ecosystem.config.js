module.exports = {
  apps: [
    // USER SERVICE (1 Instance: 3001)
    { name: 'user-service', script: './user-service/src/server.js', env: { NODE_ENV: 'production', PORT: 3001 } },

    // CART SERVICE (2 Instances: 3002, 3012)
    { name: 'cart-service-1', script: './cart-service/src/server.js', env: { NODE_ENV: 'production', PORT: 3002 } },
    { name: 'cart-service-2', script: './cart-service/src/server.js', env: { NODE_ENV: 'production', PORT: 3012 } },

    // ORDER SERVICE (2 Instances: 3003, 3013)
    { name: 'order-service-1', script: './order-service/src/server.js', env: { NODE_ENV: 'production', PORT: 3003 } },
    { name: 'order-service-2', script: './order-service/src/server.js', env: { NODE_ENV: 'production', PORT: 3013 } },

    // QUERY SERVICE (1 Instance: 3005)
    { name: 'query-service', script: './query-service/src/server.js', env: { NODE_ENV: 'production', PORT: 3005 } },

    // MAILER SERVICE (1 Worker)
    { name: 'mailer-service', script: './mailer-service/src/server.js', env: { NODE_ENV: 'production' } }
  ]
};
