

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


var enter_flag = true;
var answer_flag = false;
var edit_flag = false;
var edit_id = 0;
var global_distans = 0;
var number_bg = 2;


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
var la = document.getElementById("edit-label");
la.style.display = "none";
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


function set_recipient(id_chat, is_primary, name) {
document.getElementById("form").style.display = "block";
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
    var scrollTop     = $(window).scrollTop(),
    elementOffset = $('#content').offset().top,
    distance      = (elementOffset - scrollTop);
    globalThis.global_distans = distance;
    document.getElementById('chat_id').innerText = id_chat;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)){
    x.style.display = "block";
    x.src = "/static/img/bg/mob_bg2.jpg"
    var button = document.getElementById("button").style.visibility = 'visible';
    var cont = document.getElementById("container-mess");
    cont.style.display = "block";
    y.style.display = "none";
    }

}


function exit_chat(){
    document.getElementById("content").innerHTML = "";
    document.getElementById('name_chat').innerText = "";
    document.getElementById('chat_id').innerText = "";
    document.getElementById('form').style.display = "none";
    document.getElementById('menu-chat-ul').innerHTML = '';
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
setSelectionRange(document.getElementById("about"), globalThis.position, globalThis.position);
}


function submit_form() {
    var x = document.querySelector('.form2');
    if (edit_flag){
        globalThis.edit_flag = false;
        var about = document.getElementById("about");
        edit_post(edit_id, about.value);
        about.value = "";
        document.getElementById('inputTag').value = "";
    } else {
if ($('form input[type=file]').val() == ''){
    var text = document.getElementById("about").value;
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
    console.log(json);
    gener_html(json["id"], text, json["time"]);
    },
    error: function(err) {
        console.error(err);
    }
});
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

document.querySelector('.form2').addEventListener('submit', function(e) {
  e.preventDefault();
  var rec = document.getElementById("chat_id").value;
  document.getElementById("chat_id").value = rec;
  document.getElementById("imageName").innerHTML = "";
  this.reset();
  show();
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
    url: '/m/update/' + document.getElementById("chat_id").value,
    type: 'GET',
    dataType: 'html',
    success: function(html){
          $("#content").html(html);
            var scrollTop     = $(window).scrollTop(),
    elementOffset = $('#content').offset().top,
    distance      = (elementOffset - scrollTop);
          console.log(distance, globalThis.global_distans, globalThis.global_distans - distance);
          if (distance < globalThis.global_distans)
          {globalThis.global_distans = distance}
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
if (document.getElementById("chat_id").value != "") {
    $.ajax({
    url: '/m/get_new',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id": document.getElementById("chat_id").value}),
    success: function(json){
        console.log(json["message"].length)
          if (json["message"].length > 0){
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



function create_chat(list_members, name, is_primary)
    {
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

setInterval(get_new_m, 10000);
const form = document.querySelector('form');
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent))
{ var x = document.getElementById("background-img");
var y = document.getElementById("container-mess");
x.style.display = "none";
var button = document.getElementById("button").style.visibility = 'hidden';
y.style.display = "none";
}
var position = 0;



function edit_prof_html(){
var menu = document.getElementById("global_menu");
menu.style.display = "block";
$.ajax({
    url: '/m/c_get_user',
    type: 'GET',
    dataType: 'json',
    contentType:'application/json',
    success: function(json){
        menu.innerHTML = '<h2>Редактировать профиль<button onclick="show_global_menu(' + "'global_menu'" + ', ' + id + ')" type="button" class="btn-close" aria-label="Close"></button></h2>';
        menu.innerHTML  += '<div class="edit-cont"><label>Имя</label><br><input id="name_edit" name="name_edit"value="'+ json["user"]["name"] + '"><br><label for="email_edit">Email</label><br><input name="email_edit" id="email_edit" value="'+ json["user"]["email"] + '"><br>'+'Для смены пародя введите старый пароль<input name="password_old" id="password_old"><br><label for="password_new">Новый пароль</label><br><input name="password_new" id="password_new"><br><button class="edit-btn" onclick="edit_prof_post()">Сохранить</button></div>';
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
    url: '/m/delete_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"id_chat": document.getElementById("chat_id")}),
    success: function(html){
          get_chats();
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
    if(x.style.display=="none") {
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
    var html = '<h2>Создать чаты<button onclick="show_global_menu(' + "'global_menu'" + ', ' + id + ')" type="button" class="btn-close" aria-label="Close"></button></h2>';
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
                    globalThis.html_ = globalThis.html_ + '<button class="a-email" onclick="set_recipient(' + "'" +json["chats"][i]["id"] +"', '" + json["chats"][i]["primary_chat"] +  "', '" + json3["user"] + "')" + '"' + '">' + json3["user"] +'</button>';
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
           }else{name = json["chats"][i]["name"];
           console.log(globalThis.name, "bu");
           globalThis.html_ = globalThis.html_ + '<button class="a-email" onclick="set_recipient(' + "'" +json["chats"][i]["id"] +"', '" + json["chats"][i]["primary_chat"] +  "', '" + globalThis.name + "')" + '"' + '">' + json["chats"][i]["name"] +'</button>';
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
m_c.style.height =  window.innerHeight - f - nav + "px";
m_c.style.top = nav;
document.getElementById("background-img").style.height =  window.innerHeight - nav + "px";
document.getElementById("form").style.display = "none";

function set_bg(num) {
        number_bg = num;
        document.getElementById("background-img").src = "/static/img/bg/bg" + number_bg + ".jpg";
    document.cookie = "bg="+ number_bg;
}


function gener_html(id_m, text, time) {
    new_mess = '<div class="alert alert-success my-message" id="m{{mess.id}}" role="alert" onclick="show_menu("' + id_m + '")"> <p id="text' + id_m + '">' + text + '</p>';
    new_mess += '<p class="time-mess">'+ time +'<button type="button" class="info-btn " data-bs-toggle="tooltip" data-bs-placement="top" title="прочитано">✓</button></p>';
    new_mess += '<div class="context-menu-open" id="{{mess.id}}" style="display:none;"><ul><li onclick="delete_mess('  + id_m + ')">Delete</li><li onclick="answer('  + id_m + ')">Answer</li><li onclick="edit('  + id_m + ')">edit</li></ul></div>';
    document.getElementById("content").innerHTML += new_mess;
          window.location.hash = "#";
          window.location.hash = "#pos";
        go()
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
            global_menu.style.display = "block";
            global_menu.innerHTML = '<h2>Управление чатом<button onclick="show_global_menu(' + "'global_menu'" + ', ' + id + ')" type="button" class="btn-close" aria-label="Close"></button></h2><br>';
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