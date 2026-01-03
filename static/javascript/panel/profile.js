function post_password() {
    var password_old = document.getElementById("password_old");
    var new_password = document.getElementById("password_new");
    if (password_old.value.trim() != "" && new_password.value.trim() != "") {
        let is_edit = confirm("Вы действительно хотите сменить пароль?");
        if (is_edit){
        $.ajax({
            url: '/panel/edit_password',
            type: 'POST',
            dataType: 'json',
            contentType:'application/json',
            data: JSON.stringify({"new_password": new_password.value, "old_password": password_old.value}),
            success: function(html){

                },
            error: function(err) {
                console.error(err);
            }
            });
    }
}
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


function edit_prof_post() {
let is_edit = confirm("Вы действительно хотите отредактировать профиль?");
if (is_edit){
$.ajax({
    url: '/panel/edit_prof',
    type: 'POST',
    dataType: 'json',
    contentType:'application/json',
    data: JSON.stringify({"name": document.getElementById("name_edit").value}),
    success: function(html){
        alert("Успешно!")
        },
    error: function(err) {
        console.error(err);
    }
});
}
}
