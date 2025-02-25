import './styles.css';
import Chat from './chat';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('chatContainer');
  const chat = new Chat(container);
  chat.init();
});
