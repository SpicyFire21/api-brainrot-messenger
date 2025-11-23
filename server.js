import express from 'express'
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import bodyParser from "body-parser";
import pool from './database/db.js';

const app = express();
const PORT = 3000;
const apiURL = `http://localhost:${PORT}`;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:5173", "capacitor://localhost"],
    methods: ["GET", "POST"]
}));

import messageRoute from './routes/message.router.js';
import userRoute from './routes/user.router.js';
import axios from "axios";

app.use('/messages', messageRoute);
app.use('/users', userRoute);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

io.on("connection", (socket) => {

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });

    socket.on("chat-message", async (data) => {
        try {
            await axios.post(`${apiURL}/messages/send`, data)

            io.emit("chat-message", data);
        } catch (e) {
            console.error(e);
        }
    });
});

server.listen(PORT,"0.0.0.0", () => {
    console.log(`API on port ${apiURL}`);
    pool.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à la base de données :', err);
        } else {
            console.log('Connexion à la base de données réussie 😏😏 ');
        }
    });
});

