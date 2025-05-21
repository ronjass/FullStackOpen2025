const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(persons => persons.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
 
app.get('/api/info', (request, response) => {
    const person_count = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${person_count} people <br/> ${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateID = () => {
    let id = Math.floor(Math.random() * 100000).toString()
    while (persons.find((person) => person.id === id)) {
        id = Math.floor(Math.random() * 100000).toString()
    }
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.find((person) => person.name === body.name)) {
        return response.status(400).json({
            error: 'name nust be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateID(),
    }

    persons = persons.concat(person)
    response.json(person)

    morgan.token('body', request => {
        return JSON.stringify(request.body)
      })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})