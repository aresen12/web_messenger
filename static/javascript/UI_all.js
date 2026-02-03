const emoji = ["💘", "❤️", "❤️‍🔥", "😭", "👌", "😨", "👍", "🍌", "🌭", "💋",
"🤯", "👏", "🍾", "👎", "🔥", "🥰", "😁", "🤔", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏",
"🕊️", "🤡", "🥱", "🥴", "😍", "🐳", "🌚", "💯", "😂", "⚡️", "🏆", "💔", "🤨", "😐", "🍓", "🖕",
 "😈", "😴", "🤓", "👻", "👨‍💻", "🙈", "👀", "😇", "🤝", "✍️", "🤗", "🫡", "🎅", "🎄", "⛄️", "💅",
"🤪", "🗿", "🆒", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷", "🤷‍♀️", "🤷‍♂️", "😡"];


function gener_icon_chat(name_chat, chat_id, id_div, color){
    document.getElementById(id_div).style.width = icon_size + "px";
    if (!color){
        var color = random_colors[Math.floor(Math.random() * random_colors.length)];
    }
    const svg =
            d3.select("#" + id_div).
            append('svg').
            attr('height', `${icon_size}`).
            attr('width', `${icon_size}`)
            var circle = svg.append("circle") .attr("cx", icon_size / 2)
            .attr("cy", icon_size / 2) .attr("r", icon_size / 2)
             .attr("fill", color);
        var text = svg.append("text") .attr("x", circle.attr("cx") - 3) .attr("y", circle.attr("cy") - 3)
         .attr("dy", "0.35em") .text(name_chat[0]);
}



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


function add_border(div1, div2, btn1_id, btn2_id){
    var x = document.getElementById(div1);
    var y = document.getElementById(div2);
    if(x.style.display == "none") {
        x.style.display = "block";
        document.getElementById(btn2_id).style.borderBottom = "";
        document.getElementById(btn1_id).style.borderBottom = "3px solid #6495ED";
        y.style.display = "none";
    } else {
        x.style.display = "none";
        document.getElementById(btn1_id).style.borderBottom = "";
        document.getElementById(btn2_id).style.borderBottom = "3px solid #6495ED";
        y.style.display = "block";
    }
}


function show_in_chat(mess_id){
    close_global_menu();
    answer_color("m" + mess_id);
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


function scroll_carousel(number_img){
    var list_Img = document.getElementById("images_list").value.split(" ");
    console.log(list_Img);
    document.getElementById("watch_img").src = "/static/img/" + list_Img[number_img];
    var right_index = number_img + 1;
    var left_index = number_img - 1;
    if (left_index <= 0) {
        left_index = list_Img.length - 1;
    }
    if (right_index >= list_Img.length){
        right_index = 0;
    }
    document.getElementById("carousel_right").setAttribute("onclick", `scroll_carousel(${right_index})`);
    document.getElementById("carousel_left").setAttribute("onclick", `scroll_carousel(${left_index})`);
}


function showImg(Div, name_img){
    var x = document.getElementById("watch");
    var w_img = document.getElementById("watch_img");
    var download_a = document.getElementById("download-img-a");
    if(x.style.display == "none") {
        x.style.display = "block";
        w_img.src = "/static/img/" + name_img;
        download_a.href = "/static/img/" + name_img;
        download_a.download = name_img;
        var list_Img = document.getElementById("images_list").value.split(" ");
        var right_index = list_Img.indexOf(name_img) + 1;
        var left_index = list_Img.indexOf(name_img) - 1;
        if (left_index <= 0) {
            left_index = list_Img.length - 1;
        }
        if (right_index >= list_Img.length){
            right_index = 0;
        }
        document.getElementById("carousel_right").setAttribute("onclick", `scroll_carousel(${right_index})`);
        document.getElementById("carousel_left").setAttribute("onclick", `scroll_carousel(${left_index})`);
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
            exit_menu();
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
        exit_menu();
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
    document.getElementById("emoji" + id_mess).innerHTML = "";
    const emoji_div2 = document.createElement("div");
    for (let i = 0; i < emoji.length; i++){
        var btn_emoji = document.createElement("button");
        btn_emoji.classList = "info-btn emoji-button";
        btn_emoji.textContent = emoji[i];
        btn_emoji.setAttribute("onclick", `set_emoji(${id_mess}, ${i})`);
        emoji_div2.appendChild(btn_emoji);
    }
    curr_m.appendChild(emoji_div2);
}


function open_menu_in_chat(){
    document.getElementById("menu-chat").style.display = "block";
    var search_div = document.getElementById("search_text_div");
    if (search_div){
        search_div.style.display = "none";
        document.getElementById("search_text").value = "";
       document.getElementById("menu-chat-ul").style.display = "block";
    }
}


function open_menu_mess(id_mess){
    if (document.getElementById("watch").style.display == "block"){
        return 200;
    }
    var name_functions = ["answer", "send", "pinned", "delete_mess", "copyToClipboard"];
    var titles = ["ответить", "переслать", "закрепить", "удалить", "скопировать"];
    var ul = document.createElement("ul");
    ul.id = "ul_on_menu"  + id_mess.slice(1);
    const curr_m = document.getElementById("m" + id_mess);
    if (mobile && curr_m.style.display == "block") {
        return 200;
    }
    if (globalThis.menu_id != ""){
        try{
        exit_menu();
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
        btn_emoji.classList = "info-btn emoji-button";
        btn_emoji.textContent = emoji[i];
        btn_emoji.setAttribute("onclick", `set_emoji(${id_mess.slice(1)}, ${i})`);
        emoji_div2.appendChild(btn_emoji);
    }
    var btn_emoji = document.createElement("button");
        btn_emoji.classList = "info-btn emoji-button";
        btn_emoji.textContent = "⋁";
        btn_emoji.setAttribute("onclick", `show_more_emoji(${id_mess.slice(1)})`);
        emoji_div2.appendChild(btn_emoji);
    //⋎∨⋁
    if (id_mess[0] == "e"){
        id_mess = id_mess.substring(1, id_mess.length);
    }
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
            menu.innerHTML = '<h2>Редактировать профиль</h2><button onclick="close_global_menu()" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>';
            var p_group = document.createElement("div");
            p_group.id = "p_group";
            p_group.classList = "edit-cont";
            p_group.style.display = "none";
            var edit_cont = document.createElement('div');
            edit_cont.id = "edit_cont";
            edit_cont.classList = "edit-cont";
            var name_edit = document.createElement("input");
            name_edit.id = "name_edit";
            name_edit.value = json["user"]["name"];
            var name_p = document.createElement("p");
            name_p.textContent = "Имя";
            edit_cont.appendChild(name_p);
            edit_cont.appendChild(name_edit);
            var username_p = document.createElement("p");
            username_p.textContent = "Username";
            edit_cont.appendChild(username_p);
            var email_edit = document.createElement("input");
            email_edit.id = "email_edit";
            email_edit.value = json["user"]["email"];
            edit_cont.appendChild(email_edit);
            var save_btn = document.createElement("button");
            save_btn.classList = "edit-btn";
            save_btn.textContent = "Сохранить";
            save_btn.setAttribute('onclick', 'edit_prof_post()');
            var password_btn = document.createElement("button");
            password_btn.classList = "edit-btn";
            password_btn.textContent = "Сменить пароль";
            password_btn.setAttribute('onclick', `showDiv('p_group', 'edit_cont')`);
            edit_cont.appendChild(save_btn);
            edit_cont.appendChild(password_btn);
//            <button class= onclick=""></button>\
//            <button class="edit-btn" onclick=""></button>';
            p_group.innerHTML = 'Для смены пародя введите старый пароль<br><input name="password_old" id="password_old"\
             type="password"><br><label for="password_new">Новый пароль</label><br><input name="password_new"\
              id="password_new" type="password">';
            p_group.innerHTML += '<br><button class="edit-btn" onclick="post_password()">Сменить</button>';
            menu.appendChild(p_group);
            menu.appendChild(edit_cont);
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


function show_in_chat_search(){
    answer_color("m"+ mess_id);
}


function add_files_label(files_div){
    console.log(document.getElementById("chat_id").value);
    $.ajax({
        url: '/m/get_files_menu',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"chat_id": document.getElementById("chat_id").value}),
        success: function(json_data){
            console.log(json_data);
            if (json_data.length == 0){
                files_div.textContent = "Файлы не найдены";
            };
            for (let i = 0; i < json_data.length; i++){
                var file_label = document.createElement('li');
                file_label.textContent = json_data[i]["name"];
                file_label.classList = "list-group-item";
                file_label.setAttribute("onclick", `show_in_chat("${json_data[i]['mess_id']}")`);
                files_div.appendChild(file_label);
           }
                    },
                error: function(err) {
                    console.error(err);
                }
            });
}


function search_text(){
    var cont = document.getElementById("menu-chat");
    if (!document.getElementById("search_text_div")){
        var search_div = document.createElement("div");
        search_div.id = "search_text_div";
        var input = document.createElement("input");
        var btn = document.createElement("button");
        input.id = "search_text";
        btn.textContent = "поиск";
        btn.classList = "btn btn-primary";
        btn.setAttribute("onclick", "search_in_message()");
        search_div.appendChild(input);
        search_div.appendChild(btn);
        cont.appendChild(search_div);
    } else{
        document.getElementById("search_text_div").style.display = "block";
    }
    cont.style.display = "block";
    document.getElementById("menu-chat-ul").style.display = "none";
}


function go_to_message(id_mess){
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
    var list_pin = document.getElementById("list_search_id_message").value.trim().split(" ");
    for (let i = 0; i < list_pin.length; i++){
        if (list_pin[i] == id_mess){
            document.getElementById("cnt_search_m").textContent = `${i + 1} из (${list_pin.length})`;
            const btn_up = document.getElementById('btn_search_up');
            var btn_down = document.getElementById("btn_search_down");
            if (0 <= i - 1 && i + 1 < list_pin.length){
                btn_down.setAttribute('onclick', `go_to_message('${list_pin[i - 1]}')`);
                btn_up.setAttribute('onclick', `go_to_message('${list_pin[i + 1]}')`);
            } else if (0 > i - 1){
                   btn_up.setAttribute('onclick', `go_to_message('${list_pin[1]}')`);
                btn_down.setAttribute('onclick', `go_to_message('${list_pin[list_pin.length - 1]}')`);
            } else {
                btn_up.setAttribute('onclick', `go_to_message('${list_pin[0]}')`);
                btn_down.setAttribute('onclick', `go_to_message('${list_pin[0]}')`);
            }
        }
    }
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
    global_menu.innerHTML = `<button onclick="close_global_menu()" type="button" class="btn-close gl-btn-close" aria-label="Close"></button>`;
    var btn1 = document.createElement("button");
    btn1.textContent = "Добавить/изменить";
    btn1.setAttribute("onclick", "submit_username_tg()");
    btn1.classList = "edit-btn";
    var input_tg = document.createElement("input");
    input_tg.id = "tg_input";
    var h1_tg = document.createElement("p");
    h1_tg.classList = "emoji-button";
    h1_tg.textContent = "Напишите свой username в текстовое поле ниже, а затем напишите нашему тг боту @Kazbek_messenger_bot";
    global_menu.appendChild(h1_tg);
    global_menu.appendChild(input_tg);
    global_menu.appendChild(btn1);
}

function leave_chat(chat_id){
    socket.emit('leave', {room: chat_id});
        if (Number(chat_id)){
            document.getElementById("chat" + chat_id).style.background =  "white";
        } else {
            document.getElementById("my_chat" + id_user).style.background =  "white";
        }
}


function gener_chat(id_div, chat_id, name_chat, status, primary, command, last_mess, pinned){
    const cont = document.getElementById(id_div);
    get_read(chat_id);
    const btn = document.createElement('button');
    btn.id = 'chat'+ chat_id;
    btn.classList = "a-email";
    if (command == "set_recipient"){
        btn.setAttribute("onclick",`set_recipient('${chat_id}', ${primary}, '${name_chat}', ${status}, ${pinned})`);
    } else {
        btn.setAttribute("onclick",`send_of('${chat_id}', ${command}, '${name_chat}',  ${pinned})`);
    }
    let last_mess_div = document.createElement("div");
    let last_time = document.createElement("div");
    if (last_mess["time"] != "2023-01-01 00:00:00.0"){
        last_time.textContent = last_mess["time"].slice(11, 16);;
        last_time.classList = "time-in-chat";
    }
    if (pinned){
        var div_pinned = document.createElement('div');
        div_pinned.style.display = "inline-block"
        div_pinned.id = "chat_pinned" + chat_id;
        div_pinned.innerHTML += `<svg fill="#b3b3b3" width="${icon_size / 2.6}px" height="${icon_size / 2.6}px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="icon">
  <path d="M878.3 392.1L631.9 145.7c-6.5-6.5-15-9.7-23.5-9.7s-17 3.2-23.5 9.7L423.8 306.9c-12.2-1.4-24.5-2-36.8-2-73.2 0-146.4 24.1-206.5 72.3-15.4 12.3-16.6 35.4-2.7 49.4l181.7 181.7-215.4 215.2a15.8 15.8 0 0 0-4.6 9.8l-3.4 37.2c-.9 9.4 6.6 17.4 15.9 17.4.5 0 1 0 1.5-.1l37.2-3.4c3.7-.3 7.2-2 9.8-4.6l215.4-215.4 181.7 181.7c6.5 6.5 15 9.7 23.5 9.7 9.7 0 19.3-4.2 25.9-12.4 56.3-70.3 79.7-158.3 70.2-243.4l161.1-161.1c12.9-12.8 12.9-33.8 0-46.8z"/>
</svg>`;
        last_time.appendChild(div_pinned);
    }
    if (last_mess["type"] == 2){
        last_mess_div.textContent = emoji[last_mess["text"]];
    } else {
        if (primary){
            if (last_mess["text"] && last_mess["text"].length > 16){
                last_mess_div.textContent = last_mess["text"].slice(0, 16) + "...";
            } else {
                last_mess_div.textContent = last_mess["text"];
            }
    } else {
        if (last_mess["text"] && last_mess["text"].length > 12){
                last_mess_div.textContent = last_mess["name_sender"] + ": " + last_mess["text"].slice(0, 12) + "...";
            } else {
                last_mess_div.textContent = last_mess["name_sender"] + ": " + last_mess["text"];
            }
        }
    }
    last_mess_div.classList = "last-mess";
    const rn = document.createElement('div');
    rn.classList = "r-n";
    rn.id = 'rn' + chat_id;
    var icon_chat = document.createElement('div');
    icon_chat.id = "icon_chat" + command + chat_id;
    const name_chat_div = document.createElement('div');
    name_chat_div.id = "n_c" + chat_id;
    name_chat_div.textContent = name_chat;
    name_chat_div.classList = "n-c";
     name_chat_div.appendChild(last_time);
    name_chat_div.appendChild(last_mess_div);
    btn.appendChild(icon_chat);
    btn.appendChild(name_chat_div);
    btn.appendChild(rn);
    cont.appendChild(btn);
    gener_icon_chat(name_chat[0], chat_id, "icon_chat" + command + chat_id);
    $(`#chat${chat_id}`).on('contextmenu','div', function(e) { //Get li under ul and invoke on contextmenu
        e.preventDefault(); //Preventdefaults
        open_menu_chat(`${chat_id}`); //alert the id

        });
}


function gener_my_chat(id_div, command, last_mess, chat_id){
    const cont = document.getElementById(id_div);
    const btn = document.createElement('button');
    btn.id = 'my_chat' + id_user;
    btn.classList = "a-email";
    if (command == "set_recipient"){
        btn.setAttribute("onclick",`set_my_recipient('${chat_id}')`);
    } else {
        btn.setAttribute("onclick",`my_send_of('${chat_id}', ${command})`);
    }
    let last_mess_div = document.createElement("div");
    let last_time = document.createElement("div");
    if (last_mess["time"] != "2023-01-01 00:00:00.0"){
    last_time.textContent = last_mess["time"].slice(11, 16);;
    last_time.classList = "time-in-chat";
    }
    if (last_mess["type"] == 2){
        last_mess_div.textContent = emoji[last_mess["text"]];
    } else {
        if (last_mess["text"] && last_mess["text"].length > 12){
            last_mess_div.textContent = last_mess["name_sender"] + ": " + last_mess["text"].slice(0, 12) + "...";
        } else {
            last_mess_div.textContent = last_mess["name_sender"] + ": " + last_mess["text"];
        }
    }
    last_mess_div.classList = "last-mess";
    const icon_chat = document.createElement('div');
    icon_chat.id = "icon_chat" + command + chat_id;
    const name_chat_div = document.createElement('div');
    name_chat_div.id = "n_c" + chat_id;
    name_chat_div.textContent = "Избранное";
    name_chat_div.classList = "n-c";
     name_chat_div.appendChild(last_time);
    name_chat_div.appendChild(last_mess_div);
    btn.appendChild(icon_chat);
    btn.appendChild(name_chat_div);
    cont.appendChild(btn);
    gener_icon_chat("И", chat_id, "icon_chat" + command + chat_id, "#7b68ee")
     $(`#my_chat${id_user}`).on('contextmenu','div', function(e) { //Get li under ul and invoke on contextmenu
        alert("Для избранного в разработке!")
        e.preventDefault(); //Preventdefaults
//        open_menu_chat(`${chat_id}`); //alert the id
        });
}


function open_menu_chat(chat_id){
    exit_menu();
    globalThis.menu_id = "menu_chat" + chat_id;
    if (document.getElementById("menu_chat" + chat_id)){
        document.getElementById("menu_chat" + chat_id).style.display = "block";
    }else {
        var div = document.createElement("ul");
        var btn = document.createElement("li")
        div.classList = "context-menu-open";
        div.id = "menu_chat" + chat_id;
        div.style.display = "block";
        if (!document.getElementById("chat_pinned" + chat_id)){
            btn.textContent = "Закрепить";
            btn.setAttribute("onclick", `pin_chat(${chat_id})`);
        } else {
            btn.textContent = "открепить";
            btn.setAttribute("onclick", `unpin_chat(${chat_id})`);
        }
        div.appendChild(btn)
        document.getElementById("n_c" + chat_id).appendChild(div)
    }
}