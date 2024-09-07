

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


function set_recipient(email) {
    globalThis.email_recipient = email;
    show();
    document.getElementById('email_recipient').innerText = email;
    document.getElementById('name_chat').innerText = email;
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
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)) { alert("Вы используете мобильное устройство (телефон или планшет).")
} else alert("Вы используете ПК.")


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


function set_recipient(email) {
    globalThis.email_recipient = email;
    show();
    document.getElementById('email_recipient').innerText = email;
    document.getElementById('name_chat').innerText = email;
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
 function detectMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

alert(detectMobile());


function delete_mess()
    {
    if (email_recipient != "") {
      $.ajax({
    url: '/m/delete/' + email_recipient,
    type: 'DELETE',
    dataType: 'json',
    data:
    success: function(html){
          show();
        },
    error: function(err) {
        console.error(err);
    }
});}
    }
