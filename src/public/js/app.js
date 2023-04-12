const socket = io();

const welcome = document.querySelector("#welcome");
const form = document.querySelector("form");
const room = document.querySelector("#room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

const handleMessageSubmit = (event) => {
    event.preventDefault();

    const input = room.querySelector("#msg input");
    const { value } = input;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

const handleNicknameSubmit = (event) => {
    event.preventDefault();

    const input = room.querySelector("#name input");
    const { value } = input;
    socket.emit("nickname", value);
}

const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

const handleSubmit = (event) => {
    event.preventDefault();

    const input = form.querySelector("input");

    roomName = input.value;
    socket.emit("enter_room", roomName, showRoom);
    input.value = ""
}

form.addEventListener("submit", handleSubmit)

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    console.log("welcome");
    addMessage(`${user} arrived!`);
})

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left!`)
})

socket.on("new_message", addMessage)

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";

    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerHTML = room;
        roomList.appendChild(li);
    })
});