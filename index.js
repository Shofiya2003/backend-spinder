const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyparser.json())

app.use(cors());

const port = process.env.PORT || 8000

app.listen(port, () => {
    logger.info(`Express server started at port: ${port}`);
})