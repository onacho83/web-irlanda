module.exports = {
  apps: [
    {
      name: 'save-config',
      script: 'server/save-config.js',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        // Define DEPLOY_TOKEN via environment or pm2 ecosystem file
        DEPLOY_TOKEN: 'your-deploy-token-here'
      },
      out_file: './logs/save-config-out.log',
      error_file: './logs/save-config-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ]
};

// Usage:
// 1) Install pm2: npm i -g pm2
// 2) Start with: pm2 start deploy/ecosystem.config.js
// 3) Save startup script: pm2 startup && pm2 save
