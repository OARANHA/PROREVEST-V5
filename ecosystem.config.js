module.exports = {
  apps: [{
    name: 'prorevest-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/prorevest',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/prorevest/error.log',
    out_file: '/var/log/prorevest/out.log',
    log_file: '/var/log/prorevest/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
