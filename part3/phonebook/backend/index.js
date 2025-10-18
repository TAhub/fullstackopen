const express = require('express')
const morgan = require('morgan')
require('dotenv').config() // Must be imported before Person
const Person = require('./models/person')

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
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  })
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body
  if (!newPerson.name) {
    return response.status(400).json({error: 'name missing'})
  }
  if (!newPerson.number) {
    return response.status(400).json({error: 'name missing'})
  }
  Person.find({name: newPerson.name}).then(result => {
    if (result.length > 0) {
      return response.status(400).json({error: 'name already exists'})
    }
    const person = new Person({
      name: newPerson.name,
      number: newPerson.number,
    })
    person.save().then(result => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      response.json(newPerson);
    })
  });
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})