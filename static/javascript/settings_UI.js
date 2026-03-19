var enter_flag = true;
var answer_flag = false;
var edit_flag = false;
var edit_id = 0;
var global_distans = 0;
var menu_id = "";
var vis = true;
var position = 0;
var mobile = false;

if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)) && (auto == 1)){
        var x = document.getElementById("background-img");
        var y = document.getElementById("container-mess");
        x.style.display = "none";
        var button = document.getElementById("button").style.visibility = 'hidden';
        y.style.display = "none";
        globalThis.mobile = true;

}

var f = document.getElementById("form").offsetHeight;
var nav = document.getElementById("chat_header").offsetHeight;
var m_c =   document.getElementById("container-mess");
var email_cont = document.getElementById("email");
var icon_size = 40;
//m_c.style.height =  window.innerHeight - f - nav + "px";
m_c.style.top = nav;
//email_cont.style.top = nav;
//email_cont.style.height = window.innerHeight - f - nav + "px";
if (nav == 0){
    nav = 125;
    m_c.style.top = nav;
}
//document.getElementById("background-img").style.height =  window.innerHeight - nav + "px";
document.getElementById("background-img").style.top = nav + "px";
document.getElementById("form").style.display = "none";

// отрисовка под мобильный интерфейс
if (mobile){
    document.getElementById("chat_header").style.display = "none";
    document.getElementById("btn_settings_svg").setAttribute("width", "7vw");
    document.getElementById("svg_download_img_a").setAttribute("width", "7vw");
    document.getElementById("exit_chat_svg").setAttribute("height", "6vh");
//    document.getElementById("Capa_1").setAttribute("height", "9vw");
//    document.getElementById("Capa_1").setAttribute("width", "100vw");

    };

