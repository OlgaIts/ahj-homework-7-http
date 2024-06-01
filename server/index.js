// const http = require('http')
// const Koa = require('koa')
// const cors = require('@koa/cors')
// const { koaBody } = require('koa-body')
// const app = new Koa()
// app.use(cors())
// app.use(koaBody())

// const tickets = [
//   { id: 1, name: 'Hello World', status: true, created: '24.05.2024' },
//   { id: 2, name: 'Hi World', status: false, created: '24.06.2024' },
// ]
// let nextId = 1

// app.use(async (ctx, next) => {
//   console.log(ctx.response)

//   next()
//   // const { method } = ctx.request.querystring
//   // console.log(ctx)
//   // switch (method) {
//   //   case 'allTickets':
//   //     ctx.response.body = tickets
//   //     return
//   //   default:
//   //     ctx.response.status = 404
//   //     return
//   // }
// })

// const server = http.createServer(app.callback())
// server.listen(3000, () => {
//   console.log('сервер запущен на порту 3000')
// })
