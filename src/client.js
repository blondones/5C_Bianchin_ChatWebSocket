const nameModal = document.getElementById('name-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const nameInput = document.getElementById('name-input');
const joinButton = document.getElementById('join-button');

const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById("input");
const sendButton = document.getElementById("sendButton");
const chatList = document.getElementById("chat");
const userListElement = document.getElementById("user-list");

let myUsername = "";

const socket = io();

joinButton.onclick = () => {
    const name = nameInput.value.trim();
    if (name) {
        myUsername = name;
        socket.emit("join", myUsername);
        nameModal.classList.add('hidden-modal');
        modalBackdrop.classList.add('hidden-modal');
        chatContainer.style.display = 'block';
        messageInput.focus();
    } else {
        alert("Per favore, scrivi il tuo nome!");
    }
};

nameInput.onkeydown = (event) => {
    if (event.key === 'Enter') joinButton.onclick();
};

sendButton.onclick = () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        socket.emit("message", messageText);
        messageInput.value = "";
    }
};

messageInput.onkeydown = (event) => {
    if (event.key === 'Enter') sendButton.onclick();
};

socket.on("chat", (messageToShow) => {
    const listItem = document.createElement('li');
    listItem.textContent = messageToShow;
    chatList.appendChild(listItem);
    const chatBox = chatList.closest('.chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("list", (userArray) => {
    userListElement.innerHTML = "";
    userArray.forEach((user) => {
        const userItem = document.createElement('li');
        userItem.textContent = user.name;
        userListElement.appendChild(userItem);
    });
});

socket.on("join_error", (errorMessage) => {
    alert(errorMessage);
    myUsername = "";
    nameModal.classList.remove('hidden-modal');
    modalBackdrop.classList.remove('hidden-modal');
    chatContainer.style.display = 'none';
    nameInput.focus();
    nameInput.value = '';
});

socket.on("disconnect", (reason) => {
    const listItem = document.createElement('li');
    listItem.textContent = "--- Connessione persa ---";
    listItem.style.fontStyle = 'italic';
    listItem.style.color = 'gray';
    chatList.appendChild(listItem);
    userListElement.innerHTML = "";
});
