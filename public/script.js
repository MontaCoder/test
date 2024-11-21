let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let localStream;
let username;
let socket;

// Get username and join chat
document.getElementById('join-btn').addEventListener('click', () => {
  username = document.getElementById('username').value;
  if (username) {
    document.getElementById('username').style.display = 'none';
    document.getElementById('join-btn').style.display = 'none';
    establishConnection();
  }
});

// Establish WebRTC connection and signaling
function establishConnection() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;
      // Initialize signaling socket
      socket = new WebSocket('ws://localhost:8080');
      socket.onmessage = handleSignalingMessage;
      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'join', username }));
      };
    })
    .catch(err => {
      console.error('Error accessing media devices', err);
    });
}

// Handle signaling messages
function handleSignalingMessage(event) {
  let message = JSON.parse(event.data);
  switch (message.type) {
    case 'offer':
      handleOffer(message.offer);
      break;
    case 'answer':
      handleAnswer(message.answer);
      break;
    case 'chat-message':
      handleChatMessage(message);
      break;
    default:
      console.log('Unknown message type');
  }
}

// Chat functionality
document.getElementById('send-msg-btn').addEventListener('click', () => {
  let chatInput = document.getElementById('chat-input');
  let message = chatInput.value;
  if (message) {
    socket.send(JSON.stringify({ type: 'chat-message', message, username }));
    chatInput.value = '';
  }
});

// Display chat messages
function handleChatMessage(message) {
  let chatLog = document.getElementById('chat-log');
  let messageElement = document.createElement('li');
  messageElement.textContent = `${message.username}: ${message.message}`;
  chatLog.appendChild(messageElement);
}

// WebRTC peer connection setup (incomplete, to be enhanced)
let peerConnection;
function handleOffer(offer) {
  peerConnection = new RTCPeerConnection();
  // ...
}

function handleAnswer(answer) {
  // ...
}
