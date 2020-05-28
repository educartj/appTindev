const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connecteUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connecteUsers[user] = socket.id;
    // teste de conexão entre backend e frontend
    // console.log('Nova conexão', socket.id)

    // socket.on('hello', message => {
    //     console.log(message)
    // })
    // setTimeout(() =>{
    //     socket.emit('world', {
    //       message: 'tindev'
    //     });
    //   }, 5000)
})

mongoose.connect('mongodb+srv://edu:edu@cluster0-hr5nd.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true

});

app.use((req, res, next) =>{
    req.io = io;
    req.connecteUsers = connecteUsers;

    return next();

})

app.use(cors()); //permitir que aplicação seja acessado por qualquer endereço
app.use(express.json());

app.use(routes); // add modulo, precisa ficar depois do cors

server.listen(3333);

// M-Model, V-View, C-Controller