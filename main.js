(()=>{"use strict";class e{constructor(e){this.root=e}createmodalNickname(){this.root.insertAdjacentHTML("beforeEnd",'<div data-widget="modalNickname" class="container">\n            <h2 class="modal__header">Выберите псевдоним</h2>  \n            <form id = "form" data-id="addTicket-form">\n                <input rows=1 data-id="name" name="name" required class="form__input"></input>\n                <button type="submit" data-id="ok" class="form__btn">Продолжить</button>    \n            </form>\n        </div>')}createmodalChat(){this.root.insertAdjacentHTML("beforeEnd",'<div data-widget="modalChat" class="container">\n        <div class="modalChat__body">\n            <div class="modalChat__user">\n                <div class="modal__header">Пользователи</div>\n            </div>\n            <div class="modalChat__chat">\n                <div class="modal__header">Окно чата</div>\n            </div>\n        </div>  \n        <form id = "form" data-id="addMessage">\n            <input rows=1 data-id="message" name="message" class="form__input" placeholder="Type your message here"></input>\n            <button type="submit" data-id="ok" class="form__btn">Отправить</button>    \n        </form>\n    </div>')}}const t=document.getElementById("root");new class{constructor(t){this.container=t,this.ModalForm=new e(t),this.you=""}init(){this.ModalForm.createmodalNickname(),this.modalNickname=document.querySelector('[data-widget="modalNickname"]'),this.formNickname=this.modalNickname.querySelector("form"),this.inputNickname=this.formNickname.querySelector("input");this.formNickname.addEventListener("submit",(e=>{e.preventDefault(),this.you=this.inputNickname.value,this.ws=new WebSocket("wss://chat-test-2-0.onrender.com/ws"),this.ws.onopen=()=>{this.ws.send(JSON.stringify({type:"new-user",name:this.you}))};const t=e=>{const s=JSON.parse(e.data);"login"===s.type&&("error"===s.status?alert(s.message):"ok"===s.status&&(this.ws.removeEventListener("message",t),this.modalNickname.remove(),this.ModalForm.createmodalChat(),this.area(),this.sendMessage(s.user.name),this.closingPage(s.user.name)))};this.ws.addEventListener("message",t)}))}area(){this.userArea=this.container.querySelector(".modalChat__user"),this.chatArea=this.container.querySelector(".modalChat__chat"),this.ws.addEventListener("message",(e=>{JSON.parse(e.data)}))}sendMessage(e){this.addMessage=this.container.querySelector('[data-id="addMessage"]'),this.addMessageInput=this.addMessage.querySelector('[data-id="message"]'),this.addMessage.addEventListener("submit",(t=>{t.preventDefault(),this.ws.send(JSON.stringify({msg:this.addMessageInput.value,type:"send",user:e})),this.addMessageInput.value=""}))}closingPage(e){window.addEventListener("unload",(()=>{this.ws.send(JSON.stringify({msg:"вышел",type:"exit",user:{name:e}}))}))}}(t).init()})();