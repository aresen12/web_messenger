var enter_flag = true;
var answer_flag = false;
var edit_flag = false;
var edit_id = 0;
var global_distans = 0;
var menu_id = "";

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
    globalThis.number_bg = getCookie("bg");
    var button = document.getElementById("bg"+ number_bg);
    button.click();

} else {
document.cookie = "bg=2";
var button = document.getElementById("bg"+ number_bg);
    button.click();
}


function getCookie(name) {
  let cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
}

// 1 - send by enter 2 - send by ctrl + enter

function set_enter(key) {
    if(key == 2) {
        globalThis.enter_flag = false;
    } else {
        globalThis.enter_flag = true;
    }
}


function edit (id_mess){
    globalThis.edit_flag = true;
    globalThis.edit_id = id_mess;
    var t = document.getElementById("text" + id_mess).textContent.trim();
    document.getElementById("about").value = t;
    var la = document.getElementById("edit-label");
    la.innerHTML = t;
    la.innerHTML += '<button type="button" onclick="close_edit()" class="btn-close edit-btn-close" aria-label="Close"></button>'
    la.style.display = "block";

}


function close_edit() {
    globalThis.edit_id = "";
    globalThis .edit_flag = false;
    document.getElementById("edit-label").style.display = "none";
}


function edit_post(id_mess, text){
    $.ajax({
    url: '/m/edit_message',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id":id_mess, "new_text": text}),
    success: function(json){
        show();
        close_edit();
    },
    error: function(err) {
        console.error(err);
    }
});
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


function sing_out_of_chat(){
    $.ajax({
    url: '/m/sing_out_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"chat_id": document.getElementById("chat_id").value}),
    success: function(json){
        get_chats();
        exit_chat();
    },
    error: function(err) {
        console.error(err);
    }
});
}


function set_recipient(id_chat, is_primary, name, status) {
    document.getElementById("content").innerHTML = '<h2 class="update">Загрузка...<h2>';
    if (status == 1){
        document.getElementById("form").style.display = "block";
    }else{
        document.getElementById("form").style.display = "none";
    }
    var menu = document.getElementById("menu-chat-ul");
    menu.innerHTML = '<li onclick="block_user()">Заблокировать</li><li onclick="delete_chat()">Удалить чат</li>';
    if (is_primary){
        menu.innerHTML += '<li onclick="sing_out_of_chat()">Покинуть чат</li>';
    };
    document.getElementById("chat_id").value = id_chat;
    document.getElementById('name_chat').innerText = name;
    var x = document.getElementById("background-img");
    var y = document.getElementById("email");
    var button = document.getElementById("button");
    window.location.hash = "#";
    show();
    var scrollTop = $(window).scrollTop(),
    elementOffset = $('#content').offset().top,
    distance = (elementOffset - scrollTop);
    globalThis.global_distans = distance;
    document.getElementById('chat_id').innerText = id_chat;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)){
        x.style.display = "block";
        x.src = "/static/img/bg/mob_bg"+ globalThis.number_bg +".jpg";
        var button = document.getElementById("button").style.visibility = 'visible';
        var cont = document.getElementById("container-mess");
        cont.style.display = "block";
        y.style.display = "none";
        document.getElementById("settings_btn").style.display = 'none';
        document.getElementById("btn_down").style.visibility = 'visible';
    }

}


function exit_chat(){
    document.getElementById("content").innerHTML = "";
    document.getElementById('name_chat').innerText = "";
    document.getElementById('chat_id').innerText = "";
    document.getElementById('form').style.display = "none";
    document.getElementById('menu-chat-ul').innerHTML = '';
    if (mobile) {
        var x = document.getElementById("background-img");
        var y = document.getElementById("container-mess");
        x.style.display = "none";
        y.style.display = "none";
        document.getElementById("settings_btn").style.display = 'block';
        document.getElementById("button").style.visibility = 'hidden';
        document.getElementById("email").style.display = "block";
        document.getElementById("btn_down").style.visibility = 'hidden';
    }
}


