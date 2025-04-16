import Person from './Person'

const Persons = ({ persons, removePerson }) => {
    return (
    <div>
        {persons.map(person => (
          <Person key={person.id} 
          name={person.name} 
          number={person.number}
          removePerson={() => removePerson(person.id)}/>
    ))}
    </div>
    )
}

export default Persons