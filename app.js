const Koa = require('koa');

const logger = require('koa-logger');
const imageRoutes = require('./image_route');

const app = new Koa();
const PORT = process.env.PORT || 3000;


app.use(logger());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
        error: {
            message: err.message
        }
    };
  }
});

app.use(imageRoutes.routes());
app.use(imageRoutes.allowedMethods());

const server = app.listen(PORT);

module.exports = server;
