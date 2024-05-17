import { authors } from './data.js';

class BookPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="book-preview-styles.css">
      
    <dialog class="overlay" data-list-active>
    <div class="overlay__preview"><img class="overlay__blur" data-list-blur src=""/><img class="overlay__image" data-list-image src=""/></div>
    <div class="overlay__content">
      <h3 class="overlay__title" data-list-title></h3>
      <div class="overlay__data" data-list-subtitle></div>
      <p class="overlay__data overlay__data_secondary" data-list-description></p>
    </div>

    <div class="overlay__row">
      <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
    </div>
  </dialog>
      
      `;
  }
    connectedCallback() {
    this.shadowRoot
      .querySelector('[data-list-close]')
      .addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('close'));
      });
  }

  /**
   * @param {{ author: any; description: any; image: any; published: any; title: any; }} book
   */
  set book(book) {
    const { author, description, image, published, title } = book;
    this.shadowRoot.querySelector('[data-list-blur]').src = image;
    this.shadowRoot.querySelector('[data-list-image]').src = image;
    this.shadowRoot.querySelector('[data-list-title]').innerText = title;
    this.shadowRoot.querySelector('[data-list-subtitle]').innerText =
      `${authors[author]} (${new Date(published).getFullYear()})`;
    this.shadowRoot.querySelector('[data-list-description]').innerText =
      description;
  }
}

customElements.define('book-preview', BookPreview);