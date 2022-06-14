const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("#roomname");
const nickForm = welcome.querySelector('#nickname');
const room = document.getElementById("room");

room.hidden = true;

let roomName;
let nickName = "";

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText =message;
    ul.appendChild(li);
}

function handleMessageSubmit (event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit (event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    nickName = input.value;
    socket.emit("nickname", nickName);
}

function showUserCount(userCount) {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${userCount})`;
}

function showRoom(userCount) {
    welcome.hidden = true;
    room.hidden = false;
    showUserCount(userCount);
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit)
}

function handleRoomSubmit(event) {
    event.preventDefault();
    if (nickName === "") {
        alert("You Should Enter Nickname!!");
        return;
    }
    const input = roomForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

roomForm.addEventListener("submit", handleRoomSubmit);
nickForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user, userCount) => {
    showUserCount(userCount);
    addMessage(`${user} joined`);
});

socket.on("bye", (user, userCount) => {
    showUserCount(userCount);
    addMessage(`${user} left`);
});

socket.on("new_message", addMessage);

socket.on("room_change", rooms => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});