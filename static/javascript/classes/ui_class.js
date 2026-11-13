class UIdata{
    constructor(enter_flag=true){
        this.answer_flag = false;
        this.edit_flag = false;
        this.mobile = false;
        this.enter_flag = enter_flag;
        this.menu_id = "";
        this.check_mobile();
    }
    check_mobile(){
        if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i .test(navigator.userAgent)) && (auto == 1)){
            this.mobile = true;
            mobile_settings();
        }
    }

    set_enter(key) {
        if(key == 2) {
            document.cookie = "enter=2";
            this.enter_flag = false;
        } else {
            this.enter_flag = true;
            document.cookie = "enter=1";
        }
}
}


function mobile_settings() {
        var x = document.getElementById("background-img");
        var y = document.getElementById("container-mess");
        x.style.display = "none";
        var button = document.getElementById("button").style.visibility = 'hidden';
        y.style.display = "none";
}