setSelectionRange = function(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
};


function go(){
    if (document.getElementById("global_menu_d").style.display == "none"){
        setSelectionRange(document.getElementById("about"), globalThis.position, globalThis.position);
    }
}


function submit_form() {
    var x = document.querySelector('.form2');
    if (edit_flag){
        globalThis.edit_flag = false;
        var about = document.getElementById("about");
        edit_post(edit_id, about.value);
        about.value = "";
        document.getElementById('inputTag').value = "";
        close_edit();
    } else {
        var text = document.getElementById("about").value;
        if ($('form input[type=file]').val() == '' && text.trim() != ""){
            var html_m = document.getElementById("html_m").value;
            $.ajax({
            url: '/m/send_message',
            type: 'POST',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({
             "chat_id":document.getElementById("chat_id").value,
             "new_text": text,
             "html": html_m}),
            success: function(json){
                gener_html(json["id"], text, json["time"], html_m, "",  0, 0);
                window.location.hash = "";
            window.location.hash = "#pos";
            },
            error: function(err) {
                console.error(err);
            }
            });
            close_edit();
    }else {
        var b = x.submit();
    }
//        var rec = document.getElementById("chat_id").value;
     x.reset();
//        document.getElementById("chat_id").value = rec;
   document.getElementById("imageName").innerHTML = "";
//        show();
    }

}


document.addEventListener('click', function(e){
      if (menu_id != ""){
        document.getElementById(menu_id).style.display = "none";
        globalThis.menu_id = "";
      };
      })


document.addEventListener('keydown', function(event) {
    var x = document.querySelector('form');
    if (enter_flag) {
        if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
        var about = document.getElementById("about");
        var test_in_about = about.value;
        globalThis.position = about.selectionStart + 1;
        about.value = test_in_about + "\n";
        go();
        // add len text
        }
        if (event.keyCode == 13 && !(event.ctrlKey)) {
         event.preventDefault();
        submit_form();
        }
    }else {
        if ( (event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
         event.preventDefault();
            submit_form();
  }
  }
});



function show(){
    if (document.getElementById("chat_id").value != "") {
      $.ajax({
    url: '/m/get_json_mess',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"chat_id": document.getElementById("chat_id").value}),
    success: function(json_mess){
        var cont = document.getElementById("content");
        cont.innerHTML = '<input id="summ_id" value="' + json_mess['summ_id'] + '" style="display:none;">';
        var date = "";
        for (let i = 0; i < json_mess["messages"].length; i++){
            var c_m = json_mess["messages"][i];
            if (json_mess["current_user"] == c_m["id_sender"]){
                var other = 0;
            } else {
                other = 1;
            }
            var file = "";
            if (c_m["file"]){
                file = json_mess["files"][c_m["file"]];
            };
            var time = c_m["time"].split(" ");
            if (date != time[0]){
                var time2 = time[0].split("-");
                date = time[0];
                cont.innerHTML += '<div class="date_k">' + time2[2]+ "." + time2[1] + "." + time2[0] + '</div>';
            };
            gener_html(c_m["id"], c_m["text"], time[1].split(".")[0], c_m["html_m"], file, other, c_m['read']);
        }
        cont.innerHTML += '<div id="pos"></div>';
        var scrollTop = $(window).scrollTop(),
        elementOffset = $('#content').offset().top,
        distance = (elementOffset - scrollTop);
        if (distance < globalThis.global_distans){
            globalThis.global_distans = distance
        }
        globalThis.position = document.getElementById("about").selectionStart;
        if (-400 < globalThis.global_distans - distance){
             window.location.hash = "#";
        }
        window.location.hash = "#pos";
        go()
        },
    error: function(err) {
        console.error(err);
    }
});}
    }


