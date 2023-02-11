const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socket = require('socket.io');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connection Successful')
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is Running on Port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    }
})

global.onlineUsers = new Map();

io.on('connection', (socket)=> {
    global.chatSoket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.io);
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data.msg);
        }
    })
})