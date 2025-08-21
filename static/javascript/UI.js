function showDiv(Div, div2) {
    var x = document.getElementById(Div);
    var y = document.getElementById(div2)
    if(x.style.display=="none") {
        x.style.display = "block";
        y.style.display = "none";
    } else {
        x.style.display = "none";
        y.style.display = "block";
    }
}


if (document.cookie){
    var button = document.getElementById("bg"+  getCookie("bg"));
    button.click();
    var e = getCookie("enter");
    if (e){
        document.getElementById("E" + e).click();
    } else {
        document.cookie = "enter=1";
    }

} else {
    document.cookie = "bg=2";
    document.cookie = "enter=1";
    document.getElementById("bg2").click();
}


function showdiv1(Div){
    var x = document.getElementById(Div);
    if(x.style.display=="none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}


function showImg(Div, name_img){
    var x = document.getElementById("watch");
    var w_img = document.getElementById("watch_img");
    w_img.src = "/static/img/" + name_img;
    if(x.style.display=="none") {
        x.style.display = "block";
        document.getElementById(Div).click();
    } else {
        x.style.display = "none";
    }
}


get_chats('email');
var f = document.getElementById("form").offsetHeight;
var nav = document.getElementById("chat_header").offsetHeight;
console.log(nav);
var m_c =   document.getElementById("container-mess");
var email_cont = document.getElementById("email");
m_c.style.height =  window.innerHeight - f - nav + "px";
m_c.style.top = nav;
email_cont.style.top = nav;
email_cont.style.height = window.innerHeight - f - nav + "px";
document.getElementById("background-img").style.height =  window.innerHeight - nav + "px";
document.getElementById("background-img").style.top = nav + "px";
document.getElementById("form").style.display = "none";


function add_pinned(id_mess){
    const pin_div = document.getElementById("pinned");
                if (pin_div.innerHTML == ""){
                    btn = document.createElement("button");
                    btn.textContent += document.getElementById("text" + id_mess).textContent.trim()
                    btn.id = "pin_btn";
                    btn.classList = "info-btn pinned-btn";
                    btn.setAttribute("onclick", `go_pin('${id_mess}')`);
                    pin_div.appendChild(btn);
                    document.getElementById("list_pin").value += " " + id_mess;
                } else {
                    document.getElementById("list_pin").value += " " + id_mess;
                }
}
//<button type="button" class="btn-close" aria-label="Close"></button>

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
    const message_text = document.createElement('p');
    message_text.textContent = text;
    message_text.classList = "text-in-mess";
    message_text.id = 'text' + id_m;
    const html_text = document.createElement('p');
    html_text.innerHTML = html_m;
    messageItem.appendChild(html_text);
    messageItem.appendChild(message_text);
    messageItem.role = "alert";
    var onclick = "";
    if (mobile){
        messageItem.setAttribute("onclick", `open_menu_mess('m${id_m}')`);
    }
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
//    document.getElementById("content").innerHTML += new_mess;
    messagesDiv.appendChild(messageItem);
     scrollToBottom("content");
     if(pinned){
        add_pinned(id_m);
     }
}

var autoScroll = true;

document.getElementById('content').addEventListener('scroll', function() {
    var scrollTop = this.scrollTop;
    var scrollHeight = this.scrollHeight;
    var height = this.clientHeight;

//    if (autoScroll) {
//        if (scrollTop &lt; scrollHeight - height) {
//            autoScroll = false;
//        }
//    } else {
//        if (scrollTop + height &gt;= scrollHeight) {
//            autoScroll = true;
//        }
//    }
});
function scrollToBottom(elementId) {
    var div = document.getElementById(elementId);
    div.scrollTop = div.scrollHeight;
}


function open_menu_mess(id_mess){
    if (globalThis.menu_id != ""){
        try{
        document.getElementById(menu_id).style.display = "none";
        } catch(err) {}
    };
    globalThis.menu_id = "m" + id_mess;
    var ul = '';
    var curr_m = document.getElementById("m" + id_mess);
    if (document.getElementById(id_mess).className == "my-message") {
        curr_m.innerHTML = '<ul><li onclick="pinned(' + id_mess.slice(1) + ')">закрепить</li><li onclick="copyToClipboard(' + id_mess.slice(1) + ')">Копировать</li><li onclick="delete_mess(' + id_mess.slice(1) + ')">Удалить</li>\
        <li onclick="answer(' + id_mess.slice(1) + ')">Ответить</li><li onclick="edit(' + id_mess.slice(1) + ')">Редактировать</li>\
        <li onclick="send(' + id_mess.slice(1) + ')">Переслать</li></ul>';
    } else {
        curr_m.innerHTML = '<ul><li onclick="pinned(' + id_mess.slice(1) + ')">закрепить</li><li onclick="copyToClipboard(' + id_mess.slice(1) + ')">Копировать</li>\
        <li onclick="delete_mess(' + id_mess.slice(1) + ')">Удалить</li>\
        <li onclick="answer(' + id_mess.slice(1) + ')">Ответить</li><li onclick="send(' + id_mess.slice(1) + ')">Переслать</li></ul>';
    }
    showdiv1("m" + id_mess);
}


if (mobile){
    document.getElementById("about").style.fontSize = "50px";
    document.getElementById("btn_down").style.visibility = 'hidden';
    document.getElementById("plus_svg").setAttribute("width", "100px");
    };


function go_pin(id_mess){
    var mess = document.getElementById('m' + id_mess);
    mess.style.background = "#6666ff";
    setTimeout(function() {
    if (mess.className == "my-message"){
        mess.style.background = "#D1E7DD";
    } else{
        mess.style.background = "#CFF4FC";
    }
}, 2000);
    window.location.hash = "#m" + id_mess;
    var list_pin = document.getElementById("list_pin").value.trim().split(" ");
    for (let i = 0; i < list_pin.length; i++){
        if (list_pin[i] == id_mess){
            const btn = document.getElementById('pin_btn');
            if (i + 1 < list_pin.length){
                btn.textContent = document.getElementById('text' + list_pin[i + 1]).textContent;
                btn.setAttribute('onclick', `go_pin('${list_pin[i + 1]}')`);
            } else {
                btn.textContent = document.getElementById('text' + list_pin[0]).textContent;
                btn.setAttribute('onclick', `go_pin('${list_pin[0]}')`);
            }
        }
    }

}

function set_bg(num) {
    if (mobile){
        document.getElementById("background-img").src = "/static/img/bg/mob_bg" + num + ".jpg";
    } else {
    document.getElementById("background-img").src = "/static/img/bg/bg" + num + ".jpg";
    }
    document.cookie = "bg="+ num;
}

function set_bg_my(num) {
    document.getElementById("background-img").src = "/static/img/bg_users/" + num + ".jpg";
    document.cookie = "bg=5";
}

document.addEventListener('click', (e) => {
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
})


function scroll(){
     var scrollTop = $(window).scrollTop(),
        elementOffset = $('#content').offset().top,
        distance = (elementOffset - scrollTop);
     if (distance < globalThis.global_distans){
         globalThis.global_distans = distance;
     };
    if (-400 < globalThis.global_distans - distance){
         if (window.location.hash == "#pos"){
                window.location.hash = "#pos2";
         }else{
            window.location.hash = "#pos";
            }
        }
}


function edit_prof_html(){
    var menu = document.getElementById("global_menu");
    document.getElementById("global_menu_d") .style.display = "block";
    $.ajax({
        url: '/m/c_get_user',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
            menu.innerHTML = '<h2>Редактировать профиль</h2><button onclick="show_global_menu(' + "'global_menu_d'" + '\
            , ' + id + ')" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>';
            menu.innerHTML += '<div class="edit-cont" id="p_group" style="display:none;"></div>';
            menu.innerHTML  += '<div class="edit-cont" id="edit_cont"><label>Имя</label><br><input id="name_edit"\
             name="name_edit"value="'+ json["user"]["name"] + '"><br><label for="email_edit">Email</label><br></div>';
            var edit_cont = document.getElementById("edit_cont");
            edit_cont.innerHTML += '<input name="email_edit" id="email_edit" value="'+ json["user"]["email"] + '"><br>\
            <button class="edit-btn" onclick="edit_prof_post()">Сохранить</button>\
            <button class="edit-btn" onclick="showDiv(' + "'p_group', 'edit_cont'" +')">Сменить пароль</button>';
            var p_group = document.getElementById("p_group");
            p_group.innerHTML = 'Для смены пародя введите старый пароль<br><input name="password_old" id="password_old"\
             type="password"><br><label for="password_new">Новый пароль</label><br><input name="password_new"\
              id="password_new" type="password">';
            p_group.innerHTML += '<br><button class="edit-btn" onclick="post_password()">Сменить</button>';
            },
        error: function(err) {
            console.error(err);
        }
    });
}
function uploadFile(file) {
  const xhr = new XMLHttpRequest(); // Создаем новый XMLHttpRequest
  const formData = new FormData(); // Используем FormData для отправки файла

  formData.append('file', file); // Добавляем файл в объект FormData

  // Обработчик для отслеживания прогресса загрузки
  xhr.upload.addEventListener('progress', function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      document.getElementById('progressBar').value = percentComplete; // Обновляем прогресс-бар
    }
  });

  // Обработчик на случай успешной загрузки
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      document.getElementById('status').textContent = 'Файл успешно загружен!';
      document.getElementById("bg5").click();
    } else {
      document.getElementById('status').textContent = 'Ошибка при загрузке файла.';
    }
  });

  // Обработчик для ошибок
  xhr.addEventListener('error', function () {
    document.getElementById('status').textContent = 'Произошла ошибка при загрузке файла.';
  });

  xhr.open('POST', '/m/users_bg'); // Указываем метод и URL для отправки файла
  xhr.send(formData); // Отправляем данные
}
window.addEventListener('paste', e => {
    document.getElementById("send2_btn").style.display = "block";
  document.getElementById("inputTag").files = e.clipboardData.files;
  imageName.innerText = "картинка";
  const item = e.clipboardData.items[0];
   if (item.type.indexOf("image") === 0) {
         document.getElementById("watch").style.display = "block";
         document.getElementById("form").style.display = "block";
         document.getElementById("form").style.zIndex = "10";
         const blob = item.getAsFile();
        // создаем объект, считывающий файлы
                const reader = new FileReader();
                // когда файл загрузится
                reader.onload = function (event) {
                    // вставляем его на страницу
                    document.getElementById("watch_img").src = event.target.result;
                };
                // запускаем чтение двоичных данных файл как тип data URL
                reader.readAsDataURL(blob);
            }
});


function search_text(){
    alert("В разработке!");
}


function answer_color (src){
    window.location.hash = "#" + src;
    var mess = document.getElementById(src);
    mess.style.background = "#6666ff";
    setTimeout(function() {
    if (mess.className == "my-message"){
        mess.style.background = "#D1E7DD";
    } else{
        mess.style.background = "#CFF4FC";
    }

    // do your thing!
}, 2000);
}