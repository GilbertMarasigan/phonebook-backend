require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  
  const currentDateAndTime = new Date()
  const message = `<p>Phonebook has info for ${persons.length} people</p><p>${currentDateAndTime}</p>`
  console.log('currentDateAndTime', )
  response.send(message)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const id =  Math.floor(Math.random() * 10000000)
  return id
}

const checkForDuplicateName = (name) => {
  const match = persons.filter((person) => person.name == name )

  return match.length > 0 ? true : false
}

app.post('/api/persons', (request, response) => {

  const body = request.body

  console.log('body', body)

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: !body.name ? 'content name missing' : 'content number missing'
    })
  }

  /*

  console.log('checkForDuplicateName()', checkForDuplicateName(body.name))

  if(checkForDuplicateName(body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  */


  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

const unknownEndpoint = (request, response) => {
  //console.log('request', request)
  response.status(404).send({ error: 'unknown endpoint'})
}


app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})