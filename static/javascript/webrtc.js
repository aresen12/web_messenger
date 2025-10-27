//var offer = null;
//let my_peer = null;
//var mediaConstraints = {
//  audio: true, // We want an audio track
//  video: true, // ...and we want a video track
//};



async function invite() {
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(function (localStream) {
        document.getElementById("local_video").srcObject = localStream;
        localStream
          .getTracks()
          .forEach((track) => globalThis.my_peer.addTrack(track, localStream));
      })
      .catch(handleGetUserMediaError);
    const chat_id = document.getElementById("chat_id").value;
    const offer = await globalThis.my_peer.createOffer();
 await globalThis.my_peer.setLocalDescription(offer);
    socket.emit('send_call_to_user', {chat_id: chat_id, data: {"offer": globalThis.my_peer.localDescription}});
    globalThis.my_peer.addEventListener('icecandidate', (event) => {
	if (event.candidate) {
	    var chat_id = document.getElementById("chat_id").value;
    socket.emit("send_candidate1", {chat_id: chat_id, data: event.candidate, current_user: id_user});
		// Отправляем ICE-кандидата другому клиенту через сигналинг
//		ws.send(clientId, 'new-ice-candidate', );
	}
});
}


function send_call(){
//    alert("В разработке! только для разработчиков");
    var chat_id = document.getElementById("chat_id").value;
    gener_UI_call(1);
    socket.emit('send_call_to_user', {chat_id: chat_id, user_id: id_user});
//    globalThis.my_peer = new RTCPeerConnection();
//    // Listen for connectionstatechange on the local RTCPeerConnection
//    globalThis.my_peer.addEventListener('connectionstatechange', event => {
//            if (globalThis.my_peer.connectionState === 'connected') {
//            // Peers connected!
//            console.log("connected!")
//
//        }
//    });
//    offer = invite();
}


function handleGetUserMediaError(e) {
  switch (e.name) {
    case "NotFoundError":
      alert(
        "Unable to open your call because no camera and/or microphone" +
          "were found.",
      );
      break;
    case "SecurityError":
    case "PermissionDeniedError":
      // Do nothing; this is the same as the user canceling the call.
      break;
    default:
      alert("Error opening your camera and/or microphone: " + e.message);
      break;
  }
}

