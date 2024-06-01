const Koa = require('koa')
const Router = require('koa-router')
const { koaBody } = require('koa-body')
const cors = require('@koa/cors')
const { v4: uuidv4 } = require('uuid')
const { format } = require('date-fns')

const app = new Koa()
const router = new Router()

app.use(cors())
app.use(koaBody())

const tickets = new Map()
const formatDate = (timestamp) => format(timestamp, 'dd.MM.yy HH:mm')

// Начальные данные
const initialTickets = [
  {
    name: 'Поменять краску в принтере',
    description: 'Поменять черную и синию краску в принтере, ком. 404',
    status: false,
  },
  { name: 'Переустановить Windows, ПК-Hall24', description: '', status: true },
  {
    name: 'Установить обновление KB-XXX',
    description: 'Вышло критическое обновление для Windows, нужно поставить обновления.',
    status: true,
  },
]

initialTickets.forEach((ticket) => {
  const id = uuidv4()
  tickets.set(id, {
    id,
    name: ticket.name,
    description: ticket.description,
    status: ticket.status,
    created: formatDate(Date.now()),
  })
})

// Получить список всех тикетов
router.get('/tickets', (ctx) => {
  const allTickets = Array.from(tickets.values()).map(
    ({ id, name, status, created, description }) => ({
      id,
      name,
      status,
      created,
      description,
    }),
  )
  ctx.body = allTickets
})

// Получить тикет по ID
router.get('/tickets/:id', (ctx) => {
  const { id } = ctx.params
  if (tickets.has(id)) {
    ctx.body = tickets.get(id)
  } else {
    ctx.status = 404
    ctx.body = { error: 'Тикет не найден' }
  }
})

// Создать новый тикет
router.post('/tickets', (ctx) => {
  try {
    const { name, description, status } = ctx.request.body
    console.log(ctx.request.body)
    if (name && description && typeof status === 'boolean') {
      const id = uuidv4()
      const created = formatDate(Date.now())
      const newTicket = { id, name, description, status, created }
      tickets.set(id, newTicket)
      ctx.status = 201
      ctx.body = newTicket
    } else {
      ctx.status = 400
      ctx.body = { error: 'Плохой запрос' }
    }
  } catch (error) {
    console.error('Ошибка создания тикета:', error)
    ctx.status = 500
    ctx.body = { error: 'Сервер не смог выполнить запрос из-за непредвиденной ошибки' }
  }
})

// Обновить тикет
router.patch('/tickets/:id', (ctx) => {
  const { id } = ctx.params
  const { name, description, status } = ctx.request.body

  if (tickets.has(id)) {
    const ticket = tickets.get(id)
    ticket.name = name !== undefined ? name : ticket.name
    ticket.description = description !== undefined ? description : ticket.description
    ticket.status = status !== undefined ? status : ticket.status
    tickets.set(id, ticket)

    ctx.status = 200
    ctx.body = ticket
  } else {
    ctx.status = 404
    ctx.body = { error: 'Тикет не найден' }
  }
})

// Удалить тикет по ID
router.delete('/tickets/:id', (ctx) => {
  const { id } = ctx.params
  if (tickets.has(id)) {
    tickets.delete(id)
    ctx.status = 204
  } else {
    ctx.status = 404
    ctx.body = { error: 'Тикет не найден' }
  }
})

app.use(router.routes()).use(router.allowedMethods())

const port = 3001
app.listen(port, () => {
  console.log(`Ура! Сервер запущен на порту ${port}`)
})
