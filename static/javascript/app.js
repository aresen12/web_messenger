var enter_flag = true;
var answer_flag = false;
var edit_flag = false;
var edit_id = 0;
var global_distans = 0;
var menu_id = "";
var mobile = false;
var vis = true;
var position = 0;

random_colors = ["#59a83d", "#6495ed", "#fab700", "#ffb28b", "#b37fb3"]


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)){
    var x = document.getElementById("background-img");
    var y = document.getElementById("container-mess");
    x.style.display = "none";
    var button = document.getElementById("button").style.visibility = 'hidden';
    y.style.display = "none";
    globalThis.mobile = true;
};


function getCookie(name) {
  let cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
}

// 1 - send by enter 2 - send by ctrl + enter

function set_enter(key) {
    if(key == 2) {
        document.cookie = "enter=2";
        globalThis.enter_flag = false;
    } else {
        globalThis.enter_flag = true;
        document.cookie = "enter=1";
    }
}


function edit (id_mess){
    globalThis.edit_flag = true;
    globalThis.edit_id = id_mess;
    var t = document.getElementById("text" + id_mess).textContent.trim();
    document.getElementById("about").value = t;
    var la = document.getElementById("edit-label");
    la.innerHTML = t;
    la.innerHTML += '<button type="button" onclick="close_edit()" class="btn-close edit-btn-close" aria-label="Close">\
    </button>'
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
    socket.emit("edit_mess", {new_text: text, id_m: id_mess, room: document.getElementById("chat_id").value});
        close_edit();
    },
    error: function(err) {
        console.error(err);
    }
});
}


function sing_out_of_chat(){
    $.ajax({
    url: '/m/sing_out_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"chat_id": document.getElementById("chat_id").value}),
    success: function(json){
        get_chats('email');
        exit_chat();
    },
    error: function(err) {
        console.error(err);
    }
});
}


function set_recipient(id_chat, is_primary, name, status) {
    var st_chat = document.getElementById("chat_id").value
    if (st_chat){
        socket.emit('leave', {room: st_chat});
    }
    try{
        document.getElementById("chat"+ id_chat).style.background =  "#6699cc";
    } catch (error) {
        setTimeout(function() {
        var chat2 = document.getElementById("chat"+ id_chat);
        chat2.style.background =  "#f1f1f1";

        document.getElementById('name_chat').textContent = chat2.innerText;
            }, 3000);
}
    if (st_chat){
    document.getElementById("chat"+ st_chat).style.background =  "white";
    }
    document.getElementById("content").innerHTML = '<h2 class="update">Загрузка...<h2>';
    if (status == 1){
        document.getElementById("form").style.display = "block";
    }else{
        document.getElementById("form").style.display = "none";
    }
    var menu = document.getElementById("menu-chat-ul");
    menu.innerHTML = '<li onclick="block_user()">Заблокировать</li><li onclick="delete_chat()">Удалить чат</li><li onclick="search_text()">Поиск</li>';
    if (is_primary){
        menu.innerHTML += '<li onclick="sing_out_of_chat()">Покинуть чат</li>';
    };
    document.getElementById("chat_id").value = id_chat;
    document.getElementById('name_chat').textContent = name;
    document.getElementById("icon_c_chat").innerHTML = document.getElementById("icon_chat" + id_chat).innerHTML;
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
    if (mobile){
        document.getElementById("chat_header").style.display = "flex";
        x.style.display = "block";
        var button = document.getElementById("button").style.visibility = 'visible';
        var cont = document.getElementById("container-mess");
        cont.style.display = "block";
        y.style.display = "none";
        document.getElementById("settings_btn").style.display = 'none';
        document.getElementById("btn_down").style.visibility = 'visible';
    }
    socket.emit('join', {room: id_chat});
}


function exit_chat(){
    var st_chat = document.getElementById("chat_id").value;
    socket.emit('leave', {room: st_chat});
    if (st_chat){
        document.getElementById("chat"+ st_chat).style.background =  "white";
    };
    document.getElementById('icon_c_chat').innerHTML = "";
    document.getElementById("content").innerHTML = "";
    document.getElementById('name_chat').innerText = "";
    document.getElementById('chat_id').value = "";
    document.getElementById('form').style.display = "none";
    document.getElementById('menu-chat-ul').innerHTML = '';
    document.getElementById("btn_down").style.visibility = 'hidden';
    if (globalThis.mobile) {
        document.getElementById("background-img").style.display = "none";
        document.getElementById("container-mess").style.display = "none";
        document.getElementById("settings_btn").style.display = 'block';
        document.getElementById("button").style.visibility = 'hidden';
        document.getElementById("email").style.display = "block";

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
            send_io_mess();
            close_edit();
    }else {
        var b = x.submit();
    }
     x.reset();
   document.getElementById("imageName").innerHTML = "";
    }

}