function get_new_m (){
if (document.getElementById("chat_id") && document.getElementById("chat_id").value != "") {
    $.ajax({
    url: '/m/get_new',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id": document.getElementById("chat_id").value}),
    success: function(json){
          if (json["summ_id"] != document.getElementById("summ_id").value){
            show();
            (async () => {
              try {
                const permission = await Notification.requestPermission();
                if (Notification.permission === 'denied') {
    }
                console.log(permission);
                const options = {
                  body: "body",
                  icon:
                    "https://www.iconninja.com/files/926/373/306/link-chain-url-web-permalink-web-address-icon.png"
                };
                new Notification("title", options);
              } catch (error) {
                console.log(error);
              }
            })();
          }
          },
    error: function(err) {
        console.error(err);
    }
});}
}



function create_chat(list_members, name, is_primary){
    $.ajax({
    url: '/m/create_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name":name, "list_members": list_members, "primary":is_primary}),
    success: function(json){
          // update chats list
          get_chats();
        },
    error: function(err) {
        console.error(err);
    }
});
    }

show();
var mobile = false;
setInterval(get_new_m, 10000);
const form = document.querySelector('form');
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)){
    var x = document.getElementById("background-img");
    var y = document.getElementById("container-mess");
    x.style.display = "none";
    var button = document.getElementById("button").style.visibility = 'hidden';
    y.style.display = "none";
    globalThis.mobile = true;
}
var position = 0;



function edit_prof_html(){
    var menu = document.getElementById("global_menu");
    document.getElementById("global_menu_d") .style.display = "block";
    $.ajax({
        url: '/m/c_get_user',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
            menu.innerHTML = '<h2>Редактировать профиль<button onclick="show_global_menu(' + "'global_menu_d'" + ', ' + id + ')" type="button" class="btn-close" aria-label="Close"></button></h2>';
            menu.innerHTML  += '<div class="edit-cont"><label>Имя</label><br><input id="name_edit" name="name_edit"value="'+ json["user"]["name"] + '"><br><label for="email_edit">Email</label><br><input name="email_edit" id="email_edit" value="'+ json["user"]["email"] + '"><br>'+'Для смены пародя введите старый пароль<br><input name="password_old" id="password_old"><br><label for="password_new">Новый пароль</label><br><input name="password_new" id="password_new"><br><button class="edit-btn" onclick="edit_prof_post()">Сохранить</button></div>';
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function delete_mess(id_mess){
      $.ajax({
    url: '/m/delete',
    type: 'DELETE',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id":id_mess}),
    success: function(html){
          show();
        },
    error: function(err) {
        console.error(err);
    }
});
    }


function edit_prof_post() {
let is_edit = confirm("Вы действительно хотите отредактировать профиль");
if (is_edit){
document.getElementById("global_menu").style.display = "none";
$.ajax({
    url: '/m/edit_prof',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name": document.getElementById("name_edit").value, "email": document.getElementById("email_edit").value}),
    success: function(html){
          get_chats();
        },
    error: function(err) {
        console.error(err);
    }
});
}
}



function delete_chat() {
    show_menu('menu-chat');
    let is_del = confirm("Вы действительно хотите удалить этот чат?");
    if (is_del){
        $.ajax({
            url: '/m/delete_chat',
            type: 'DELETE',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"id_chat": document.getElementById("chat_id").value}),
            success: function(html){
                  get_chats();
                  exit_chat();
                },
            error: function(err) {
                console.error(err);
            }
        });
    }
}


function block_user() {
    show_menu('menu-chat');
    let is_block = confirm("Вы действительно хотите заблокировать чат?");
    if (is_block){
        $.ajax({
            url: '/m/block_chat',
            type: 'POST',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"id_chat": document.getElementById("chat_id").value}),
            success: function(html){
                  get_chats();
                  exit_chat();
                },
            error: function(err) {
                console.error(err);
            }
        });
    }
}

function answer(id_mess){
    var la = document.getElementById("edit-label");
    var t = document.getElementById("text" + id_mess).textContent.trim();
    la.innerHTML = t;
    la.innerHTML += '<button type="button" onclick="close_edit()" class="btn-close edit-btn-close" aria-label="Close"></button>'
    la.style.display = "block";
    document.getElementById("html_m").value = '<a href="#m' + id_mess +'" class="answer-a">' + t + '</a>';
}


