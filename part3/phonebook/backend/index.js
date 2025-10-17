const express = require('express')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')

// Set up Mongoose.
const password = process.argv[2]
const url = `mongodb+srv://theodoreabshire_db_user:${password}@fullstackopen.cnmbler.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpen`
mongoose.set('strictQuery', true)
mongoose.connect(url)

// Create a schema for Person entries.
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model('Person', personSchema)

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
app.use(express.static('backend/static'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
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
  /*
  const id = request.params.id
  phonebookData = phonebookData.filter(person => person.id !== id)
  response.status(204).end()
  */
  response.status(404).end() // TODO: re-implement
})

app.post('/api/persons', (request, response) => {
  response.status(404).end() // TODO: re-implement
  /*
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
  */
})

app.get('/info', (request, response) => {
  Person.find({}).then(result => {
    const numPeople = result.length
    const date = new Date()
    response.send(
      '<p>Phonebook has info for ' + numPeople + ' people</p>' +
      '<p>' + date + '</p>'
    )
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})