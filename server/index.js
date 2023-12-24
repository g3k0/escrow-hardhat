const express = require('express')
const app = express()
const port = 3001

const contracts = []

app.get('/contracts', (req, res) => {
  res.json({
    contracts
  })
})

app.post('/contract', (req, res) => {
    const contract = req.body
    contracts.push(contract)
    res.send(200)
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})