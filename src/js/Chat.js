import ModalForm from './ModalForm';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.ModalForm = new ModalForm(container);
    this.you = '';
  }

  init() {
    this.ModalForm.createmodalNickname();
    this.ws = new WebSocket(
      'wss://chat-test-2-0.onrender.com'
    );
    this.modalNickname = document.querySelector(
      '[data-widget="modalNickname"]'
    );
    this.formNickname = this.modalNickname.querySelector('form');
    this.inputNickname = this.formNickname.querySelector('input');

    const handlerClick = (e) => {
      e.preventDefault();
      this.you = this.inputNickname.value;
      console.log('Nickname:', this.you); // тест

      this.ws.send(JSON.stringify({
        type: 'new-user',
        name: this.inputNickname.value,
      }))

        .then((response) => response.json())
        .then((data) => {
          console.log('Response:', data); // тест
          if (data.status === 'error') {
            alert(data.message);
          } else if (data.status === 'ok') {
            this.formNickname.removeEventListener('click', handlerClick);
            this.modalNickname.remove();
            this.ModalForm.createmodalChat();
            this.area();
            this.sendMessage(data.user.name);
            this.closingPage(data.user.name);
          }
          return;
        })
        .catch((error) => {
          console.error('Error:', error); // тест
        });
    };
    this.formNickname.addEventListener('submit', handlerClick);
  }

  area() {
    this.ws = new WebSocket(
      'wss://chat-test-2-0.onrender.com/ws'
    );

    this.userArea = this.container.querySelector('.modalChat__user');
    this.chatArea = this.container.querySelector('.modalChat__chat');

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      this.userContainer = document.querySelectorAll('.user');

      if (!data.type) {
        for (let i = 0; i < this.userContainer.length; i++) {
          this.userContainer[i].remove();
        }
      }

      for (let i = 0; i < data.length; i++) {
        let elem = data[i].name;
        if (elem === this.you) {
          elem = 'YOU'; 
        }
        this.userHTML = `<div class = "user">${elem}</div>`;
        this.userArea.insertAdjacentHTML('beforeEnd', this.userHTML);
      }

      if (data.user != undefined) {
        if (data.user === this.you) {
          this.chatArea.insertAdjacentHTML(
            'beforeEnd',
            `<p class="chatRight">YOU: ${data.msg}</p>`
          );
        } else {
          this.chatArea.insertAdjacentHTML(
            'beforeEnd',
            `<p class="chatUser">${data.user}:  ${data.msg}</p>`
          );
        }
      }
    });
  }

  sendMessage(name) {
    this.addMessage = this.container.querySelector('[data-id="addMessage"]'); 
    this.addMessageInput = this.addMessage.querySelector('[data-id="message"]');
    this.addMessage.addEventListener('submit', (e) => {
      e.preventDefault();
      this.ws.send(
        JSON.stringify({
          msg: this.addMessageInput.value,
          type: 'send',
          user: name,
        })
      );
      this.addMessageInput.value = '';
    });
  }

  closingPage(name) {
    window.addEventListener('unload', () => {
      this.ws.send(
        JSON.stringify({ msg: 'вышел', type: 'exit', user: { name } })
      );
    });
  }
}
