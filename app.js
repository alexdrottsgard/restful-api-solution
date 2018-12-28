const Koa = require('koa');

const logger = require('koa-logger');
const imageRoutes = require('./image_route');

const app = new Koa();
const PORT = process.env.PORT || 3000;


app.use(logger());

app.use(imageRoutes.routes());
app.use(imageRoutes.allowedMethods());
// app.listen(3000);
  
// app.on('error', (err, ctx) => {
//     console.log("error method", err.message)
//     ctx.status = err.status || 500;
//     ctx.body = {
//         error: {
//             message: err.message
//         }
//     };
// });

const server = app.listen(PORT).on("error", err => {
    console.error(err);
  });

module.exports = server;
