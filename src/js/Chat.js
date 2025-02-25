import ModalForm from './ModalForm';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.ModalForm = new ModalForm(container);
    this.you = '';
  }

  init() {
    this.ModalForm.createmodalNickname(); //создаем модальное окно для никнейма
    this.modalNickname = document.querySelector(
      '[data-widget="modalNickname"]'
    );
    this.formNickname = this.modalNickname.querySelector('form'); //получаем форму никнейма
    this.inputNickname = this.formNickname.querySelector('input'); //получаем инпут никнейма

    //функция отправки формы для никнейма
    const handlerClick = (e) => {
      e.preventDefault();
      this.you = this.inputNickname.value;
      fetch('https://chat-test-2-0.onrender.com', {
        method: 'POST',
        body: JSON.stringify({ name: `${this.inputNickname.value}` }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'error') {
            alert(data.message);
          } else if (data.status === 'ok') {
            this.formNickname.removeEventListener('click', handlerClick); //удаляем обработчик формы
            this.modalNickname.remove(); //удаляем окно никнейма
            this.ModalForm.createmodalChat(); //создаем окно чата
            this.area(); //запускаем метод работы с чатом
            this.sendMessage(data.user.name); //запускаем метод отправки сообщений
            this.closingPage(data.user.name);
          }
          return;
        });
    };
    this.formNickname.addEventListener('submit', handlerClick);
  }

  //Метод для работы с полем чата
  area() {
    this.ws = new WebSocket(
      'wss://chat-test-2-0.onrender.com'
    );

    this.userArea = this.container.querySelector('.modalChat__user'); //Поле списка ползователей
    this.chatArea = this.container.querySelector('.modalChat__chat'); //Поле чата ползователей

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      this.userContainer = document.querySelectorAll('.user');

      //Очистка поля списка Юзеров
      if (!data.type) {
        for (let i = 0; i < this.userContainer.length; i++) {
          this.userContainer[i].remove(); //то очищаем поле
        }
      }

      //Добавление юзеров в поле списка юзеров
      for (let i = 0; i < data.length; i++) {
        let elem = data[i].name;
        if (elem === this.you) {
          elem = 'YOU'; //то имя регистрации меняем на "YOU"
        }
        this.userHTML = `<div class = "user">${elem}</div>`;
        this.userArea.insertAdjacentHTML('beforeEnd', this.userHTML);
      }

      //Добавление переписки в поле чата
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

  //Метод отправить сообщение
  sendMessage(name) {
    this.addMessage = this.container.querySelector('[data-id="addMessage"]'); //фома
    this.addMessageInput = this.addMessage.querySelector('[data-id="message"]'); //поле ввода
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

  //Метод закрытия документа
  closingPage(name) {
    window.addEventListener('unload', () => {
      this.ws.send(
        JSON.stringify({ msg: 'вышел', type: 'exit', user: { name } })
      );
    });
  }
}
