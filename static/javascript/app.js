

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
var global_distans = 0;

function set_enter() {
    if(enter_flag) {
        globalThis.enter_flag = false;
    } else {
        globalThis.enter_flag = true;
        console.log(enter_flag)
    }
}
function showdiv1(Div){
var x = document.getElementById(Div);
    if(x.style.display=="none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function set_recipient(email) {
    globalThis.email_recipient = email;
    var x = document.getElementById("background-img");
    var y = document.getElementById("email");
    var button = document.getElementById("button");
    window.location.hash = "#";
    show();
    var scrollTop     = $(window).scrollTop(),
    elementOffset = $('#content').offset().top,
    distance      = (elementOffset - scrollTop);
          console.log(distance, $('#content').offset(), 1);

    globalThis.global_distans = distance;
    document.getElementById('email_recipient').innerText = email;
    document.getElementById('name_chat').innerText = email;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)){
    x.style.display = "block";
    x.src = "/static/img/bg/mob_bg2.jpg"
    var button = document.getElementById("button").style.visibility = 'visible';
    var cont = document.getElementById("container-mess");
    cont.style.display = "block";
    y.style.display = "none";

    }

}


document.addEventListener('keydown', function(event) {
    var x = document.querySelector('form');

    console.log(event.code);
    if (enter_flag) {
        if (event.keyCode == 13) {
        event.preventDefault();
        x.submit();
        var about = document.getElementById("about").value = "";
        show();
        }
    }else {
        if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
        event.preventDefault();
        x.submit();
  }
  }


});



function show()
    {
    if (email_recipient != "") {
      $.ajax({
    url: '/m/update/' + email_recipient,
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

          if (-400 < globalThis.global_distans - distance){
          window.location.hash = "#";
          }

//
          window.location.hash = "#pos";

        },
    error: function(err) {
        console.error(err);
    }
});}
    }
function create_chat(list_members, name)
    {
    if (email_recipient != "") {
      $.ajax({
    url: '/m/create_chat',
    type: 'GET',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name":name, "list_members": list_members}),
    success: function(json){
          // update chats list
        },
    error: function(err) {
        console.error(err);
    }
});}
    }

show();

setInterval(show, 10000);
const form = document.querySelector('form');
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent))
{ var x = document.getElementById("background-img");
var y = document.getElementById("container-mess");

x.style.display = "none";
console.log(button);
var button = document.getElementById("button").style.visibility = 'hidden';
y.style.display = "none";
}

function delete_mess(id_mess)
    {
    if (email_recipient != "") {
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
});}
    }


function answer(id_mess)
    {
    if (email_recipient != "") {
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
});}
    }


function show_menu(id_div){
var x = document.getElementById(id_div);
if(x.style.display=="none") {
        x.style.display = "block";

    } else {
        x.style.display = "none";
    }
}


function show_global_menu(id_div){
var x = document.getElementById(id_div);
if(x.style.display=="none") {
        x.style.display = "block";
        get_users();
    } else {
        x.style.display = "none";
    }
}


function get_users (){
$.ajax({
    url: '/m/get_users',
    type: 'GET',
    dataType: 'json',
    contentType:'application/json',
    success: function(json){
    console.log(json);
        var menu = getElementById("global-menu");
       for (let i = 0; i < json["users"]; i++){
       var menu = getElementById("global-menu");
       menu.innerHTML("<div>"+json["users"][i][0 + "</div>"])
       }
        },
    error: function(err) {
        console.error(err);
    }
});
}

