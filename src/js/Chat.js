import ModalForm from './ModalForm';

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

      // Создаём WebSocket-соединение
      this.ws = new WebSocket('wss://chat-test-2-0.onrender.com/ws');

      // Как только соединение установлено, отправляем запрос на регистрацию
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({
          type: 'new-user',
          name: this.inputNickname.value,
        }));
      };

      // Обрабатываем ответ на регистрацию
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
      this.userContainer = document.querySelectorAll('.user');

      if (!data.type) {
        this.userContainer.forEach((el) => el.remove());
      }

      data.forEach((user) => {
        let elem = user.name;
        if (elem === this.you) {
          elem = 'YOU';
        }
        const userHTML = `<div class="user">${elem}</div>`;
        this.userArea.insertAdjacentHTML('beforeEnd', userHTML);
      });

      if (data.user !== undefined) {
        if (data.user === this.you) {
          this.chatArea.insertAdjacentHTML(
            'beforeEnd',
            `<p class="chatRight">YOU: ${data.msg}</p>`
          );
        } else {
          this.chatArea.insertAdjacentHTML(
            'beforeEnd',
            `<p class="chatUser">${data.user}: ${data.msg}</p>`
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
      this.ws.send(JSON.stringify({
        msg: this.addMessageInput.value,
        type: 'send',
        user: name,
      }));
      this.addMessageInput.value = '';
    });
  }

  closingPage(name) {
    window.addEventListener('unload', () => {
      this.ws.send(JSON.stringify({
        msg: 'вышел',
        type: 'exit',
        user: { name }
      }));
    });
  }
}
