const express = require('express')
const fs = require('fs')
let contacts = require('./contacts.json')
const app = express()

app.use(express.json())

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
}

app.get('/api/persons', requestLogger, (req, res) => {
    res.json(contacts);
})

app.get('/api/info', requestLogger, (req, res) => {
    let allContacts = `Phonebook currently has ${contacts.length} contacts.`
    message = `${allContacts}<br>${new Date()}`
    res.send(message);
})

app.get('/api/persons/:id', requestLogger, (req, res) => {
    const id = req.params.id
    const person = contacts.find(p => p.id === id)
    if(person)
        res.json(person)
    else
        res.status(404).end()
})

app.delete('/api/persons/:id', requestLogger, (req, res) => {
    const id = req.params.id
    contacts = contacts.filter(p => p.id != id)
    fs.writeFileSync('./contacts.json', JSON.stringify(contacts, null, 4))
    res.status(204).end()
})

app.post('/api/persons', requestLogger, (req, res) => {
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
    fs.writeFileSync('./contacts.json', JSON.stringify(contacts, null, 4))
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})
