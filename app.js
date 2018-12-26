const koa = require('koa');
const app = new koa();
const logger = require('koa-logger');
const imageRoutes = require('./image_route');

app.use(logger());

app.use(imageRoutes.routes());
app.use(imageRoutes.allowedMethods());
app.listen(3000);
  
app.on('error', (err, ctx) => {
    console.log("error method", err.message)
    ctx.status = err.status || 500;
    ctx.body = {
        error: {
            message: err.message
        }
    };
});
