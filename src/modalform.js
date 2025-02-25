export default class ModalForm {
    constructor(container) {
      this.container = container;
    }
  
    createmodalNickname() {
      const html = `
        <div class="modalNickname">
          <form>
            <input type="text" placeholder="Введите ник" required />
            <button type="submit">Войти</button>
          </form>
        </div>
      `;
      this.container.insertAdjacentHTML('afterbegin', html);
    }
  
    createmodalChat() {
      const html = `
        <div class="modalChat">
          <div class="modalChat__user"></div>
          <div class="modalChat__chat"></div>
          <form data-id="addMessage">
            <input data-id="message" type="text" placeholder="Введите сообщение" required />
            <button type="submit">Отправить</button>
          </form>
        </div>
      `;
      this.container.innerHTML = html;
    }
  }
  