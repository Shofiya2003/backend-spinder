const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const app = express();

app.use(cookieSession({
    name: 'session',
    secret: 'secret',
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

require('dotenv').config();

const api = require('./routes/api')


app.use(bodyparser.json())

app.use(cors());

app.use('/', api)

//connecting to database
mongoose.connect('mongodb://localhost:27017/spinderDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connected to database")
}).catch(err => {
    console.log(`error connecting to database ${err}`);
})

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Express server started at port: ${port}`);
})