const chatForm = document.getElementById('chat-form');
const chatList = document.getElementById('chat-list');
const categoryName = document.getElementById('category-name');
const usersList = document.getElementById('users-list');
const clock = document.getElementById('clock');
const currentDate = document.getElementById('current-date');
const btnAside = document.getElementById('btn-aside');
const aside = document.getElementById('aside');
const socket = io();

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    outputMessage(message);
    chatList.scrollTop = chatList.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

btnAside.addEventListener('click', (e) => {
    e.preventDefault();
    aside.classList.toggle('isVisible');
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <span class="time">${message.time}</span>
        <span class="username">${message.username}</span>
        <p class="text">${message.text}</p>
    `;
    chatList.appendChild(div);
};

function outputRoomName(room) {
    categoryName.innerText = room;
};

function outputUsers(users) {
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};

function setTime() {
    const time = new Date();
    const min = time.getMinutes();
    const h = time.getHours();
    clock.innerText = `${h}:${min}`;
};

function setCurrentDate() {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    currentDate.innerText = `${day} ${month}`;
};

setInterval(setTime, 1000);
setTime();
setCurrentDate();