const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

let contacts = [
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

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    res.json(contacts);
})

app.get('/api/info', (req, res) => {
    let allContacts = `Phonebook currently has ${contacts.length} contacts.`
    message = `${allContacts}<br>${new Date()}`
    res.send(message);
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = contacts.find(p => p.id === id)
    if(person)
        res.json(person)
    else
        res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    contacts = contacts.filter(p => p.id != id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const name = body.name
    if(contacts.find(p => p.name === name))
        return res.status(400).json({error: 'Name already exists'})
    const person = {
        id: Math.ceil(Math.random() * (1000 - 4) + 4),
        name: body.name,
        number: body.number
    }
    contacts = contacts.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})
