require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


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
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {

  const body = request.body

  console.log('body', body)

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: !body.name ? 'content name missing' : 'content number missing'
    })
  }


  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

app.put('/api/persons/:id', (request, response, next) => {

  const body = request.body

  console.log('body', body)

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: !body.name ? 'content name missing' : 'content number missing'
    })
  }

  Person.findByIdAndUpdate(request.params.id, body, { new: true}).then(person => {
    response.json(person)
    if(!person){
      return response.status(404).json({error: 'person not found'})
    }
    response.status(200).end()
  }) 
  .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  //console.log('request', request)
  response.status(404).send({ error: 'unknown endpoint'})
}


app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})