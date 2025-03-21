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
var nav = document.getElementById("nav").offsetHeight;
var m_c =   document.getElementById("container-mess");
var email_cont = document.getElementById("email");
m_c.style.height =  window.innerHeight - f - nav + "px";
m_c.style.top = nav;
email_cont.style.top = nav;
email_cont.style.height = window.innerHeight - f - nav + "px";
document.getElementById("background-img").style.height =  window.innerHeight - nav + "px";
document.getElementById("form").style.display = "none";


function gener_html(id_m, text, time, html_m, file_, other, read, name_sender) {
    imges = ["bmp", "jpg", "png", "svg"]
    audio = ["mp3", "flac", "m4a"]
    video = ["mp4", "mov"]
    if (other) {
        var class_m = "alert-info message-other";
    } else{
        var class_m = "alert-success my-message";
    };
    var onclick = "";
    if (mobile){
        onclick = 'onclick="open_menu_mess(' + "'m"+ id_m +"'" + ')"';
    }
    new_mess = '<div class="alert ' + class_m + '" id="m' + id_m + '" ' + onclick + 'role="alert">';
    if (file_ != ""){
        var ras = file_[1].split(".");
        ras = ras[ras.length - 1];
        if (imges.includes(ras)){
            new_mess += '<button class="info-btn" onclick="' + "showImg('m" + id_m + "', '" + file_[1] + "')" + '"><img class="mess-img" src="/static/img/' + file_[1] + '"></button>';
        } else {
             if (audio.includes(ras)){
                var w = window.innerWidth * 0.187;
                    if (mobile){
                        w = window.innerWidth * 0.57;
                    };
                 new_mess += '<audio style="width:' + w + 'px;" controls class="audio" src="/static/img/' + file_[1] + '">' + file_[0] + '</audio>';
            } else {
                if (video.includes(ras)){
                    var w = window.innerWidth * 0.18;
                    if (mobile){
                        w = window.innerWidth * 0.57;
                    };
                    new_mess += '<video width="' + w +'px" controls class="audio" src="/static/img/' + file_[1] + '">' + file_[0] + '</video>';
                } else{
                    new_mess += '<a class="my-a" download="' + file_[0] + '" href="/static/img/' + file_[1] + '">' + file_[0] + '</a>';
                }
        }
    }
    };
    new_mess += '<p>' + html_m +'</p> <p id="text' + id_m + '" class="text-in-mess">' + text + '</p>';
    if (read){
        new_mess += '<p class="time-mess">'+ time + ' '+ name_sender +'<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">✓✓</button></p>';
    } else{
        new_mess += '<p class="time-mess">'+ time + ' '+ name_sender + '<button type="button" class="info-btn "\
         data-bs-toggle="tooltip" data-bs-placement="top" title="доставлено">✓</button></p>';
    }

    new_mess += '<div class="context-menu-open" id="mm' + id_m + '" style="display:none;"></div>';
    document.getElementById("content").innerHTML += new_mess;
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
    if (document.getElementById(id_mess).className == "alert alert-success my-message") {
        curr_m.innerHTML = '<ul><li onclick="copyToClipboard(' + id_mess.slice(1) + ')">Копировать</li><li onclick="delete_mess(' + id_mess.slice(1) + ')">Удалить</li>\
        <li onclick="answer(' + id_mess.slice(1) + ')">Ответить</li><li onclick="edit(' + id_mess.slice(1) + ')">Редактировать</li>\
        <li onclick="send(' + id_mess.slice(1) + ')">Переслать</li></ul>';
    } else {
        curr_m.innerHTML = '<ul><li onclick="copyToClipboard(' + id_mess.slice(1) + ')">Копировать</li>\
        <li onclick="delete_mess(' + id_mess.slice(1) + ')">Удалить</li>\
        <li onclick="answer(' + id_mess.slice(1) + ')">Ответить</li><li onclick="send(' + id_mess.slice(1) + ')">Переслать</li></ul>';
    }
    showdiv1("m" + id_mess);
}


if (mobile){
    document.getElementById("about").style.fontSize = "50px";
    document.getElementById("btn_down").style.visibility = 'hidden';
    };


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
  document.getElementById("inputTag").files = e.clipboardData.files;
  imageName.innerText = "картинка";
//  document.
});