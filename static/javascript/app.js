

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
    show();
    document.getElementById('email_recipient').innerText = email;
    document.getElementById('name_chat').innerText = email;
    x.style.display = "block";
    y.style.display = "none";

}


document.addEventListener('keydown', function(event) {
    var x = document.querySelector('form');
    console.log(event.code);
    if (enter_flag) {
        if (event.keyCode == 13) {
        event.preventDefault();
        x.submit();
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
          window.location.hash = "#";
          window.location.hash = "#pos";
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
var y = document.getElementById("mess-admin");
x.style.display = "none";
y.style.display = "none";
alert("Вы используете мобильное устройство (телефон или планшет).")
} else alert("Вы используете ПК.")

function delete_mess(id_mess)
    {
    if (email_recipient != "") {
      $.ajax({
    url: '/m/delete/' + email_recipient,
    type: 'DELETE',
    dataType: 'json',
    contentType:'application/json',
    data: {"id":id_mess},
    success: function(html){
          show();
        },
    error: function(err) {
        console.error(err);
    }
});}
    }
