const express = require('express');
const bodyParser = require('body-parser');

let dataStore = require('./modules/dataStore');
const calculate = require('./modules/calculate');

const app = express();
const PORT = 5000;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});

app.get('/getData' , (req, res) => {
    res.send(dataStore);
});

app.post('/calculate', (req, res) => {
    dataStore.push(calculate(req.body));
    res.sendStatus('200');
});

app.delete('/delete' , (req, res) => {
    dataStore = [];
    res.sendStatus('200');
});