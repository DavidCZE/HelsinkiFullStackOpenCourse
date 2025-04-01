import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import AddNew from './components/AddNew'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {setPersons(initialPersons)})
}, [])
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setSuccessMessage(`Updated ${returnedPerson.name}'s number`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setErrorMessage(`Failed to update ${newName}'s number. It might have been removed from the server.`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter(person => person.id !== existingPerson.id));
          });
      }
      return;
    }
    const personObject = { name: newName, number: newNumber };
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setSuccessMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        setNewName('');
        setNewNumber('');
      });
  }

  const removePerson = (id) => {
    const person = persons.find(person => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          setErrorMessage(`Information of ${person.name} has already been removed from server`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <AddNew
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons 
        persons={personsToShow} 
        removePerson={removePerson} 
      />
    </div>
  )
}

export default App