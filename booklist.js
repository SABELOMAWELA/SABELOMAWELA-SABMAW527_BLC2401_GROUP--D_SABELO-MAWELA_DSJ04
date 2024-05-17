
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

export const bookList = {
  page: 1,
  matches: books,

  /**
   * Renders a book preview element.
   * @param {{ author: string, id: string, image: string, title: string }} book - The book object to render.
   * @returns {HTMLButtonElement} The rendered book preview element.
   */
  renderBookPreview({ author, id, image, title }) {
    const element = document.createElement('button');
    element.classList.add('preview');
    element.setAttribute('data-preview', id);
    element.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;
    return element;
  },

  /**
   * Renders the book previews on the page.
   */
  renderBooks() {
    const start = (this.page - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    const fragment = document.createDocumentFragment();
    this.matches.slice(start, end).forEach((book) => {
      const preview = this.renderBookPreview(book);
      fragment.appendChild(preview);
    });
    document.querySelector('[data-list-items]').appendChild(fragment);
  },

  /**
   * Renders a dropdown menu with the given data.
   * @param {Object} data - The data to populate the dropdown with.
   * @param {string} selector - The CSS selector for the dropdown element.
   * @param {string} [defaultOption] - The default option text for the dropdown.
   */
  renderDropdown(data, selector, defaultOption) {
    const fragment = document.createDocumentFragment();
    if (defaultOption) {
      const element = document.createElement('option');
      element.value = 'any';
      element.textContent = defaultOption;
      fragment.appendChild(element);
    }
    Object.entries(data).forEach(([id, name]) => {
      const element = document.createElement('option');
      element.value = id;
      element.textContent = name;
      fragment.appendChild(element);
    });
    document.querySelector(selector).appendChild(fragment);
  },

  /**
   * Filters the books based on the provided filters.
   * @param {Object} filters - The filter options.
   * @param {HTMLElement} messageElement - The element to display the filter message.
   * @param {HTMLElement} searchOverlay - The search overlay element.
   */
  filterBooks(filters, messageElement, searchOverlay) {
    this.matches = books.filter((book) => {
      const genreMatch =
        filters.genre === 'any' || book.genres.includes(filters.genre);
      const titleMatch =
        filters.title.trim() === '' ||
        book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch =
        filters.author === 'any' || book.author === filters.author;
      return genreMatch && titleMatch && authorMatch;
    });

    // Clear existing book previews
    const listItemsContainer = document.querySelector('[data-list-items]');
    listItemsContainer.innerHTML = '';
    this.page = 1;
    this.renderBooks();
    this.updateListButton();

    if (this.matches.length < 1) {
      messageElement.classList.add('list__message_show');
    } else {
      messageElement.classList.remove('list__message_show');
      
    }
    searchOverlay.open = false;
  },

  /**
   * Updates the "Show more" button based on the remaining books.
   */
  updateListButton() {
    const remainingBooks = this.matches.length - this.page * BOOKS_PER_PAGE;
    const buttonElement = document.querySelector('[data-list-button]');
    buttonElement.disabled = remainingBooks < 1;
    buttonElement.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${remainingBooks > 0 ? remainingBooks : 0})</span>
    `;
  },

  /**
   * Shows more books on the page.
   */
  showMoreBooks() {
    this.page += 1;
    this.renderBooks();
    this.updateListButton();
  },

  /**
   * Initializes the book list.
   */
  init() {
    this.renderBooks();
    this.renderDropdown(genres, '[data-search-genres]', 'All Genres');
    this.renderDropdown(authors, '[data-search-authors]', 'All Authors');
    this.updateListButton();
  },
};