// type 1 исходящий
//type 2 входящий
function gener_UI_call(type){
    document.getElementById("global_menu_d").style.display = "block";
    var global_menu = document.getElementById("global_menu");
    global_menu.innerHTML = "";
    status_div = document.createElement("div");
    global_menu.appendChild(status_div);
    global_menu.innerHTML += `<video id=myVideo muted="muted" width="400px" height="auto" ></video>
	<div id=callinfo ></div>
	<video id=remVideo width="400px" height="auto" ></video>`;
    var button_kill = document.createElement("button");
    button_kill.classList = "info-btn call-kill";
    button_kill.innerHTML += `<svg width="40px" height="40px" viewBox="0 0 24 24" id="end_call" data-name="end call" xmlns="http://www.w3.org/2000/svg">
  <rect id="placer" width="24" height="24" fill="none"/>
  <g id="Group" transform="translate(2 8)">
    <path id="Shape" d="M7.02,15.976,5.746,13.381a.7.7,0,0,0-.579-.407l-1.032-.056a.662.662,0,0,1-.579-.437,9.327,9.327,0,0,1,0-6.5.662.662,0,0,1,.579-.437l1.032-.109a.7.7,0,0,0,.589-.394L7.03,2.446l.331-.662a.708.708,0,0,0,.07-.308.692.692,0,0,0-.179-.467A3,3,0,0,0,4.693.017l-.235.03L4.336.063A1.556,1.556,0,0,0,4.17.089l-.162.04C1.857.679.165,4.207,0,8.585V9.83c.165,4.372,1.857,7.9,4,8.483l.162.04a1.556,1.556,0,0,0,.165.026l.122.017.235.03a3,3,0,0,0,2.558-.993.692.692,0,0,0,.179-.467.708.708,0,0,0-.07-.308Z" transform="translate(18.936 0.506) rotate(90)" fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="1.5"/>
  </g>
</svg>`;
    if (type == 2){
        var btn_accept = document.createElement("button");
        btn_accept.setAttribute("onclick", `accept_call()`);
        btn_accept.classList = 'info-btn';
        btn_accept.id = "accept_call_btn";
        btn_accept.innerHTML  = `<svg width="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> <path d="M5.13641 12.764L8.15456 9.08664C8.46255 8.69065 8.61655 8.49264
                8.69726 8.27058C8.76867 8.07409 8.79821 7.86484 8.784 7.65625C8.76793 7.42053 8.67477 7.18763 8.48846
                6.72184L7.77776 4.9451C7.50204 4.25579
                7.36417 3.91113 7.12635 3.68522C6.91678 3.48615 6.65417 3.35188 6.37009 3.29854C6.0477 3.238 5.68758
                3.32804 4.96733 3.5081L3 4C3 14 9.99969 21 20 21L20.4916 19.0324C20.6717 18.3121 20.7617 17.952 20.7012
                17.6296C20.6478 17.3456 20.5136 17.0829 20.3145 16.8734C20.0886 16.6355 19.7439 16.4977
                 19.0546 16.222L17.4691 15.5877C16.9377 15.3752 16.672 15.2689 16.4071 15.2608C16.1729 15.2536 15.9404
                15.3013 15.728 15.4001C15.4877 15.512 15.2854 15.7143 14.8807 16.119L11.8274 19.1733M12.9997 7C13.9765
                7.19057 14.8741 7.66826 15.5778 8.37194C16.2815 9.07561 16.7592 9.97326 16.9497 10.95M12.9997 3C15.029
                 3.22544 16.9213 4.13417 18.366 5.57701C19.8106 7.01984 20.7217 8.91101 20.9497 10.94" stroke="#52c7bf"
                                                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                </path> </g></svg>`
        global_menu.appendChild(btn_accept);
        button_kill.setAttribute("onclick", "nAccepted()");
        button_kill.id = "kill_call_btn";
    } else{
        button_kill.setAttribute("onclick", "kill_call()");
    }
    global_menu.appendChild(button_kill)
}


function gener_jitsi(){
    document.getElementById("global_menu_d").style.display = "flex";
    global_menu = document.getElementById("global_menu");
    global_menu.innerHTML = '<div id="meet"></div>';
    const domain = 'meet.confmeet.net';
const options = {
    roomName: 'kjkfghjkl;;loiuytghbnm7654567899xsdl,scn,mxx.',
    width: '100%',
    height: 500,
    parentNode: document.querySelector('#meet'),
     userInfo: {
        email: document.getElementById("username").textContent,
        displayName: document.getElementById("name_user").textContent,
    }
};
const api = new JitsiMeetExternalAPI(domain, options);
}

function leave_call_UI(){
    document.getElementById("global_menu").innerHTML = "";
    document.getElementById("global_menu_d").style.display = "none";
}


function kill_call(){
    leave_call_UI();
    var chat_id = document.getElementById("chat_id").value;
    var data = {};
    socket.emit('kill_call', {chat_id: chat_id, data:data });
}


function nAccepted(){
    document.getElementById("global_menu_d").style.display = "none";
    global_menu = document.getElementById("global_menu");
}


async function accept_call(){
    var chat_id = document.getElementById("chat_id").value;
    console.log(document.getElementById("myid").value);
    socket.emit("send_number", {chat_id: chat_id, number: document.getElementById("myid").value});
}


async function playAudio() {
  var audio = new Audio('/static/ringtons/diazinon.mp3');
  audio.type = 'audio/wav';
  try {
    await audio.play();
    document.querySelector('#kill_call_btn').addEventListener('click', function(){
        audio.pause();
    });
    document.querySelector('#accept_call_btn').addEventListener('click', function(){
        audio.pause();
    });

    console.log('Playing...');
  } catch (err) {
    console.log('Failed to play...' + err);
  }

}
