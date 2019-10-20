'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.post('/createApp', (req, res) => {
    console.log(req.body);
    network.createApp(req.body.appId, req.body.name, req.body.ver, req.body.comdate)
                .then((response) => {
                    res.send(response);
    });    
});

app.listen(process.env.PORT || 8081);