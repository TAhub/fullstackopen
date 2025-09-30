const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan((tokens, request, response) => {
  const components = [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms'
  ]
  if (tokens.method(request, response) == 'POST') {
    components.push(JSON.stringify(request.body))
  }
  return components.join(' ')
}))

let phonebookData = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(phonebookData)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const data = phonebookData.find(person => person.id === id)
  if (data) {
    response.json(data)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebookData = phonebookData.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  //const id = phonebookData.length > 0 ? 1 + Math.max(...phonebookData.map(p => Number(p.id))) : 1
  const id = Math.floor(Math.random() * 1000000)
  const newPerson = request.body
  if (!newPerson.name) {
    return response.status(400).json({error: 'name missing'})
  }
  if (!newPerson.number) {
    return response.status(400).json({error: 'name missing'})
  }
  if (phonebookData.find(person => person.name === newPerson.name)) {
    return response.status(400).json({error: 'name already exists'})
  }
  newPerson.id = String(id)
  phonebookData = phonebookData.concat(newPerson)
  response.json(newPerson)
})

app.get('/info', (request, response) => {
  const numPeople = phonebookData.length
  const date = new Date()
  response.send(
    '<p>Phonebook has info for ' + numPeople + ' people</p>' +
    '<p>' + date + '</p>'
  )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})