document.querySelector('.form2').addEventListener('submit', function(e) {
      e.preventDefault();
      go();
})
document.querySelector('#bg_form').addEventListener('submit', function(e) {
  event.preventDefault(); // Отмена стандартного поведения формы
  const fileInput = document.getElementById('input');
  const file = fileInput.files[0];
  if (file) {
  document.getElementById("progressBar").style.display = "block";
    uploadFile(file); // Передаем файл в функцию для загрузки
  } else {
    alert('Пожалуйста, выберите файл.');
  }


})

document.addEventListener('keydown', function(event) {
    var x = document.querySelector('form');
    var about = document.getElementById("about");
    if (enter_flag && !mobile) {
        if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
        globalThis.position = about.selectionStart + 1;
        about.value = about.value + "\n";
        go();
        // add len text
        };
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
            gener_html(c_m["id"], c_m["text"], time[1].split(".")[0], c_m["html_m"], file, other, c_m['read'], c_m["name_sender"], c_m["pinned"]);
        }
        cont.innerHTML += '<div id="pos"><div id="pos2"></div></div>';
        go()
        },
    error: function(err) {
        console.error(err);
    }
});}
    }


function notification (text, chat_name) {
    (async () => {
              try {
                const permission = await Notification.requestPermission();
                if (Notification.permission === 'denied') {
                }

                const options = {
                  body: text,
                  icon:
                    "https://raw.githubusercontent.com/aresen12/web_messenger/refs/heads/master/static/img/icon.ico"
                };
                new Notification(chat_name, options);
              } catch (error) {
                console.log(error);
              }
            })();
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
          get_chats('email');
          document.getElementById("global_menu_d").style.display = 'none';
          set_recipient(json["chat_id"], json["is_primary"], json["name"], 1);
        },
    error: function(err) {
        console.error(err);
    }
});
    }


function send(id){
    get_chats_gl("global_menu", id);
    document.getElementById("global_menu_d").style.display = "block";
}



function post_password() {
    var password_old = document.getElementById("password_old");
    var new_password = document.getElementById("password_new");
    if (password_old.value.trim() != "" && new_password.value.trim() != "") {
        let is_edit = confirm("Вы действительно хотите сменить пароль?");
        if (is_edit){
        $.ajax({
            url: '/m/edit_password',
            type: 'POST',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"new_password": new_password.value, "old_password": password_old.value}),
            success: function(html){
                  document.getElementById("global_menu_d").style.display = "none";
                },
            error: function(err) {
                console.error(err);
            }
            });
    }
}
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
let is_edit = confirm("Вы действительно хотите отредактировать профиль?");
if (is_edit){
document.getElementById("global_menu_d").style.display = "none";
$.ajax({
    url: '/m/edit_prof',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name": document.getElementById("name_edit").value,
     "email": document.getElementById("email_edit").value}),
    success: function(html){
          get_chats('email');
        },
    error: function(err) {
        console.error(err);
    }
});
}
}



function delete_chat() {
    showdiv1('menu-chat');
    let is_del = confirm("Вы действительно хотите удалить этот чат?");
    if (is_del){
        $.ajax({
            url: '/m/delete_chat',
            type: 'DELETE',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"id_chat": document.getElementById("chat_id").value}),
            success: function(html){
                  get_chats('email');
                  exit_chat();
                },
            error: function(err) {
                console.error(err);
            }
        });
    }
}


