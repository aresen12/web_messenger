var f = document.getElementById("form").offsetHeight;
var nav = document.getElementById("chat_header").offsetHeight;
var m_c =   document.getElementById("container-mess");
var email_cont = document.getElementById("email");
//m_c.style.height =  window.innerHeight - f - nav + "px";
m_c.style.top = nav;
//email_cont.style.top = nav;
//email_cont.style.height = window.innerHeight - f - nav + "px";
if (nav == 0){
    nav = 90;
    m_c.style.top = nav;
}
document.getElementById("background-img").style.height =  window.innerHeight - nav + "px";
document.getElementById("background-img").style.top = nav + "px";
document.getElementById("form").style.display = "none";

// вот это оставить
function gener_chat(id_div, chat_id, name_chat, status, primary){
    const cont = document.getElementById(id_div);
    get_read(chat_id);
    const btn = document.createElement('button');
    btn.id = 'chat'+ chat_id;
    btn.classList = "a-email";
    btn.setAttribute("onclick",`set_recipient('${chat_id}', ${primary}, '${name_chat}', ${status})`);
    const rn = document.createElement('div');
    rn.classList = "r-n";
    rn.id = 'rn' + chat_id;
    const icon_chat = document.createElement('div');
    icon_chat.id = "icon_chat" + chat_id;
    const name_chat_div = document.createElement('div');
    name_chat_div.id = "n_c" + chat_id;
    name_chat_div.textContent = name_chat;
    name_chat_div.classList = "n-c";
    btn.appendChild(icon_chat);
    btn.appendChild(name_chat_div);
    btn.appendChild(rn);
    cont.appendChild(btn);
    var icon_size = 40;
    icon_chat.style.width = icon_size + "px";
    const svg =
            d3.select("#icon_chat" + chat_id).
            append('svg').
            attr('height', `${icon_size}`).
            attr('width', `${icon_size}`)
            var circle = svg.append("circle") .attr("cx", icon_size / 2) .attr("cy", icon_size / 2) .attr("r", icon_size / 2) .attr("fill", random_colors[Math.floor(Math.random() * random_colors.length)]);
var text = svg.append("text") .attr("x", circle.attr("cx") - 3) .attr("y", circle.attr("cy") - 3) .attr("dy", "0.35em") .text(name_chat[0]);

}


// это тоже своё
function gener_html(id_m, text, time, html_m, file_, other, read, name_sender, pinned) {
     if (other && !read && !vis){
                notification(text, document.getElementById('name_chat').innerText);
            }

     const messagesDiv = document.getElementById('content');
     const messageItem = document.createElement('div');
    imges = ["bmp", "jpg", "png", "svg"]
    audio = ["mp3", "flac", "m4a"]
    video = ["mp4", "mov"]
    if (other) {
        messageItem.classList = 'message-other';
    } else{
        messageItem.classList = 'my-message';
    };
    var em_div = document.createElement("div");
    em_div.id = "em" + id_m;
    const message_text = document.createElement('p');
    message_text.textContent = text;
    message_text.classList = "text-in-mess";
    message_text.id = 'text' + id_m;
    const html_text = document.createElement('p');
    html_text.innerHTML = html_m;
    messageItem.appendChild(html_text);
    messageItem.appendChild(message_text);
    messageItem.appendChild(em_div);
    messageItem.role = "alert";
    var onclick = "";
    messageItem.setAttribute("onclick", `open_menu_mess('m${id_m}')`);
    if (file_){
        var ras = file_[1].split(".");
        ras = ras[ras.length - 1];
        if (imges.includes(ras)){
            const button = document.createElement('button');
            button.classList = "info-btn";
            button.setAttribute("onclick", `showImg('m${id_m}', '${file_[1]}')`);
            const img_elem = document.createElement('img');
            img_elem.classList = "mess-img";
            img_elem.src = "/static/img/" + file_[1];
            button.appendChild(img_elem);
            messageItem.appendChild(button);
        } else {
             if (audio.includes(ras)){
                 var w = window.innerWidth * 0.187;
                 if (mobile){
                        w = window.innerWidth * 0.57;
                 };
                 const audio2 = document.createElement("audio");
                 audio2.classList = "audio";
                 audio2.src = '/static/img/' + file_[1];
                 audio2.textContent = file_[0];
                 audio2.style.width = w + 'px';
                 audio2.controls = 'controls';
                 messageItem.appendChild(audio2);
            }else {
                if (video.includes(ras)){
                    var w = window.innerWidth * 0.18;
                    if (mobile){
                        w = window.innerWidth * 0.57;
                    };
                    const video = document.createElement("video");
                    video.classList = "audio";
                    video.controls = 'controls';
                     video.src = '/static/img/' + file_[1];
                  video.textContent = file_[0];
                     video.style.width = w + 'px';
                 messageItem.appendChild(video);
                } else{
                    const a_ = document.createElement('a');
                    a_.classList = "my-a";
                    a_.href = '/static/img/' + file_[1];
                    a_.textContent = file_[0];
                    a_.setAttribute('download', file_[0]);
                    messageItem.appendChild(a_);
                }
        }
    }
    };
     const time_div = document.createElement('p');
     time_div.classList = "time-mess";
     if (other){
        time_div.textContent = time + " " + name_sender;
     }else{
        time_div.textContent = time;
     }
     messageItem.appendChild(time_div);
    if (read){
        time_div.innerHTML += '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">ᨒ</button>';
    } else{
        time_div.innerHTML += '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="доставлено">ᨈ</button>';
    }
    const menu_con = document.createElement("div");
    menu_con.style.display = "none";
    menu_con.classList.add("context-menu-open");
    menu_con.id = "mm" + id_m;
    messageItem.appendChild(menu_con);
    messageItem.id = 'm' + id_m;
    messagesDiv.appendChild(messageItem);
     scrollToBottom("content");
     if(pinned){
        add_pinned(id_m);
        messagesDiv.style.height = "100%";
     }
}


// отрисовка под мобильный интерфейс
document.getElementById("btn_down").style.visibility = 'hidden';
document.getElementById("chat_header").style.display = "none";

// своё
function set_bg(num) {
    document.getElementById("background-img").src = "/static/img/bg/mob_bg" + num + ".jpg";
    document.cookie = "bg="+ num;
}
1
// не уверен
document.addEventListener('click', (e) => {
    if (menu_id != ""){
        var div = document.querySelector('#' + menu_id.slice(1));
        var t = e.composedPath().includes(div);
        if (!t){
            document.getElementById(menu_id).style.display = "none";
            globalThis.menu_id = "";
        }
    }
    var div = document.querySelector('#menu_create_div');
    var withinBoundaries = e.composedPath().includes(div);
    var div2 = document.querySelector('#menu_chat_div_all');
    var flag = e.composedPath().includes(div2);
    if (!withinBoundaries) {
        document.getElementById("how_create").style.display = 'none'; // скрываем элемент, так как клик был за его пределами
    };
    if (!flag) {
        document.getElementById("menu-chat").style.display = 'none'; // скрываем элемент, так как клик был за его пределами
    };
    if (menu_id != "" && mobile != true){
        document.getElementById(menu_id).style.display = "none";
        globalThis.menu_id = "";
      };
});
