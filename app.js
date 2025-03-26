const path = require('path');
const http = require('http');
const express = require('express');
const routers =  require("./routes/config_routes")
const resultsRouter = require('./routes/results');
require('dotenv').config()
require("./db/mongoConnect")

const app = express();

// midelllwer
// במידה ואתה יכול תפרסר לגייסון
app.use(express.json())

app.use(express.static(path.join(__dirname, "public")));

app.use('/api', routers)
app.use('/api/results', resultsRouter)

const server = http.createServer(app);

const PORT = 3003;
console.log("PSY app is up");

server.listen(PORT);