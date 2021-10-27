const express = require('express')

const app = express()

const port = 3000

app.listen(port, () => {
  console.log(`I'm listening on http://localhost:${port}`);
})

const router = require('./src/router')

app.use(express.urlencoded({ extended: true }))
app.use('/', router)