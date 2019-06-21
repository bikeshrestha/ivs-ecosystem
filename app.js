const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const config = require('./config/config')
const ApiRouter = require('./routes/route')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/', ApiRouter);
app.listen(config.port, () => console.log(`IVS ecosystem is up and running on port ${config.port}!`));
