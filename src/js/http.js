import {
  createRequest,
  updateTicketStatus,
  updateRequest,
  deleteRequest,
  getTickets,
} from './services'

const button = document.querySelector('.add_btn')
//Add Modal
const addModal = document.querySelector('.add_modal')
const addForm = document.querySelector('.add_form')
const addInput = document.querySelector('.add_input')
const addArea = document.querySelector('.add_area')
const cancelBtns = document.querySelectorAll('.cancel_btn')
const modalTitle = document.querySelector('.add_modal-title')
//Delete Modal
const deleteModal = document.querySelector('.delete_modal')
const confirmButton = document.querySelector('.confirm_btn')

//______________________________________________________________________Создание тикета
const createItem = (ticket) => {
  const list = document.querySelector('.list')
  const item = document.createElement('li')
  item.className = 'ticket'
  item.id = ticket.id
  item.innerHTML += ` 
  <div class="name_wrapper">
    <button class="ticket_btn status_btn">${ticket.status ? '✓' : ''}</button>
    <div >
      <p class="ticket_name ">${ticket.name}</p>
      <div class="desc_wrapper">
        <p class="ticket_desc">${ticket.description}</p>
      </div>
    </div>
  </div>
  <div class="btns_wrap">
    <span class="ticket_date">${ticket.created}</span>
    <button class="ticket_btn edit_btn" id=${ticket.id}>✎</button>
    <button class="ticket_btn delete_btn" id=${ticket.id}>✕</button>
  </div>
  `

  list.appendChild(item)

  //_____________________________________________________________ Удалить тикет по ID
  const deleteButtons = item.querySelectorAll('.delete_btn')
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      deleteModal.classList.add('active')

      //________________________________________________________________
      confirmButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const response = await deleteRequest(ticket.id)
        if (response === 'success') {
          item.remove()
          deleteModal.classList.remove('active')
        }
        if (response === 'fail') {
          deleteModal.classList.remove('active')
        }
      })
    })
  })

  //_______________________________________________________________ меняет статус тикета
  const statusButton = item.querySelector('.status_btn')
  statusButton.innerHTML = ticket.status
    ? (statusButton.innerHTML = '✓')
    : (statusButton.innerHTML = '')

  statusButton.addEventListener('click', async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const updatedStatus = await updateTicketStatus({
      id: item.id,
      status: statusButton.innerHTML === '✓' ? false : true,
    })

    if (updatedStatus) {
      statusButton.innerHTML = updatedStatus.status
        ? (statusButton.innerHTML = '✓')
        : (statusButton.innerHTML = '')
    }
    // ticket.status = !ticket.status
  })

  //_______________________________________________________________ Редактирует тикет
  const editButtons = item.querySelectorAll('.edit_btn')
  editButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      addModal.classList.add('active')
      modalTitle.textContent = 'Изменить тикет'
      addInput.value = ticket.name
      addArea.value = ticket.description
      addModal.id = ticket.id
    })
  })

  //_______________________________________________________________ Подробное описание тикета
  item.addEventListener('click', () => {
    const desc = item.querySelector('.ticket_desc')
    desc.classList.toggle('active')
  })
}

// _________________________________________________________________ Отобразить все тикеты
const renderTickets = async () => {
  const tickets = await getTickets()
  if (tickets && tickets.length > 0) {
    tickets.map((ticket) => {
      createItem(ticket)
    })
  }
}
renderTickets()

const rerenderTickets = () => {
  const list = document.querySelector('.list')
  list.innerHTML = ''
  renderTickets()
}

const createTicket = async (data) => {
  const newTicket = await createRequest(data)

  if (newTicket) {
    createItem(newTicket)
    addInput.value = ''
    addArea.value = ''
    addModal.classList.remove('active')
  }
}

const updateTicket = async (data) => {
  const updatedTicket = await updateRequest(data)

  if (updatedTicket) {
    rerenderTickets()
    addInput.value = ''
    addArea.value = ''
    addModal.classList.remove('active')
    addModal.id = ''
  }
}

//_______________________________________________________________отправка формы
addForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const ticketId = addModal.id
  const form = e.target
  const formData = new FormData(form)

  const data = {
    id: ticketId,
    name: formData.get('name'),
    description: formData.get('description'),
  }
  ticketId ? updateTicket(data) : createTicket(data)
})

// ______________________________________________________________Открыть модалку
button.addEventListener('click', (e) => {
  e.preventDefault()
  modalTitle.textContent = 'Добавить тикет'
  addModal.classList.add('active')
})

// ____________________________________________________________закрыть модалки
cancelBtns.forEach((element) => {
  element.addEventListener('click', (e) => {
    e.preventDefault()
    addInput.value = ''
    addArea.value = ''
    addModal.classList.remove('active')
    deleteModal.classList.remove('active')
  })
})
