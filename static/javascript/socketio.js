            // Connect to SocketIO server
const socket = io.connect();


function set_emoji(id_mess, id_emoji){
    var div = document.getElementById(id_mess + "emoji_btn_id" + id_emoji);
    if (div) {
        if (div.style.background != "#6699cc")
        {
        document.getElementById(menu_id).style.display = "none";
    globalThis.menu_id = '';
        return 500;
        }
    }
//    if (!div || div.style.background != "#6699cc"){
        var chat_id =  document.getElementById("chat_id").value;
        socket.emit('emoji', {chat_id: chat_id, id_mess: id_mess, value: id_emoji});
//    } else {
//        alert("Вы уже поставили эмоцию!");
//    }
    document.getElementById(menu_id).style.display = "none";
    globalThis.menu_id = '';
}

            // Handle form submission
function send_io_mess() {
                const input = document.getElementById('about');
                const chat_id = document.getElementById('chat_id').value;
                const message = input.value;
                const html2 = document.getElementById('html_m');
                const html_m = html2.value;
                if (message) {
                    console.log("test");
                    // Send message to server
                if (Number(chat_id)){
                    socket.emit('room_message', {room: chat_id, message: message, html: html_m });
                } else {
                    socket.emit('my_message', {room: chat_id.slice(2), message: message, html: html_m });
                }
                    input.value = '';
                    html2.value = '';
                }

}

            // Listen for messages from server
socket.on('message', (data) => {
                const messagesDiv = document.getElementById('content');
                var other = 1;
                if (id_user == data["id_sender"]){
                var other = 0;
            }
                gener_html(data["id_m"], data["message"], data["time"], data["html"], data["file2"], other, data["read"], data["name"], data["pinned"])
});

socket.on('create_chat', (data) => {
    alert('refresh page');
    gener_chat("email", data["chat_id"], data["name"], 1, data["is_primary"]);
});

//, html_m, other, text
socket.on('emoji_client', (data) => {
//    пока id не работает
    gener_emoji(data["id_emoji"], data["id_mess"], 0, data['value'])
});



socket.on('join_event', (data) => {
    if (id_user != data["id_user"]){
        const div_ = document.getElementById("ident");
        div_.textContent = "(в сети)";
    }


});

socket.on('leave_event', (data) => {
    if (id_user != data["id_user"]){
        const div_ = document.getElementById("ident");
        div_.textContent = "";
    }
});


socket.on('edit_mess', (data) => {
   document.getElementById("text" + data["id_mess"]).textContent = data["new_text"];
   console.log("edit soc")
});

socket.on('connect', () => {
    chat_id = document.getElementById("chat_id");
    if (chat_id.value != ""){
        socket.emit('join', {room: chat_id.value});
        get_new_message_id();
    }
});


socket.on('disconnect', () => {
//    alert("disconnect");
});


socket.on('message_other', (data) => {
    var rn = document.getElementById("rn" + data["chat_id"]);
    rn.innerText =  Number(rn.innerText) + 1;
    if (document.getElementById("chat_id").value != data["chat_id"]){
        notification(data["text"], "");
}
});


async function get_cand(num){
    console.log(num, globalThis.my_peer);
    globalThis.my_peer.onicecandidate = evt => {
        send_candidate(evt.candidate?.candidate, num);
        console.log(evt.candidate?.candidate);
//    return 0;
  }
}


socket.on('send_offer', (data) => {
    if (data["current_user"] != id_user){
        globalThis.my_peer.setLocalDescription(data["data"]["offer"]);
//        candidate = get_cand(1);
//        console.log(candidate, 1);

    }
});

async function add_cand(candidate_data){
//.iceCandidate
    const iceCandidate = new RTCIceCandidate({
  candidate: candidate_data["candidate"],
  sdpMLineIndex: 12345, // don't make it up, you get this in onicecandidate
});
            await globalThis.my_peer.addIceCandidate(iceCandidate);
}


socket.on('send_cand_to_user1', (data) => {

    console.log(data["current_user"] , id_user, "send_cand_to_user1", data["current_user"] != id_user);
    if (data["current_user"] != id_user){
//    socket.emit("send_candidate2", {'chat_id':"s"});
//        candidate = get_cand(2);
//        console.log(data["data"])
        add_cand(data["data"]);
//        try{
//            console.log(globalThis.my_peer, data["data"], new RTCIceCandidateInit(data["data"]));
//
//            globalThis.my_peer.addIceCandidate(new RTCIceCandidateInit(data["data"]));
//            console.log("sucsesful");
//        }catch (e){
//            console.log("bad_cand")
//
//        }
    } else {
        console.log("повтор")
    }
});


socket.on('send_cand_to_user2', (data) => {
    console.log(data["current_user"] , id_user, "send_cand_to_user2");
    if (data["current_user"] != id_user){
            add_cand(data["data"])
//        try{
//        globalThis.my_peer.addIceCandidate(data["data"]);
//        console.log("sucsesful");
//        }catch (e){
//            console.log("bad_cand");
//        }
        my_peer.onaddstream = function(event) {
    videoElement.srcObject = event.stream;
};
// вроде теперь подключилось
    }
});


socket.on('send_call', (data) => {
//    убирает повторный вызов для инициатора звонка
    console.log(data);
    if (data["user_id"] != id_user){
        gener_UI_call(2, data["name_call"], data["chat_id"]);
        playAudio();
    }
});


socket.on("send_call_by_number", data => {
//    if (data["current_user"] != id_user){
    callToNode(data["data"]["number"]);
//    }
})