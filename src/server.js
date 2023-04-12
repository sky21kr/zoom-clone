import http from "http";
import SocketIO from "socket.io";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening")

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    sockets.push(socket);

    
    socket.on("message", (message) => {
        const { type, payload } = JSON.parse(message.toString());

        switch (type) {
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${payload}`));
                break
            case "nickname":
                socket["nickname"] = payload;
        }
    });

    socket.on("close", () => {
        console.log("Disconnect");
    });
});


server.listen(3000, handleListen);