function block_user() {
    showdiv1('menu-chat');
    let is_block = confirm("Вы действительно хотите заблокировать чат?");
    if (is_block){
        $.ajax({
            url: '/m/block_chat',
            type: 'POST',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"id_chat": document.getElementById("chat_id").value}),
            success: function(html){
                  get_chats("email");
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
     if (t == ""){
        t = "файл";
    };
    la.innerHTML = t;
    la.innerHTML += '<button type="button" onclick="close_edit()" class="btn-close edit-btn-close" aria-label="Close"></button>'
    la.style.display = "block";
    document.getElementById("html_m").value = '<button class="answer-a" onclick="answer_color(' + "'" + 'm' + id_mess +"'"+ ')">' + t + '</button>';
}


function show_global_menu(id_div, id){
    var x = document.getElementById(id_div);
    if(x.style.display=="none" || x.style.display=="") {
        x.style.display = "block";
        document.getElementById("how_create").style.display = "none";
        get_users(id);
    } else {
        x.style.display = "none";
    }
}


function show_create_primary_chat(id){
    var x = document.getElementById('global_menu_d');
    x.style.display = "block";
    document.getElementById("how_create").style.display = "none";
    get_users_primary(id);
}


function get_users (id){
    $.ajax({
        url: '/m/get_users',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
        document.getElementById("global_menu").innerHTML="";
        var html = '<h2>Создать чаты</h2><button onclick="show_global_menu(' + "'global_menu_d'" + ', ' + id + ')" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>';
        for (let i = 0; i < json["users"].length; i++){
            if (json["c_user"] != json["users"][i][2]){
               html = html + '<label class="add-menu">' + '<input type="checkbox" onclick="add_chat(' + json["users"][i][2]+ ", 'list_members'" + ')">' + json["users"][i][0] + '</label><br>';
            }
        }
        var menu = document.getElementById("global_menu");
        menu.innerHTML = html;
        menu.innerHTML += '<button onclick="create_group()" class="edit-btn">Create</button><br><div class="add-menu" id="name_new_chat_group"><label>Имя чата</label><br><input id="name_new_chat"></div>';
        menu.innerHTML += '<input id="list_members" style="display:none;" value="' + json["c_user"] + '">';
            },
        error: function(err) {
            console.error(err);
        }
    });
}


function get_users_primary (id){
    $.ajax({
        url: '/m/get_users',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
        document.getElementById("global_menu").innerHTML="";
        var html = '<h2>Создать чат с пользователем</h2><button onclick="' + "show_global_menu('global_menu_d',  0)" +'" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>';
        for (let i = 0; i < json["users"].length; i++){
            if (json["c_user"] != json["users"][i][2]){
               html = html + '<label class="add-menu" onclick="create_chat('+ "'"+ json["users"][i][2] + ' ' + json["c_user"] + "', '', 1" + ')">' + json["users"][i][0] + '</label><br>';
            }
        }
        var menu = document.getElementById("global_menu");
        menu.innerHTML = html;
            },
        error: function(err) {
            console.error(err);
        }
    });
}



function edit_name_chat(){
    $.ajax({
        url: '/m/edit_name_chat',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": document.getElementById('chat_id').value, "new_name": document.getElementById('new_chat_name').value}),
        success: function(html){
              get_chats('email');
            },
        error: function(err) {
            console.error(err);
        }
    });

}


function add_chat(new_mem, name_id){
    var list_mem = document.getElementById(name_id);
    list_mem.value = list_mem.value.trim();
    t_m = list_mem.value.split(" ");
    var delete_fl = true;
    for (i=0; i <= t_m.length; i++){
            if (new_mem == t_m[i]){
                t_m.splice(i, i + 1);
                list_members.value = t_m.join(" ");
                delete_fl = false;
            };
        };
    if (delete_fl) {
        list_mem.value += " " + new_mem;
    }
}

