const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')

const path = require('path');

const app = express();
const jsonParser = bodyParser.json()

const port = process.env.PORT || 8080;

var onlyEmoji = require('emoji-aware').onlyEmoji; // returns list of emojis
var withoutEmoji = require('emoji-aware').withoutEmoji; // returns list of text

app.use(express.static(__dirname + '/'));
app.use(jsonParser)

// sendFile will go here
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// return the list of todos
app.get('/todos', function(req, res) {
    let todos_file = __dirname + '/data/todos.json'
    let data = fs.readFileSync(todos_file, 'utf8');

    res.send(data)
});

app.get('/unallocated_items', function(req, res) {
    let todos_file = __dirname + '/data/unallocated_items.json'
    let data = fs.readFileSync(todos_file, 'utf8');

    res.send(data)
});

app.get('/grid', function(req, res) {
    let todos_file = __dirname + '/data/grid.json'
    let data = fs.readFileSync(todos_file, 'utf8');

    res.send(data)
});

app.post('/save_todos', function(req, res) {
    // save the todos list in a file
    let todos_file = __dirname + '/data/todos.json'
    let data = JSON.stringify(req.body)
    fs.writeFileSync(todos_file, data)

    res.send('ok')
    console.log("todos saved");
});

app.post('/unallocated_items', function(req, res) {
    // save the todos list in a file
    let emojis_file = __dirname + '/data/unallocated_items.json'
    let data = JSON.stringify(req.body)
    fs.writeFileSync(emojis_file, data)

    res.send('ok')
    console.log("unallocated items saved");
});

app.post('/grid', function(req, res) {
    // save the grid in the grids file

    // read the existing grids
    let gridsFileName = __dirname + '/data/grid.json'
    let gridsData = fs.readFileSync(gridsFileName, 'utf8');
    let grids = JSON.parse(gridsData);

    // modify the grids file only at grid id position
    let gridToSave = req.body
    grids[gridToSave.grid_id] = gridToSave;
    gridsData = JSON.stringify(grids);

    fs.writeFileSync(gridsFileName, gridsData)

    res.send('ok')
    console.log("grid saved");
});

app.delete('/grid', function(req, res) {
    // delete the grid from the grids file
    
    // read the existing grids
    let gridsFileName = __dirname + '/data/grid.json'
    let gridsData = fs.readFileSync(gridsFileName, 'utf8');
    let grids = JSON.parse(gridsData);

    // remove pointers to the grid
    let gridToDelete = req.body
    if (gridToDelete.gridLeftId) {
        grids[gridToDelete.gridLeftId].gridRightId = null;
    }
    if (gridToDelete.gridRightId) {
        grids[gridToDelete.gridRightId].gridLeftId = null;
    }
    if (gridToDelete.gridUpId) {
        grids[gridToDelete.gridUpId].gridDownId = null;
    }
    if (gridToDelete.gridDownId) {
        grids[gridToDelete.gridDownId].gridUpId = null;
    }


    // modify the grids file at grid id position
    delete grids[gridToDelete.grid_id];
    console.log(grids);
    gridsData = JSON.stringify(grids);

    fs.writeFileSync(gridsFileName, gridsData)

    res.send('ok')
    console.log("grid deleted");
});

// returns the list of emojis and only text in the request string
app.post("/emojis", function(req, res) {
    let data = req.body.text

    let response = {
        emojis: onlyEmoji(data),
        text: withoutEmoji(data).join("")
    }

    console.log(response);
    res.send(JSON.stringify(response))
});

app.listen(port);
console.log('Server started at http://localhost:' + port);