const Person =({ id, name, number, removePerson }) => {
    return (
        <div key={id}>
            {name} {number} <button onClick={removePerson}>delete</button>
        </div>
    )
}

export default Person