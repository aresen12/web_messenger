let input = document.getElementById("inputTag");
        let imageName = document.getElementById("imageName")
        input.addEventListener("change", ()=>{
            let inputImage = document.querySelector("input[type=file]").files[0];
            try{
                imageName.innerText = inputImage.name;
            } catch {
                imageName.innerText = "картинка";
            }
        })