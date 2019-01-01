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
    if (err.message === 'Wrong file type, please use .JPG, .PNG or .GIF') {
      ctx.status = 415;
    } else if (err.message === 'File too large') {
      ctx.status = 413;
    } else {
      ctx.status = 500;
    }
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
