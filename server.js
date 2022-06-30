const express = require('express');
const app = express();
const http = require('https');
const fs = require('fs');
const path = require('path')
const options = {
    key: fs.readFileSync(path.join(__dirname,'certificates', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname,'certificates','cert.pem'))
}
const server = http.Server(options,app);
const io = require('socket.io')(server);
const {v4: uuidV4} = require('uuid')
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
    //res.redirect(`/${uuidV4()}`);
    res.render('home', {roomId: uuidV4()})
});

app.get('/room/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})


io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
});

// server.listen(3000,  () => {
server.listen(3000, '192.168.1.38', () => {
    console.log('listening on *:3000');
});
app.locals.baseURL = "https://192.168.1.38:3000"