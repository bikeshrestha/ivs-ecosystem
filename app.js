const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config/config')
const ApiRouter = require('./routes/route')
const expressValidator = require('express-validator')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/', ApiRouter);
app.listen(config.port, () => console.log(`IVS ecosystem is up and running on port ${config.port}!`));
