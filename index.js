const Koa = require('koa');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const log4js = require('koa-log4');
const cors = require('kcors');
const mongoose = require('mongoose');
const apis = require('./apis');
const auth = require('./middlewares/auth');
const logger = log4js.getLogger('app');

require('./services/jobs').start();

let url = `mongodb://${config.mongo.host}/${config.mongo.db}`;
if (config.mongo.authSource) {
  url = `mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.host}/${config.mongo.db}?authSource=${config.mongo.authSource}`;
}
if (config.mongo.replicaSet) {
  url = `${url}&replicaSet=${config.mongo.replicaSet}`;
}

mongoose.Promise = Promise;
mongoose.connect(url);

const app = new Koa();

app.keys = ['mina'];
app.use(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }));

app.use(bodyParser({
  onerror: (err, ctx) => {
    ctx.throw(err, 422);
  },
}));
app.use(cors({
  credentials: true,
  keepHeadersOnError: true,
}));
app.use(apis.routes());

app.on('error', (err) => {
  if (err.status && err.status < 500) return;
  console.error(err.stack);
});

const server = app.listen(config.port, () => logger.info(`Listening on port ${config.port}, god bless ${config.name}!`));
module.exports = server;
