const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = [{name:'name'}]

app.get('/users', (req,res)=>{
  res.json(users)
})

app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt() //generates salt aka random string to make hash unpredictable
    const hashedPassword = await bcrypt.hash(req.body.password, salt) //appends salt to hashed password
    // console.log(salt, 'salt')
    // console.log(hashedPassword, 'hashedpassword')
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success passwords do match')// if passwords match
    } else {
      res.send('Not Allowed passwords dont match')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(3000)
