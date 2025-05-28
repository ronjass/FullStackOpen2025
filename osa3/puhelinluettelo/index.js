require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => {
    const length = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${length} people <br/> ${date}</p>`)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (!number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: name,
    number: number,
  })

  Person.find({}).then(persons => {
    const names = persons.map(p => p.name)
    if (names.includes(person.name)) {
      Person.findByIdAndUpdate(person.id, person, { new: true })
        .then((updatedPerson) => {
          response.json(updatedPerson)
        })
        .catch(error => next(error))
    } else {
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
        .catch(error => next(error))
    }
  })
})

morgan.token('body', request => {
  return JSON.stringify(request.body)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  if (!number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person.findByIdAndUpdate(request.params.id, { name, number },
    { new: true, runValidators:true, context:'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})