

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
var email_recipient = "";
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
        console.log(enter_flag)
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
    },
    error: function(err) {
        console.error(err);
    }
});
}


function set_bg(num) {
        number_bg = num;
        document.getElementById("background-img").src = "/static/img/bg/bg" + number_bg + ".jpg";
    document.cookie = "bg="+ number_bg;
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
    var x = document.getElementById(Div);
    var w_img = document.getElementById("watch_img");
    w_img.src = "/static/img/" + name_img;
    if(x.style.display=="none") {
        x.style.display = "block";

    } else {
        x.style.display = "none";
    }
}


function set_recipient(id_chat, is_primary, name) {
    globalThis.email_recipient = id_chat;
    document.getElementById("chat_id").value = id_chat;
    if (is_primary) {
    $.ajax({
    url: '/m/get_chat_user/' + id_chat,
    type: 'GET',
    dataType: 'json',
    contentType:'application/json',
    success: function(json){
    t_id = 0;
    if (json["user"][0] != id){
        t_id = json["user"][0]
    } else{
        t_id = json["user"][1]
    }
    console.log(json["user"]);
    if (email_recipient != "") {
      $.ajax({
    url: '/m/get_user/' + t_id,
    type: 'GET',
    dataType: 'json',
    success: function(json){
    document.getElementById('name_chat').innerText = json["user"];
    },
    error: function(err) {
        console.error(err);
    }
    });
    }

        },
    error: function(err) {
        console.error(err);
    }
});
}else {
document.getElementById('name_chat').innerText = name;
}
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
globalThis.email_recipient = "";
document.getElementById("content").innerHTML = "";
document.getElementById('name_chat').innerText = "";
document.getElementById('chat_id').innerText = "";

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
    var x = document.querySelector('form');
    if (edit_flag){
    globalThis.edit_flag = false;
    var about = document.getElementById("about");
    edit_post(edit_id, about.value);
    about.value = "";
    document.getElementById('inputTag').value = "";
    } else {
    let b = x.submit();
    var rec = document.getElementById("chat_id").value;
    x.reset();
    document.getElementById("chat_id").value = rec;
    document.getElementById("imageName").innerHTML = "";
    show();
    }
}

document.addEventListener('keydown', function(event) {
    var x = document.querySelector('form');
    console.log(event.code);
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
        show();
        }
    }else {
        if ( (event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
         event.preventDefault();
            submit_form();
            show();
  }

  }


});



function show()
    {
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
console.log(email_recipient);
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
});
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
console.log(button);
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
        console.log(json["user"]["name"] )
        menu.innerHTML = '<h2>Редактировать профиль<button onclick="show_global_menu(' + "'global_menu'" + ', ' + id + ')" type="button" class="btn-close" aria-label="Close"></button></h2>';
        menu.innerHTML  += '<div class="edit-cont"><label>Имя</label><br><input id="name_edit" name="name_edit"value="'+ json["user"]["name"] + '"><br><label for="email_edit">Email</label><br><input name="email_edit" id="email_edit" value="'+ json["user"]["email"] + '"><br>'+'Для смены пародя введите старый пароль<input name="password_old" id="password_old"><br><label for="password_new">Новый пароль</label><br><input name="password_new" id="password_new"><br><button class="edit-btn" onclick="edit_prof_post()">Сохранить</button></div>';
        },
    error: function(err) {
        console.error(err);
    }
});
}


function delete_mess(id_mess)
    {
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
    data: JSON.stringify({"id_chat":email_recipient}),
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
    data: JSON.stringify({"id_chat":email_recipient}),
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
    console.log(json["users"].length);
    var html = '<h2>Создать чаты<button onclick="show_global_menu(' + "'global_menu'" + ', ' + id + ')" type="button" class="btn-close" aria-label="Close"></button></h2>';
       for (let i = 0; i < json["users"].length; i++){
       html = html + '<label class="add-menu">' + '<input  type="checkbox" onclick="add_chat(' + json["users"][i][2] + ')"' + '" >' + json["users"][i][0] + '</label><br>';
       }
       document.getElementById("global_menu").innerHTML = html;
       document.getElementById("global_menu").innerHTML += '<button onclick="create_group()" class="edit-btn">Create</button><label>Имя чата</label><br><input id="name_new_chat" style="display:none;"><input id="list_members" style="display:none;" value="">';
        },
    error: function(err) {
        console.error(err);
    }
});
}

function add_chat(new_mem){
    console.log(new_mem);
    var list_mem = document.getElementById("list_members");
    t_m = list_mem.value.split(" ")
    if (new_mem + "" in t_m){
            console.log("test");
    } else {
    list_mem.value += " " + new_mem;
    console.log(t_m);
    if (t_m.length > 2){
        document.getElementById("name_new_chat").style.display = 'block';
    }

    }

}
function create_group (){
    var list_members = document.getElementById("list_members").value;
    var is_primary = 1;
    if (list_members.length > 2){
        is_primary = 0
    }
    name = document.getElementById("name_new_chat").value;
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
        console.log(json["chats"].length);

           for (let i = 0; i < json["chats"].length; i++){
           if (json["chats"][i]["primary_chat"]){
           console.log("test");
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
        console.log(json2["user"]);
          $.ajax({
        url: '/m/get_user/' + t_id,
        type: 'GET',
        dataType: 'json',
        success: function(json3){
        globalThis.name = json3["user"];
        globalThis.html_ = globalThis.html_ + '<button class="a-email" onclick="set_recipient(' + "'" +json["chats"][i]["id"] +"', '" + json["chats"][i]["primary_chat"] +  "', '" + json3["user"] + "')" + '"' + '">' + json3["user"] +'</button>';
    //    globalThis.html_ = globalThis.html_ + '<button class="info-btn" onclick="show_global_menu(' + "'global_menu', {{current_user.id}})"+  '"><svg style="position:absolute; bottom:100px; left: 25vw;" width="40px" viewBox="-3.2 -3.2 38.40 38.40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-3.2" y="-3.2" width="38.40" height="38.40" rx="19.2" fill="#086faf" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>добавить чат</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-464.000000, -1087.000000)" fill="#ffffff"> <path d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z" id="plus-circle" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg></button>'
        document.getElementById("email").innerHTML = globalThis.html_;

        console.log(globalThis.name);
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
           }console.log(html_);
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
document.getElementById("background-img").style.height =  window.innerHeight - f - nav + "px";