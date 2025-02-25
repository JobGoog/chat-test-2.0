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

    // Обработчик клика по кнопке «Продолжить» (submit формы)
    const handlerClick = (e) => {
      e.preventDefault();
      this.you = this.inputNickname.value;

      // 1. Создаём WebSocket-соединение (без fetch)
      this.ws = new WebSocket('wss://chat-test-2-0.onrender.com/ws');

      // 2. Когда соединение установлено, отправляем "new-user"
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({
          type: 'new-user',
          name: this.you,
        }));
      };

      // 3. Ждём ответ «login» от сервера
      const loginHandler = (event) => {
        const data = JSON.parse(event.data);

        // Допустим, сервер отвечает: { type: 'login', status: 'ok', user: { name: ... } }
        if (data.type === 'login') {
          if (data.status === 'error') {
            // Ник занят или другая ошибка
            alert(data.message);
          } else if (data.status === 'ok') {
            // Логин успешен
            this.ws.removeEventListener('message', loginHandler);
            this.modalNickname.remove();
            this.ModalForm.createmodalChat();
            this.area(); // запускаем логику отображения пользователей
            this.sendMessage(data.user.name); // отправка сообщений
            this.closingPage(data.user.name);
          }
        }
      };
      this.ws.addEventListener('message', loginHandler);
    };

    this.formNickname.addEventListener('submit', handlerClick);
  }

  // Обновление списка пользователей, приём/отправка сообщений
  area() {
    // Здесь this.ws уже создан
    this.userArea = this.container.querySelector('.modalChat__user');
    this.chatArea = this.container.querySelector('.modalChat__chat');

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);

      // Пример: если сервер рассылает массив пользователей (data.length) или { user, msg } и т. п.
      // Логика зависит от формата, который сервер отправляет
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
        user: { name },
      }));
    });
  }
}
