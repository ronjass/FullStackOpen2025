import Person from './Person'

const Persons = ({ persons, removePerson, newFilter }) => {
    return (
    <div>
        {persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
        .map(person => (
          <Person key={person.id} 
          name={person.name} 
          number={person.number}
          removePerson={() => removePerson(person.id)}/>
    ))}
    </div>
    )
}

export default Persons