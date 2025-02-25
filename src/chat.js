import ModalForm from './modalform';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.ModalForm = new ModalForm(container);
    this.you = '';
  }

  init() {
    this.ModalForm.createmodalNickname();
    this.modalNickname = document.querySelector('[data-widget="modalNickname"]');
    this.formNickname = this.modalNickname.querySelector('form');
    this.inputNickname = this.formNickname.querySelector('input');

    const handlerClick = (e) => {
      e.preventDefault();
      this.you = this.inputNickname.value;

      // Создаем WebSocket-соединение с сервером на Render
      this.ws = new WebSocket('wss://chat-test-2-0.onrender.com/ws');

      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({
          type: 'new-user',
          name: this.you,
        }));
      };

      const loginHandler = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'login') {
          if (data.status === 'error') {
            alert(data.message);
          } else if (data.status === 'ok') {
            this.ws.removeEventListener('message', loginHandler);
            this.modalNickname.remove();
            this.ModalForm.createmodalChat();
            this.area();
            this.sendMessage(data.user.name);
            this.closingPage(data.user.name);
          }
        }
      };
      this.ws.addEventListener('message', loginHandler);
    };

    this.formNickname.addEventListener('submit', handlerClick);
  }

  area() {
    this.userArea = this.container.querySelector('.modalChat__user');
    this.chatArea = this.container.querySelector('.modalChat__chat');

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      if (!data.type) {
        this.userArea.innerHTML = '';
        data.forEach((user) => {
          let name = user.name;
          if (name === this.you) {
            name = 'YOU';
          }
          this.userArea.insertAdjacentHTML('beforeEnd', `<div class="user">${name}</div>`);
        });
      }
      if (data.type === 'message' && data.user) {
        if (data.user === this.you) {
          this.chatArea.insertAdjacentHTML('beforeEnd', `<p class="chatRight">YOU: ${data.msg}</p>`);
        } else {
          this.chatArea.insertAdjacentHTML('beforeEnd', `<p class="chatUser">${data.user}: ${data.msg}</p>`);
        }
      }
    });
  }

  sendMessage(name) {
    this.addMessage = this.container.querySelector('[data-id="addMessage"]');
    this.addMessageInput = this.addMessage.querySelector('[data-id="message"]');
    this.addMessage.addEventListener('submit', (e) => {
      e.preventDefault();
      this.ws.send(JSON.stringify({
        type: 'send',
        msg: this.addMessageInput.value,
        user: name,
      }));
      this.addMessageInput.value = '';
    });
  }

  closingPage(name) {
    window.addEventListener('unload', () => {
      this.ws.send(JSON.stringify({
        type: 'exit',
        msg: 'вышел',
        user: { name },
      }));
    });
  }
}
