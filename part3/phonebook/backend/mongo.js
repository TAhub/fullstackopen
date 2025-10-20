const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('did not provide a password!')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://theodoreabshire_db_user:${password}@fullstackopen.cnmbler.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpen`
mongoose.set('strictQuery', true)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // This is a query.
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // This is an add operation.
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('invalid number of arguments!')
  mongoose.connection.close()
}