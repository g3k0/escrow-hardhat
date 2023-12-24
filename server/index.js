const express = require('express')
var cors = require('cors')
const app = express()
const port = 3001

app.use(cors())
app.use(express.json()) 

const contracts = []

app.get('/contracts', (req, res) => {
  res.json({
    contracts
  })
})

app.post('/contract', (req, res) => {
    const contract = req.body

    console.log(req.body)

    contracts.push(contract)
    res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})