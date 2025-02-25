export default class ModalForm {
  constructor(root) {
    this.root = root;
  }

  createmodalNickname() {
    const modalNicknameHtml = 
        `<div data-widget="modalNickname" class="container">
            <h2 class="modal__header">Выберите псевдоним</h2>  
            <form id = "form" data-id="addTicket-form">
                <input rows=1 data-id="name" name="name" required class="form__input"></input>
                <button type="submit" data-id="ok" class="form__btn">Продолжить</button>    
            </form>
        </div>`;
    this.root.insertAdjacentHTML('beforeEnd', modalNicknameHtml);
  }

  createmodalChat() {
    const modalMessageSendHtml = 
    `<div data-widget="modalChat" class="container">
        <div class="modalChat__body">
            <div class="modalChat__user">
                <div class="modal__header">Пользователи</div>
            </div>
            <div class="modalChat__chat">
                <div class="modal__header">Окно чата</div>
            </div>
        </div>  
        <form id = "form" data-id="addMessage">
            <input rows=1 data-id="message" name="message" class="form__input" placeholder="Type your message here"></input>
            <button type="submit" data-id="ok" class="form__btn">Отправить</button>    
        </form>
    </div>`;
    this.root.insertAdjacentHTML('beforeEnd', modalMessageSendHtml);
  }
}
