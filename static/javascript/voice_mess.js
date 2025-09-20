navigator.mediaDevices.getUserMedia({ audio: true})
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        let voice = [];
        document.querySelector('#stop').addEventListener('click', function(){
            mediaRecorder.stop();
            document.getElementById("start").style.display = "block";
            document.getElementById("stop").style.display = "none";
        });

        document.querySelector('#start').addEventListener('click', function(){
            mediaRecorder.start();
            document.getElementById("stop").style.display = "block";
            document.getElementById("start").style.display = "none";
        });

        mediaRecorder.addEventListener("dataavailable",function(event) {
            voice.push(event.data);
        });



        mediaRecorder.addEventListener("stop", async function() {
    const voiceBlob = new Blob(voice, {
        type: 'audio/wav'
    });
    let form = new FormData();
form.append('voice', voiceBlob);
$.ajax({
      type: 'POST',
      url: '/m/send_voice/' + document.getElementById("chat_id").value,
      data: form,
      cache: false,
      processData: false,
      contentType: false
    }).done(function(data) {
      console.log(data);
    });
    });
    });
