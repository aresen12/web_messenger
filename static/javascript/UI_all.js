const emoji = ["💘", "❤️", "❤️‍🔥", "😭", "👌", "😨", "👍", "🍌", "🌭", "💋",
"🤯", "👏", "🍾", "👎", "🔥", "🥰", "😁", "🤔", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏",
"🕊️", "🤡", "🥱", "🥴", "😍", "🐳", "🌚", "💯", "😂", "⚡️", "🏆", "💔", "🤨", "😐", "🍓", "🖕",
 "😈", "😴", "🤓", "👻", "👨‍💻", "🙈", "👀", "😇", "🤝", "✍️", "🤗", "🫡", "🎅", "🎄", "⛄️", "💅",
"🤪", "🗿", "🆒", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷", "🤷‍♀️", "🤷‍♂️", "😡"];
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


function add_border(div1, div2, btn1, btn2){
    var x = document.getElementById(div1);
    var y = document.getElementById(div2);
    var btn1 = document.getElementById(btn1);
    var btn2 = document.getElementById(btn2);
    if(x.style.display=="none") {
        x.style.display = "block";
        btn2.style.borderBottom = "none";
        btn1.style.borderBottom = "3px solid #6495ED";
        y.style.display = "none";

    } else {
        x.style.display = "none";
        btn1.style.borderBottom = "3px solid #6495ED";
        btn2.style.borderBottom = "none";
        y.style.display = "block";
    }
}


function show_in_chat(mess_id){
    show_global_menu("global_menu_d", 1);
    answer_color("m"+ mess_id);
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


get_chats('email', "set_recipient");


function add_pinned(id_mess){
    const pin_div = document.getElementById("pinned");
                if (pin_div.innerHTML == ""){
                    btn = document.createElement("button");
                    btn.textContent += document.getElementById("text" + id_mess).textContent.trim()
                    btn.id = "pin_btn";
                    btn.classList = "info-btn pinned-btn";
                    btn.setAttribute("onclick", `go_pin('${id_mess}')`);
                    pin_div.appendChild(btn);
                    var btn_close = document.createElement("button");
                    btn_close.classList = "btn-close";
                    btn_close.setAttribute("aria-label", "Close");
                    btn_close.setAttribute("onclick", `un_pinned("${id_mess}")`);
                    btn_close.id = "close_pin";
                    document.getElementById("list_pin").value += " " + id_mess;
                    pin_div.appendChild(btn_close);
                } else {
                    document.getElementById("list_pin").value += " " + id_mess;
                }
}


function unset_emoji(id_message){
    delete_mess(id_message);
}


function gener_emoji(id_mess, html_m, other, id_emoji){
    var em_div = document.getElementById("em" + html_m);
    em_div.classList = "emoji"
    if (document.getElementById(html_m + "emoji_btn_id" + id_emoji)){
        var btn = document.getElementById(html_m + "emoji_btn_id" + id_emoji);
          if (btn.textContent.length  && Number(btn.textContent[1])){
              btn.textContent = emoji[id_emoji] + (Number(btn.textContent[1]) + 1);
          } else {
             btn.textContent = emoji[id_emoji] + "2";
          }
          if (!other){
            btn.style.background = "#6699cc";
            btn.setAttribute("onclick", `unset_emoji(${id_mess})`);
    }
    } else {
        var btn = document.createElement("button");
        btn.textContent = emoji[id_emoji];
        btn.classList = "info-btn";
        btn.id = html_m + "emoji_btn_id" + id_emoji;
        if (!other){
            btn.style.background = "#6699cc";
             btn.setAttribute("onclick", `unset_emoji(${id_mess})`);
        }
        em_div.appendChild(btn);
    }
}

document.addEventListener('click', (e) => {
    if (menu_id != ""){
        var div = document.querySelector('#' + menu_id.slice(1));
        var div2 = document.querySelector('#emoji' + menu_id.slice(1).slice(1));
       var t2 = e.composedPath().includes(div2);
        var t = e.composedPath().includes(div);
        if (!t && !t2){
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
    if (menu_id != "" && mobile != true && !t2){
        document.getElementById(menu_id).style.display = "none";
        globalThis.menu_id = "";
      };
})






var autoScroll = true;

document.getElementById('content').addEventListener('scroll', function() {
    var scrollTop = this.scrollTop;
    var scrollHeight = this.scrollHeight;
    var height = this.clientHeight;
});


function scrollToBottom(elementId) {
    var div = document.getElementById(elementId);
    div.scrollTop = div.scrollHeight;
}


function show_more_emoji(id_mess){
    const curr_m = document.getElementById("mm" + id_mess);
    document.getElementById("ul_on_menu" + id_mess).innerHTML = "";
    document.getElementById("emoji" + id_mess).innerHTML ="";
    const emoji_div2 = document.createElement("div");
    for (let i = 0; i < emoji.length; i++){
        var btn_emoji = document.createElement("button");
        btn_emoji.classList = "info-btn";
        btn_emoji.textContent = emoji[i];
        btn_emoji.setAttribute("onclick", `set_emoji(${id_mess}, ${i})`);
        emoji_div2.appendChild(btn_emoji);
    }
    curr_m.appendChild(emoji_div2);
}


function open_menu_mess(id_mess){
    var name_functions = ["answer", "send", "pinned", "delete_mess", "copyToClipboard"];
    var titles = ["ответить", "переслать", "закрепить", "удалить", "скопировать"];
    var ul = document.createElement("ul");
    ul.id = "ul_on_menu"  + id_mess.slice(1);

    if (globalThis.menu_id != ""){
        try{
        document.getElementById(menu_id).style.display = "none";
        } catch(err) {}
    };
    for (let i = 0; i < name_functions.length; i++){
        var li = document.createElement("li");
        li.textContent = titles[i];
        li.setAttribute("onclick", `${name_functions[i]}(${id_mess.slice(1)})`);
        ul.appendChild(li);
    }
    if (document.getElementById(id_mess).className == "my-message") {
        var li = document.createElement("li");
        li.textContent = "редактировать";
        li.setAttribute("onclick", `edit(${id_mess.slice(1)})`);
        ul.appendChild(li);
    }
    const emoji_div2 = document.createElement("div");
    emoji_div2.id = "emoji" + id_mess.slice(1);
    for (let i = 0; i < 4; i++){
        var btn_emoji = document.createElement("button");
        btn_emoji.classList = "info-btn";
        btn_emoji.textContent = emoji[i];
        btn_emoji.setAttribute("onclick", `set_emoji(${id_mess.slice(1)}, ${i})`);
        emoji_div2.appendChild(btn_emoji);
    }
    var btn_emoji = document.createElement("button");
        btn_emoji.classList = "info-btn";
        btn_emoji.textContent = "⋁";
        btn_emoji.setAttribute("onclick", `show_more_emoji(${id_mess.slice(1)})`);
        emoji_div2.appendChild(btn_emoji);
    //⋎∨⋁
    if (id_mess[0] == "e"){
        id_mess = id_mess.substring(1, id_mess.length);
    }
    const curr_m = document.getElementById("m" + id_mess);
    curr_m.innerHTML = "";
    curr_m.appendChild(emoji_div2);
    curr_m.appendChild(ul);
    globalThis.menu_id = "m" + id_mess;
    showdiv1("m" + id_mess);
    window.location.hash = "#m" + id_mess;
}


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
            var btn_close = document.getElementById("close_pin");
            if (i + 1 < list_pin.length){
                btn.textContent = document.getElementById('text' + list_pin[i + 1]).textContent;
                btn.setAttribute('onclick', `go_pin('${list_pin[i + 1]}')`);
                btn_close.setAttribute('onclick', `un_pinned('${list_pin[i + 1]}')`);
            } else {
                btn.textContent = document.getElementById('text' + list_pin[0]).textContent;
                btn.setAttribute('onclick', `go_pin('${list_pin[0]}')`);
                btn_close.setAttribute('onclick', `un_pinned('${list_pin[0]}')`);
            }
        }
    }

}


function set_bg_my(num) {
    document.getElementById("background-img").src = "/static/img/bg_users/" + num + ".jpg";
    document.cookie = "bg=5";
}



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
    document.getElementById("global_menu_d").style.display = "block";
    $.ajax({
        url: '/m/c_get_user',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json',
        success: function(json){
            menu.innerHTML = '<h2>Редактировать профиль</h2><button onclick="show_global_menu(' + "'global_menu_d'" + '\
            , ' + id_user + ')" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>';
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
}, 2000);
}


function set_username_tg(){
    var global_menu_d = document.getElementById("global_menu_d");
    global_menu_d.style.display = "block";
    var global_menu = document.getElementById("global_menu");
    global_menu.innerHTML = `<button onclick="show_global_menu('global_menu_d', 1)" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>`;
    var btn1 = document.createElement("button");
    btn1.textContent = "Добавить/изменить";
    btn1.setAttribute("onclick", "submit_username_tg()");
    btn1.classList = "edit-btn";
    var input_tg = document.createElement("input");
    input_tg.id = "tg_input";
    var h1_tg = document.createElement("label");
    h1_tg.textContent = "Напишите свой username в текстовое поле ниже, а затем напишите нашему тг боту @Kazbek_messenger_bot";
    global_menu.appendChild(h1_tg);
    global_menu.appendChild(input_tg);
    global_menu.appendChild(btn1);
}