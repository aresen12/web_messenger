class Chat{
    constructor(chat_id, status, name=""){
        this.chat_id = chat_id;
        this.status = status;
        this.name = name;
    }
}


class CurrentChat extends Chat{
    constructor(chat_id, status){
        super(chat_id, status);
        this.image_list = [];
        this.pinned_list = [];
        this.file_list = [];
    }
}