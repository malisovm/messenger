const express = require('express')
const expressServer = express()
const http = require('http').createServer(expressServer)
const mongoose = require('mongoose')
const Schema = mongoose.Schema
//expressServer.use(express.static(__dirname + '/app'))
//expressServer.get('/', function (request, response) {
//  response.sendFile(__dirname + '/app/index.html')
//})
const JSONParser = express.json({ type: 'application/json' })

mongoose.connect(
  'mongodb+srv://user12345:12345@cluster1.mgmwwie.mongodb.net/messaging',
  //'mongodb://localhost:27017/messagesdb',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) return console.log(err)
    else if (mongoose.connection.readyState === 1)
      console.log('Mongoose connection established')
    http.listen(process.env.PORT || 3001, function () {
      var port = http.address().port
      console.log('App listening at PORT', port)
    })
  }
)

const messagesScheme = new Schema({
  sender: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: String, required: true },
})

const recipientsScheme = new Schema({
  _id: { type: String, required: true },
  messages: [messagesScheme],
})
const Recipient = mongoose.model('Recipient', recipientsScheme)

expressServer.post('/login', JSONParser, async (request, response) => {
  try {
    let existingSender = await Recipient.findOne({
      _id: { $eq: request.body._id },
    }).exec()
    if (existingSender) {
      console.log(`User logged in: ${request.body._id}`)
    } else {
      let recipient = new Recipient({ _id: request.body._id, messages: [] })
      recipient.save().then(() => {
        console.log(`Created new recipient: ${request.body._id}`)
        response.send(`Created new recipient: ${request.body._id}`)
      })
    }
  } catch (err) {
    response.status(400).send({
      message: err.message,
    })
  }
})

expressServer.post('/messages', JSONParser, (request, response) => {
  try {
    console.log(request.body)
    response.send(`Message sent: ${JSON.stringify(request.body)}`)
    Recipient.findOneAndUpdate(
      { _id: { $eq: request.body.recipient } },
      {
        $push: {
          messages: {
            sender: request.body.sender,
            title: request.body.title,
            body: request.body.body,
            date: request.body.date,
          },
        },
      }
    ).then(() => {
      console.log('Messaged added')
    })
  } catch (err) {
    response.status(400).send({
      message: err.message,
    })
  }
})

expressServer.get('/userlistandmessages', (request, response) => {
  try {
    Recipient.find({}, (err, users) => {
      let usernames = []
      users.forEach((user) => usernames.push(user._id))
      let user = users.find((user) => user._id === request.headers.user)
      if (user.messages) {
      response.send({ userMessages: user.messages, userList: usernames })}
    })
  } catch (err) {
    console.log(err)
    response.status(400).send({
      message: err.message,
    })
  }
})
