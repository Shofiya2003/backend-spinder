const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const api = require('./routes/api')

const app = express();

app.use(bodyparser.json())

app.use(cors());

app.use('/', api)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Express server started at port: ${port}`);
})