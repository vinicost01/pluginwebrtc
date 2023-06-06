const remoteVideo = document.getElementById('remoteVideo');
const answerButton = document.getElementById('answerButton');

answerButton.onclick = answer;

const ws = new WebSocket('wss://3.82.220.57:8080');

let pc;

ws.onmessage = message => {
  const signal = JSON.parse(message.data);
  if (signal.type === 'offer') {
    answer(signal);
  } else if (signal.type === 'candidate') {
    const candidate = new RTCIceCandidate(signal);
    pc.addIceCandidate(candidate);
  }
};

function answer(offer) {
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

  pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
  };

  pc.setRemoteDescription(new RTCSessionDescription(offer));
  pc.createAnswer().then(answer => {
    return pc.setLocalDescription(answer);
  }).then(() => {
    ws.send(JSON.stringify(pc.localDescription));
  });
}
