const headers = {
  'Content-Type': 'application/json',
}
const url = 'http://localhost:3001/tickets'

export const getTickets = async () => {
  try {
    let response = await fetch(url)
    if (response.ok) {
      let tickets = await response.json()
      return tickets
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export const createRequest = async (data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...data, status: false }),
    })

    if (response.ok) {
      const createdTicket = await response.json()
      return createdTicket
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export const updateRequest = async (data) => {
  const { id } = data

  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const updatedTicket = await response.json()
      return updatedTicket
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export const updateTicketStatus = async (data) => {
  const { id } = data
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const updatedTicket = await response.json()
      return updatedTicket
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

export const deleteRequest = async (id) => {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      return 'success'
    } else {
      return 'fail'
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
