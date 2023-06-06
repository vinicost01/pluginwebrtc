const localVideo = document.getElementById('localVideo');
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');

startButton.onclick = start;
callButton.onclick = call;

const ws = new WebSocket('wss://3.82.220.57:8080');

let localStream;
let pc;

ws.onmessage = message => {
  const signal = JSON.parse(message.data);
  if (signal.type === 'answer') {
    pc.setRemoteDescription(new RTCSessionDescription(signal));
  } else if (signal.type === 'candidate') {
    const candidate = new RTCIceCandidate(signal);
    pc.addIceCandidate(candidate);
  }
};

function start() {
  navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
    localVideo.srcObject = stream;
    localStream = stream;
  });
}

function call() {
  const configuration = {
    iceServers: [
      {
        urls: ['turn:3.82.220.57:3478'],
        username: 'vinicost',
        credential: 'vinicost'
      }
    ]
  };
  pc = new RTCPeerConnection(configuration);

  pc.onicecandidate = e => {
    if (e.candidate) {
      ws.send(JSON.stringify(e.candidate));
    }
  };

  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
  });

  pc.createOffer().then(offer => {
    return pc.setLocalDescription(offer);
  }).then(() => {
    ws.send(JSON.stringify(pc.localDescription));
  });
}
