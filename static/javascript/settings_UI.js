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

