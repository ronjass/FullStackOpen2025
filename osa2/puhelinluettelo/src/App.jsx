import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import Error from './components/Error'
import Filter from './components/Filter'
import personsService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newFilter, setShowFilter] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = 
        { name: newName, 
          number: newNumber
        }
    if (persons.find(person => person.name === newName)) {
      const person = persons.find(p => p.name === newName)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService
          .update(person.id, nameObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id != returnedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setInfoMessage(
              `Changed the number of ${person.name}`
            )
            setTimeout(() => {
              setInfoMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${person.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    } else {
      personsService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setInfoMessage(
            `Added ${newName}`
          )
          setTimeout(() => {
            setInfoMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data)
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
    
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const removePerson = (id) => {
    console.log('person ' + id + ' needs to be deleted')
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${persons.find(p => p.id === id).name} ?`)) {
      personsService
        .removeObject(id)
        .then((response) => {
          setPersons(persons.filter(p => p.id !== id))
          setInfoMessage(
            `Deleted ${person.name}`
          )
          setTimeout(() => {
            setInfoMessage(null)
          }, 5000)
        })

    }
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setShowFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification info={infoMessage}/>
      <Error message={errorMessage}/>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new person</h3>
      <PersonForm name={newName} number={newNumber}
      handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}
      addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={persons}
      removePerson={removePerson}
      newFilter={newFilter}
      />
    </div>
  )

}

export default App
