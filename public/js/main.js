const socket = io();

const chatForm = document.querySelector("#chat-form");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("msg", (msg) => {
  outputMessage(msg);
});

socket.on("new connection", (msg) => {
  outputMessage(msg);
});

socket.emit("username and room", { username, room });

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.querySelector("#msg").value;

  socket.emit("new message", input);
  document.querySelector("#msg").value = "";
});

function outputMessage(message) {
  const div = document.createElement("div");

  div.classList.add("message");

  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}
