(()=>{"use strict";class e{constructor(e){this.root=e}createmodalNickname(){this.root.insertAdjacentHTML("beforeEnd",'<div data-widget="modalNickname" class="container">\n            <h2 class="modal__header">Выберите псевдоним</h2>  \n            <form id = "form" data-id="addTicket-form">\n                <input rows=1 data-id="name" name="name" required class="form__input"></input>\n                <button type="submit" data-id="ok" class="form__btn">Продолжить</button>    \n            </form>\n        </div>')}createmodalChat(){this.root.insertAdjacentHTML("beforeEnd",'<div data-widget="modalChat" class="container">\n        <div class="modalChat__body">\n            <div class="modalChat__user">\n                <div class="modal__header">Пользователи</div>\n            </div>\n            <div class="modalChat__chat">\n                <div class="modal__header">Окно чата</div>\n            </div>\n        </div>  \n        <form id = "form" data-id="addMessage">\n            <input rows=1 data-id="message" name="message" class="form__input" placeholder="Type your message here"></input>\n            <button type="submit" data-id="ok" class="form__btn">Отправить</button>    \n        </form>\n    </div>')}}const t=document.getElementById("root");new class{constructor(t){this.container=t,this.ModalForm=new e(t),this.you=""}init(){this.ModalForm.createmodalNickname(),this.ws=new WebSocket("wss://chat-test-2-0.onrender.com"),this.modalNickname=document.querySelector('[data-widget="modalNickname"]'),this.formNickname=this.modalNickname.querySelector("form"),this.inputNickname=this.formNickname.querySelector("input");const e=t=>{t.preventDefault(),this.you=this.inputNickname.value,console.log("Nickname:",this.you),this.ws.send(JSON.stringify({type:"new-user",name:this.inputNickname.value})).then((e=>e.json())).then((t=>{console.log("Response:",t),"error"===t.status?alert(t.message):"ok"===t.status&&(this.formNickname.removeEventListener("click",e),this.modalNickname.remove(),this.ModalForm.createmodalChat(),this.area(),this.sendMessage(t.user.name),this.closingPage(t.user.name))})).catch((e=>{console.error("Error:",e)}))};this.formNickname.addEventListener("submit",e)}area(){this.ws=new WebSocket("wss://chat-test-2-0.onrender.com/ws"),this.userArea=this.container.querySelector(".modalChat__user"),this.chatArea=this.container.querySelector(".modalChat__chat"),this.ws.addEventListener("message",(e=>{const t=JSON.parse(e.data);if(this.userContainer=document.querySelectorAll(".user"),!t.type)for(let e=0;e<this.userContainer.length;e++)this.userContainer[e].remove();for(let e=0;e<t.length;e++){let s=t[e].name;s===this.you&&(s="YOU"),this.userHTML=`<div class = "user">${s}</div>`,this.userArea.insertAdjacentHTML("beforeEnd",this.userHTML)}null!=t.user&&(t.user===this.you?this.chatArea.insertAdjacentHTML("beforeEnd",`<p class="chatRight">YOU: ${t.msg}</p>`):this.chatArea.insertAdjacentHTML("beforeEnd",`<p class="chatUser">${t.user}:  ${t.msg}</p>`))}))}sendMessage(e){this.addMessage=this.container.querySelector('[data-id="addMessage"]'),this.addMessageInput=this.addMessage.querySelector('[data-id="message"]'),this.addMessage.addEventListener("submit",(t=>{t.preventDefault(),this.ws.send(JSON.stringify({msg:this.addMessageInput.value,type:"send",user:e})),this.addMessageInput.value=""}))}closingPage(e){window.addEventListener("unload",(()=>{this.ws.send(JSON.stringify({msg:"вышел",type:"exit",user:{name:e}}))}))}}(t).init()})();