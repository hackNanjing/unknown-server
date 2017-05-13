const cluster = require('cluster');
const cpus = require('os').cpus().length;
const log4js = require('koa-log4');
const logger = log4js.getLogger(`${process.pid} master`);

if (cluster.isMaster) {
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
    cluster.on('exit', (worker, code, single) => {
      logger.info('worker', worker.process.pid, 'died', code, single);
      cluster.fork();
    });
    cluster.on('error', (...args) => {
      logger.info('Error', ...args);
    });
  }
} else {
  require('./index');
}
