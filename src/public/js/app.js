const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
    console.log("Connected to Server")
})

socket.addEventListener('message', (message) => {
    const li = document.createElement("li");
    li.innerHTML = message.data;

    messageList.append(li);
})

socket.addEventListener('close', (message) => {
    console.log("Disconnected from Server", message)
})

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(JSON.stringify({ type: "new_message", payload: input.value}));
    input.value = "";
})

nickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(JSON.stringify({ type: "nickname", payload: input.value}));
})