import { useState, useEffect } from 'react'
import personService from './services/Persons'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  
  useEffect(() => {
    personService.getAll().then(response => setPersons(response.data))
  }, [])
  
  const handleNewNameChange = (event) => setNewName(event.target.value);
  const handleNewNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);
  
  const showNotification = (notification) => {
    setNotification(notification)
    setTimeout(() => setNotification(null), 4000)
  }
  
  const handleSubmitClick = (event) => {
    event.preventDefault()
    const newPerson = {name: newName, number: newNumber}
    for (let existingPerson of persons) {
      if (existingPerson.name === newName) {
        if (confirm(`${existingPerson.name} is already added to phonebook. Replace old number?`)) {
          personService.update(existingPerson.id, newPerson).then(response => {
            setPersons(persons.map(person => person.id == existingPerson.id ? response.data : person))
            showNotification({text: `Updated ${newPerson.name}`, error: false})
          }).catch((error) => {
            showNotification({text: `Failed to update ${newPerson.name}`, error: true})
            personService.getAll().then(response => setPersons(response.data)) // Since obviously the list has changed.
          })
        }
        return
      }
    }
    personService.create(newPerson).then(response => {
      setPersons(persons.concat(response.data))
      showNotification({text: `Added ${newPerson.name}`, error: false})
    }).catch(error => {
      showNotification({text: error.response.data.error, error: true})
    });
  }

  const handleDeleteClick = (id) => {
    personService.remove(id).then(success => {
      if (success) {
        setPersons(persons.filter(person => person.id !== id))
      }
    })
  }

  return (
    <div>
      <h2>Phonebook Add</h2>
      <Notification notification={notification} />
      <NewPersonForm newName={newName} onNewNameChange={handleNewNameChange} newNumber={newNumber} onNewNumberChange={handleNewNumberChange} onSubmitClick={handleSubmitClick} />
      <h2>Phonebook Filter</h2>
      <SearchFilter value={filter} onChange={handleFilterChange} />
      <h2>Numbers</h2>
      <PhoneBookTable persons={persons} onDeleteClick={handleDeleteClick} filter={filter} />
    </div>
  )
}

const Notification = ({notification}) => {
  if (!notification) {
    return null
  }

  const style = {
    color: notification.error ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  
  return (
    <div style={style}>{notification.text}</div>
  )
}

const NewPersonForm = ({newName, onNewNameChange, newNumber, onNewNumberChange, onSubmitClick}) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={onNewNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNewNumberChange} />
      </div>
      <div>
        <button type="submit" onClick={onSubmitClick}>add</button>
      </div>
    </form>
  )
}

const SearchFilter = ({value, onChange}) => {
  return (
    <input value={value} onChange={onChange} />
  )
}

const PhoneBookTable = ({persons, filter, onDeleteClick}) => {
  if (!persons) {
    return null
  }
  const filteredPersons = filter.length > 0 ?
      persons.filter(person => person.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) >= 0) :
      persons

  return (
    <table>
      <tbody>
        {filteredPersons.map(person => <PhoneBookRow key={person.id} onDeleteClick={onDeleteClick} person={person} />)}
      </tbody>
    </table>
  )
}

const PhoneBookRow = ({person, onDeleteClick}) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td><button onClick={() => onDeleteClick(person.id)}>delete</button></td>
    </tr>
  )
}

export default App