function create_group (){
    var name = document.getElementById("name_new_chat").value;
    var list_members = document.getElementById("list_members").value;
    if (list_members.trim() == ""){
    return "";
    }
    var is_primary = 0;
    if (name.trim() == ""){
        document.getElementById("name_new_chat").value = "Добавьте имя!!!";
        return "";
    }
//    create_chat(name, list_members, is_primary);
      $.ajax({
    url: '/m/create_chat',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name":name, "list_members": list_members, "primary":is_primary}),
    success: function(json){
          // update chats list
          get_chats('email');
          document.getElementById("global_menu_d").style.display = 'none';
          set_recipient(json["chat_id"], json["is_primary"], json["name"], 1);
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


function get_read(chat_id){
    $.ajax({
        url: '/m/get_not_read',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id":chat_id}),
        success: function(json){
            if (json["r"]){
                document.getElementById("rn" + chat_id).innerHTML = json["r"];
            }
            },
        error: function(err) {
            console.error(err);
        }
    });

}


function send_of(chat_id, id_m, name_chat){
    $.ajax({
        url: '/m/mail',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"mail_id_chat":chat_id, "mess_id":id_m}),
        success: function(json){
            document.getElementById("global_menu_d").style.display = "none";
            set_recipient(chat_id, 0, name_chat,  1)
            },
        error: function(err) {
            console.error(err);
        }
    });


}


function get_chats (id_div){
    $.ajax({
        url: '/m/get_chats',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){

            if (json["chats"].length == 0){
                document.getElementById(id_div).innerHTML = '<h2>Для того чтобы создать чат нажмите на синий плюс.</h2>'
                return 0
            } else {
                document.getElementById(id_div).innerHTML = "";
            }
           for (let i = 0; i < json["chats"].length; i++){
           if (json["chats"][i]["primary_chat"]){
             $.ajax({
                url: '/m/get_chat_user/' + json["chats"][i]["id"],
                type: 'GET',
                dataType: 'json',
                contentType:'application/json',
                success: function(json2){
                t_id = 0;
                if (json2["user"][0] != id_user){
                    t_id = json2["user"][0]
                } else{
                    t_id = json2["user"][1]
                }
                $.ajax({
                    url: '/m/get_user/' + t_id,
                    type: 'GET',
                    dataType: 'json',
                    success: function(json3){
                        gener_chat(id_div, json["chats"][i]["id"], json3["user"], json["chats"][i]["status"], json["chats"][i]["primary_chat"])
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
                gener_chat(id_div, json["chats"][i]["id"], json["chats"][i]["name"], json["chats"][i]["status"], json["chats"][i]["primary_chat"]);
           }
           }
            },
        error: function(err) {
            console.error(err);
        }
});
}


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
    if (mobile){
        icon_size = 80;
    }
    icon_chat.style.width = icon_size + "px";
    const svg =
            d3.select("#icon_chat" + chat_id).
            append('svg').
            attr('height', `${icon_size}`).
            attr('width', `${icon_size}`)
            var circle = svg.append("circle") .attr("cx", icon_size / 2) .attr("cy", icon_size / 2) .attr("r", icon_size / 2) .attr("fill", random_colors[Math.floor(Math.random() * random_colors.length)]);
var text = svg.append("text") .attr("x", circle.attr("cx") - 3) .attr("y", circle.attr("cy") - 3) .attr("dy", "0.35em") .text(name_chat[0]);

}



function get_chats_gl (id_div, id_m){
    html_ = "";
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
                            document.getElementById(id_div).innerHTML += '<button " class="a-email" onclick="send_of(' + "'" +json["chats"][i]["id"] + "', " + id_m   + ", '" + json3["user"] + "'" +  ')"' + '">' + json3["user"] +'<div class="r-n"\
                             id="rn' + json["chats"][i]["id"] + '"></div></button>';
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
       } else {
                html_ += '<button class="a-email" onclick="send_of(' + "'" +json["chats"][i]["id"] +"', " + id_m + ", '" + json["chats"][i]["name"] + "'" + ')">' + json["chats"][i]["name"] +'<div class="r-n" id="rn' + json["chats"][i]["id"] + '"></div></button>';
           }
           }
           document.getElementById(id_div).innerHTML = html_;
                document.getElementById(id_div).innerHTML += '<button onclick="show_global_menu(' + "'global_menu_d'" + ', 0)" type="button"\
                    class="btn-close gl-btn-close" aria-label="Close"></button>'
            },
        error: function(err) {
            console.error(err);
        }
});
}


// отрисовка интерфейса
function add_in_chat_new(){
    var global_menu = document.getElementById("global_menu");
    document.getElementById("users").style.display = "none";
    global_menu.innerHTML += '<div id="add_new_users"></div>';
    var add_new_users = document.getElementById("add_new_users");
    add_new_users.innerHTML = '<input style="display:none;" id="list_of_new_u">';
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
                add_new_users.innerHTML += '<label class="add-menu">' + '<input type="checkbox" onclick="add_chat(' + json["users"][i][2]+ ", 'list_of_new_u'" + ')">' + json["users"][i][0] + '</label><br>';
            }
            }
            add_new_users.innerHTML += '<button onclick="submit_new_users()" class="edit-btn">Добавить</button>'
        },
    error: function(err) {
        console.error(err);
    }
});
}


function add_users_label(users, con_users){
    for (let i = 0; i < users.length; i++){
             $.ajax({
                url: '/m/get_user/' + users[i],
                type: 'GET',
                dataType: 'json',
                contentType:'application/json',
                success: function(json_data){
                    con_users.innerHTML += '<label class="add-menu">'+ json_data["user"]+ '(' +json_data["email"] + ')' + '</label><br>';
                    },
                error: function(err) {
                    console.error(err);
                }
            });
            };
}


