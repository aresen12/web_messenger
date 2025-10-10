            // Connect to SocketIO server
const socket = io.connect();


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
//                    socket.emit('message', message);
                    socket.emit('room_message', {room: chat_id, message: message, html: html_m });
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
            console.log("вроде тут")
                gener_html(data["id_m"], data["message"], data["time"], data["html"], data["file2"], other, data["read"], data["name"], data["pinned"])
});

socket.on('create_chat', (data) => {
    alert('refresh page');
    gener_chat("email", data["chat_id"], data["name"], 1, data["is_primary"]);
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