module.exports = {
  apps: [
    // USER SERVICE (1 Instance: 3001)
    { 
      name: 'user-service', 
      script: './src/server.js', 
      cwd: './user-service',
      env: { NODE_ENV: 'production', PORT: 3001 } 
    },

    // CART SERVICE (2 Instances: 3002, 3012)
    { 
      name: 'cart-service-1', 
      script: './src/server.js', 
      cwd: './cart-service',
      env: { NODE_ENV: 'production', PORT: 3002 } 
    },
    { 
      name: 'cart-service-2', 
      script: './src/server.js', 
      cwd: './cart-service',
      env: { NODE_ENV: 'production', PORT: 3012 } 
    },

    // ORDER SERVICE (2 Instances: 3003, 3013)
    { 
      name: 'order-service-1', 
      script: './src/server.js', 
      cwd: './order-service',
      env: { NODE_ENV: 'production', PORT: 3003 } 
    },
    { 
      name: 'order-service-2', 
      script: './src/server.js', 
      cwd: './order-service',
      env: { NODE_ENV: 'production', PORT: 3013 } 
    },

    // QUERY SERVICE (1 Instance: 3005)
    { 
      name: 'query-service', 
      script: './src/server.js', 
      cwd: './query-service',
      env: { NODE_ENV: 'production', PORT: 3005 } 
    },

    // MAILER SERVICE (1 Worker)
    { 
      name: 'mailer-service', 
      script: './src/server.js', 
      cwd: './mailer-service',
      env: { NODE_ENV: 'production' } 
    }
  ]
};
