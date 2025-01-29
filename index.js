const express = require('express')
const app = express()

app.use(express.json())

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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  person ? response.json(person) : response.status(404).end()
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
  console.log('match', match.length)
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

  console.log('checkForDuplicateName()', checkForDuplicateName(body.name))

  if(checkForDuplicateName(body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }


  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  console.log('person', person)

  persons = persons.concat(person)

  response.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})