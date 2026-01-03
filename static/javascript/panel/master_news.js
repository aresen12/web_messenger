function delete_news(id_news){
     $.ajax({
        url: '/panel/delete_news_by_id',
        type: 'POST',
        dataType: 'json',
        contentType:'application/json',
        data: JSON.stringify({"id_news": id_news}),
        success: function(json_data){
            location.reload()
        },
        error: function(err) {
            alert("Наверное пароль не правильный")
            console.error(err);
        }
    });
}