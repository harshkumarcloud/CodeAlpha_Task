let prompt=document.querySelector("#prompt");
let submitbutton=document.querySelector("#submit");
let chatContainer=document.querySelector(".chat-container");
let imagebutton=document.querySelector("#image");
let image=document.querySelector("#image img");
let imageinput=document.querySelector("#image input")


const Api_Url="" //use your own api url

let user={
    message:null,
    file:{
        mime_type: null,
          data: null
    }
}

async function generateResponse(aiChatBox){
 
    
    let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method: "POST",
        header: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
    "contents": [
      {
        "parts": [
          {
            "text": user.message
          },
          (user.file.data?[
            {
                "inline_data":user.file
            }
          ]:[]
        )
        ]
      }
    ]
        })
    }

    try{
        let response= await fetch(Api_Url, RequestOption)
        let data=await response.json()
        //console.log(data);
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
        //console.log(apiResponse);
        text.innerHTML=apiResponse
        
    }
    
    
    catch(error){
        console.log(error);
    }


    finally{
        chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    })
    image.src=`img.svg`
            image.classList.remove("choose")
    }
    user.file={}
    
}

function createChatBox(html, classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}

function handlechatResponse(userMessage){
    user.message=userMessage
    let html=`<img src="user.png" alt="" id="userImage" width="60px">
    <div class="user-chat-area">
        ${user.message}
        ${
            user.file.data?`<img src="data:${
                user.file.mime_type
            };base64,${
                user.file.data
            }"class="choosing" />` : ""
        }
    </div>`
    prompt.value=""; //clear the input field send by the user
    let userChatBox=createChatBox(html, "user-chat-box")
    chatContainer.appendChild(userChatBox)

    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    }) 

    setTimeout(()=>{

        let html= `<img src="ai.png" alt="" id="aiImage" width="60px">
    <div class="ai-chat-area">
    <img src="loading.gif" alt="" class="load" width="50px">
    </div>`
    let aiChatBox=createChatBox(html, "ai-chat-box")
    chatContainer.appendChild(aiChatBox)
    generateResponse(aiChatBox)

    },400)
}



prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        handlechatResponse(prompt.value);
        
    }    
})

submitbutton.addEventListener("click", ()=>{
    handlechatResponse(prompt.value);
})

imageinput.addEventListener("change", ()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        //console.log(e)
        let base64String=e.target.result.split(",")[1]
            user.file={
                mime_type: file.type,
                data: base64String
            }
    }
    image.src=`data:${
                user.file.mime_type
            };base64,${
                user.file.data
            }`
            image.classList.add("choose")
    reader.readAsDataURL(file)
})


imagebutton.addEventListener("click", ()=>{
    imagebutton.querySelector("input").click()
})