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
    go();
}


function open_menu_mess(id_mess){
    if (globalThis.menu_id != ""){
        document.getElementById(menu_id).style.display = "none";
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
    show_menu("m" + id_mess);
}