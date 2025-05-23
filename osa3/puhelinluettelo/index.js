require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

//let persons = []

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    })
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

    //if (persons.find((person) => person.name === body.name)) {
        //return response.status(400).json({
            //error: 'name nust be unique'
        //})
    //}

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

    morgan.token('body', request => {
        return JSON.stringify(request.body)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})