function show_menu(id_div){
    var x = document.getElementById(id_div);
    if(x.style.display=="none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}


function show_global_menu(id_div, id){
    var x = document.getElementById(id_div);
    if(x.style.display=="none" || x.style.display=="") {
        x.style.display = "block";
        get_users(id);
    } else {
        x.style.display = "none";
    }
}


function get_users (id){
    $.ajax({
        url: '/m/get_users',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
        document.getElementById("global_menu").innerHTML="foo";
        var html = '<h2>Создать чаты<button onclick="show_global_menu(' + "'global_menu_d'" + ', ' + id + ')" type="button" class="btn-close" aria-label="Close"></button></h2>';
        for (let i = 0; i < json["users"].length; i++){
            if (json["c_user"] != json["users"][i][2]){
               html = html + '<label class="add-menu">' + '<input type="checkbox" onclick="add_chat(' + json["users"][i][2] + ')">' + json["users"][i][0] + '</label><br>';
            }
        }
        document.getElementById("global_menu").innerHTML = html;
        document.getElementById("global_menu").innerHTML += '<button onclick="create_group()" class="edit-btn">Create</button><br><div class="add-menu" id="name_new_chat_group" style="display:none;"><label>Имя чата</label><br><input id="name_new_chat"></div><input id="list_members" style="display:none;" value="' + json["c_user"] + '">';
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function add_chat(new_mem){
    var list_mem = document.getElementById("list_members");
    list_mem.value = list_mem.value.trim();
    t_m = list_mem.value.split(" ");
    if (new_mem + "" in t_m){ //  удаление из списка
    for (i=0; i < t_m.length; i++){
        if (new_mem == t_m[i]){
            t_m.splice(i, i + 1);
            list_members.value = t_m.join(" ");
            if (t_m.length <= 2){
                document.getElementById("name_new_chat_group").style.display = 'none';
            }
    }
    }
    } else {
        list_mem.value += " " + new_mem;
        if (t_m.length + 1 > 2){
            document.getElementById("name_new_chat_group").style.display = 'block';
        }
    }
}


// добавление пользователя в уже существующий чат
function add_chat_user(new_mem){
    var list_mem = document.getElementById("list_of_new_u");
    list_mem.value = list_mem.value.trim();
    t_m = list_mem.value.split(" ");
    if (new_mem + "" in t_m){ //  удаление из списка
        for (i=0; i < t_m.length; i++){
            if (new_mem == t_m[i]){
                t_m.splice(i, i + 1);
                list_members.value = t_m.join(" ");
            }
        }
    } else {
    list_mem.value += " " + new_mem;
    }
}



function edit_name_chat(){
    $.ajax({
        url: '/m/edit_name_chat',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": document.getElementById('chat_id').value, "new_name": document.getElementById('new_chat_name').value}),
        success: function(html){
              get_chats();
            },
        error: function(err) {
            console.error(err);
        }
    });

}


function create_group (){
    var name = document.getElementById("name_new_chat").value;
    var list_members = document.getElementById("list_members").value;
    if (list_members.trim() == ""){
    return "";
    }
    var is_primary = 1;
    if (list_members.split(" ").length > 2){
        is_primary = 0;
        if (name.trim() == ""){
        document.getElementById("name_new_chat").value = "Добавьте имя!!!";
        return "";
        }
    }
    console.log(list_members.split().length);

      $.ajax({
    url: '/m/create_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name":name, "list_members": list_members, "primary":is_primary}),
    success: function(json){
          // update chats list
          get_chats();
          document.getElementById("global_menu").style.display = 'none';
        },
    error: function(err) {
        console.error(err);
    }
});
}

function get_user (id_user){
$.ajax({
    url: '/m/get_user/' + id_user,
    type: 'GET',
    dataType: 'json',
    contentType:'application/json',
    success: function(json){
        },
    error: function(err) {
        console.error(err);
    }
});
}


function submit_new_users(){
    var list_members = document.getElementById("list_of_new_u").value;
    $.ajax({
        url: '/m/add_in_chat',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id":document.getElementById("chat_id").value, "list_members": list_members}),
        success: function(json){
            show_users();
            },
        error: function(err) {
            console.error(err);
        }
    });

}


var name = "";
var html_ = "";
function get_chats (){
    globalThis.html_ = "";
    $.ajax({
        url: '/m/get_chats',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
           for (let i = 0; i < json["chats"].length; i++){
           if (json["chats"][i]["primary_chat"]){
             $.ajax({
                url: '/m/get_chat_user/' + json["chats"][i]["id"],
                type: 'GET',
                dataType: 'json',
                contentType:'application/json',
                success: function(json2){
                t_id = 0;
                if (json2["user"][0] != id){
                    t_id = json2["user"][0]
                } else{
                    t_id = json2["user"][1]
                }
                $.ajax({
                    url: '/m/get_user/' + t_id,
                    type: 'GET',
                    dataType: 'json',
                    success: function(json3){
                    globalThis.name = json3["user"];
                    globalThis.html_ = globalThis.html_ + '<button class="a-email" onclick="set_recipient(' + "'" +json["chats"][i]["id"] + "', '" + json["chats"][i]["primary_chat"] +  "', '" + json3["user"] + "', " + json["chats"][i]["status"] + ')"' + '">' + json3["user"] +'</button>';
                    document.getElementById("email").innerHTML = globalThis.html_;
                    },
                    error: function(err) {
                        console.error(err);
                    }
                    });
            },
        error: function(err) {
            console.error(err);
        }
    });
            }else{
                name = json["chats"][i]["name"];
                globalThis.html_ = globalThis.html_ + '<button class="a-email" onclick="set_recipient(' + "'" +json["chats"][i]["id"] +"', '" + json["chats"][i]["primary_chat"] +  "', '" + globalThis.name + "', " + json["chats"][i]["status"] + ')">' + json["chats"][i]["name"] +'</button>';
                document.getElementById("email").innerHTML = globalThis.html_;
           }
           }
           document.getElementById("email").innerHTML = globalThis.html_;
            },
        error: function(err) {
            console.error(err);
        }
});
}


// отрисовка интерфейса
get_chats();
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
if (mobile){
    document.getElementById("about").style.fontSize = "50px";
    document.getElementById("btn_down").style.visibility = 'hidden';
    }
function set_bg(num) {
    document.getElementById("background-img").src = "/static/img/bg/bg" + number_bg + ".jpg";
    document.cookie = "bg="+ number_bg;
}


function gener_html(id_m, text, time, html_m, file_, other, read) {
    imges = ["bmp", "jpg", "png", "svg"]
    audio = ["mp3", "flac", "m4a"]
    video = ["mp4", "mov"]
    if (other) {
        var class_m = "alert-info message-other";
    } else{
        var class_m = "alert-success my-message";
    }
    new_mess = '<div class="alert ' + class_m + '" id="m' + id_m + '" role="alert">';
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
    new_mess += '<p>' + html_m +'</p> <p id="text' + id_m + '">' + text + '</p>';
    if (read){
        new_mess += '<p class="time-mess">'+ time +'<button type="button" class="info-btn " data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">✓✓</button></p>';
    } else{
        new_mess += '<p class="time-mess">'+ time +'<button type="button" class="info-btn " data-bs-toggle="tooltip" data-bs-placement="top" title="доставлено">✓</button></p>';
    }

    new_mess += '<div class="context-menu-open" id="mm' + id_m + '" style="display:none;"></div>';
    document.getElementById("content").innerHTML += new_mess;
    go();
}


function add_in_chat_new(){
    var global_menu = document.getElementById("global_menu");
    document.getElementById("users").style.display = "none";
    global_menu.innerHTML += '<div id="add_new_users"></div>';
    var add_new_users = document.getElementById("add_new_users");
    add_new_users.innerHTML = '<input style="display:none;" id="list_of_new_u">'
    $.ajax({
    url: '/m/get_users',
    type: 'GET',
    dataType: 'json',
    contentType:'application/json',
    success: function(json){
            var sp = document.getElementById("list_c_u").value.split(" ");
            for (let i = 0; i < json["users"].length; i++){
                if (json["users"][i][2] in sp || json["c_user"] == json["users"][i][2]){
                } else{
                add_new_users.innerHTML += '<label class="add-menu">' + '<input type="checkbox" onclick="add_chat_user(' + json["users"][i][2] + ')">' + json["users"][i][0] + '</label><br>';
            }
            }
            add_new_users.innerHTML += '<button onclick="submit_new_users()" class="edit-btn">Добавить</button>'
        },
    error: function(err) {
        console.error(err);
    }
});
}


function show_users(){
    if (document.getElementById("chat_id").value != ""){
        $.ajax({
            url: '/m/get_chat_user/' + document.getElementById("chat_id").value,
            type: 'GET',
            dataType: 'json',
            contentType:'application/json',
            success: function(json){
            var global_menu = document.getElementById("global_menu");
            document.getElementById("global_menu_d").style.display = "flex";
            global_menu.style.display = "block";
            global_menu.innerHTML = '<h2>Управление чатом<button onclick="show_global_menu(' + "'global_menu_d'" + ', ' + id + ')" type="button" class="btn-close m-close" aria-label="Close"></button></h2><br>';
            global_menu.innerHTML += '<div id="users"><div id="con_users"></div><div id="edit_users"></div></div>';
            var users_div = document.getElementById("con_users");
            users_div.innerHTML += '<h3>Участники</h3>';
            for (let i = 0; i < json["user"].length; i++){
             $.ajax({
                url: '/m/get_user/' + json["user"][i],
                type: 'GET',
                dataType: 'json',
                contentType:'application/json',
                success: function(json_data){
                    users_div.innerHTML += '<label class="add-menu">'+ json_data["user"]+ '(' +json_data["email"] + ')' + '</label><br>';

                    },
                error: function(err) {
                    console.error(err);
                }
            });
            };
            if (! json["primary_chat"]){
                var users_div_edit = document.getElementById("edit_users");
                users_div_edit.innerHTML += '<button onclick="add_in_chat_new()" class="edit-btn">Добавить участника</button>';
                users_div_edit.innerHTML += '<div><label>Имя чата</label><br><input class="add-menu" id="new_chat_name" value="' + document.getElementById("name_chat").innerText + '"><br><button onclick="edit_name_chat()" class="edit-btn">изменить</button></div>';
                users_div_edit.innerHTML += '<input id="list_c_u" value="'+ json["user"].join(" ") + '" style="display:none;">'
            }
            },
            error: function(err) {
                console.error(err);
            }
        });
    };
}


function open_menu_mess(id_mess){
    if (globalThis.menu_id != ""){
        document.getElementById(menu_id).style.display = "none";
    };
    globalThis.menu_id = "m" + id_mess;
    var curr_m = document.getElementById("m" + id_mess);
    if (document.getElementById(id_mess).className == "alert alert-success my-message") {
        curr_m.innerHTML = '<ul><li onclick="delete_mess(' + id_mess.slice(1) + ')">Удалить</li><li onclick="answer(' + id_mess.slice(1) + ')">Ответить</li><li onclick="edit(' + id_mess.slice(1) + ')">Редактировать</li></ul>';
    } else {
        curr_m.innerHTML = '<ul><li onclick="delete_mess(' + id_mess.slice(1) + ')">Удалить</li><li onclick="answer(' + id_mess.slice(1) + ')">Ответить</li></ul>';
    }
    show_menu("m" + id_mess);
}


$('#content').on('contextmenu','div', function(e) { //Get li under ul and invoke on contextmenu
        e.preventDefault(); //Prevent defaults
        open_menu_mess(this.id); //alert the id
        });