function add_files_label(files_div){
    $.ajax({
        url: '/m/get_files_menu',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": document.getElementById("chat_id").value}),
        success: function(json_data){
            if (json_data.length == 0){
                files_div.textContent = "Файлы не найдены";
            };
            for (let i = 0; i < json_data.length; i++){
                var file_label = document.createElement('button');
                file_label.textContent = json_data[i]["name"];
                file_label.classList = "add-menu";
                file_label.setAttribute("onclick", `show_in_chat("${json_data[i]['mess_id']}")`)
//                file_label.href = '/static/img' + json_data[i]["src"]
                files_div.appendChild(file_label);
                files_div.appendChild(document.createElement("br"));
           }
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
            global_menu.innerHTML = '<h2>Управление чатом</h2><button onclick="show_global_menu(' + "'global_menu_d'" + ', ' + id_user   + ')" type="button" class="btn-close gl-btn-close" aria-label="Close"></button><br>';
            const users_div = document.createElement("div");
            users_div.id = "users";
            const con_users = document.createElement("div");
            con_users.id = "con_users";
            const user_btn = document.createElement('button');
            user_btn.textContent = "Участники";
            user_btn.id = "border_btn1";
            user_btn.style.borderBottom = "3px solid #6495ED";
            user_btn.setAttribute("onclick", 'add_border("users", "files",  "border_btn1",  "border_btn2")');
            user_btn.classList = "info-btn";
            const file_btn = document.createElement('button');
            file_btn.textContent = "файлы";
            file_btn.id = "border_btn2";
            file_btn.setAttribute("onclick", 'add_border("users", "files",  "border_btn1",  "border_btn2")');
            file_btn.classList = "info-btn";
            users_div.appendChild(con_users);
            global_menu.appendChild(user_btn);
            global_menu.appendChild(file_btn);
            global_menu.appendChild(users_div);
            files_div = document.createElement("div");
            files_div.id = "files";
            files_div.style.display = 'none';
            global_menu.appendChild(files_div);
            add_users_label(json["user"], con_users);
            add_files_label(files_div);
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

function copyToClipboard(id_m) {
var t = document.getElementById("text" + id_m).textContent.trim();
    navigator.clipboard.writeText(t);


  }


$('#content').on('contextmenu','div', function(e) { //Get li under ul and invoke on contextmenu
        e.preventDefault(); //Prevent defaults
        open_menu_mess(this.id); //alert the id
        });

window.onfocus = function() {
    globalThis.vis = true;
    if (document.getElementById("chat_id") && document.getElementById("chat_id").value != ""){
    set_read(document.getElementById("chat_id").value);
    }
};

window.onblur = function() {
    globalThis.vis = false;
};

function injectEmojisToList(e) {
        document.getElementById("about").value += e.innerHTML;
        globalThis.position = document.getElementById("about").selectionStart;
        go();
    }


function send_img(){
    submit_form();
    document.getElementById("send2_btn").style.display = "none";
    document.getElementById("watch").style.display = "none";

}

function set_read(chat_id){
    $.ajax({
        url: '/m/set_read',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id":chat_id}),
        success: function(json){

            },
        error: function(err) {
            console.error(err);
        }
    });
}


$( '#about' ).focus(function() { if (mobile) {}});
$( '#about' ).blur(function() {});
function pinned(id_mess){
    chat_id = document.getElementById("chat_id").value;
    $.ajax({
        url: '/m/pinned',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id":chat_id, "mess_id": id_mess}),
        success: function(json){
                add_pinned(id_mess);
            },
        error: function(err) {
            console.error(err);
        }
    });
}

            // Connect to SocketIO server
const socket = io();

            // Handle form submission
function send_io_mess() {
                const input = document.getElementById('about');
                const chat_id = document.getElementById('chat_id').value;
                const message = input.value;
                const html2 = document.getElementById('html_m');
                const html_m = html2.value;
                if (message) {
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
                gener_html(data["id_m"], data["message"], data["time"], data["html"], data["file2"], other, data["read"], data["name"], data["pinned"])
//                const messageItem = document.createElement('div');
//                messageItem.textContent = message;
//                messagesDiv.appendChild(messageItem);
                // Auto-scroll to the bottom

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
    alert("disconnect");
});




document.addEventListener('DOMContentLoaded', () => {
 (async () => {
    try {
        await Notification.requestPermission();
    } catch (error){
        console.log(error);
   }
   })
});
