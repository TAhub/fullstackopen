const express = require('express')
const morgan = require('morgan')
require('dotenv').config() // Must be imported before Person
const Person = require('./models/person')

const app = express()

// Define first-pass middleware:

app.use(express.static('backend/static'))
app.use(express.json())
app.use(morgan((tokens, request, response) => {
  const components = [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms'
  ]
  const method = tokens.method(request, response)
  if (method == 'POST' || method == 'PUT') {
    components.push(JSON.stringify(request.body))
  }
  return components.join(' ')
}))


// Define request handlers:

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
  const newPerson = request.body
  Person.findById(request.params.id).then(person => {
    if (!person) {
      return response.status(404).end()
    }
    person.name = newPerson.name
    person.number = newPerson.number
    return person.save().then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body
  if (!newPerson.name) {
    return response.status(400).json({error: 'name missing'})
  }
  if (!newPerson.number) {
    return response.status(400).json({error: 'name missing'})
  }
  Person.find({name: newPerson.name}).then(existingPersons => {
    if (existingPersons.length > 0) {
      return response.status(400).json({error: 'name already exists'})
    }
    const person = new Person({
      name: newPerson.name,
      number: newPerson.number,
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))
  }).catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(result => {
    const numPeople = result.length
    const date = new Date()
    response.send(
      '<p>Phonebook has info for ' + numPeople + ' people</p>' +
      '<p>' + date + '</p>'
    )
  }).catch(error => next(error))
})


// Define error/fallback handlers:

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
})

app.use((error, request, response, next) => {
  console.log('Error:', error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
})


// And now listen:

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})