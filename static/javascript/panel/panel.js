function delete_user(delete_id){
    var password = document.getElementById("password").value;
    $.ajax({
        url: '/panel/delete_user_by_id',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"user_id": delete_id, "password": password}),
        success: function(json_data){
            alert("успешно")
        },
        error: function(err) {
            alert("Наверное пароль не правильный")
            console.error(err);
        }
    });

}