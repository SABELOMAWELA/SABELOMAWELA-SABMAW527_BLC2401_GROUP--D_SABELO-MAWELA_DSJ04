# Book connect documentation
- ## script.js
1) ##  Initialization:
- theme.init(): Initializes the theme based on user preference (from theme.js).
- bookList.init(): Initializes the book list functionality and renders initial data (from bookList.js).
2) ## Event Listeners:
- #### These functions provide reusable logic for attaching event listeners based on selector and callback functions:
- handleClickEvent(selectorElement, callback): Attaches a click event listener to the element identified by selectorElement. When clicked, it calls the provided callback function.
- handleSubmitEvent(selectorElement, callback): Similar to handleClickEvent, but attaches a submit event listener for forms identified by selectorElement. When submitted, it calls the callback function.
- handleOverLay(selectorElement, overlayElement, boolean): Handles click events on elements identified by selectorElement. When clicked, it toggles the open state (boolean) of the overlay element (overlayElement).
3) ## Search Functionality:
- #### handleSearch(event):
- Prevents default form submission behavior (event.preventDefault()).
- Extracts form data using FormData(event.target).
- Converts the form data to an object using Object.fromEntries(formData). This object represents the search filters.
- Retrieves references to the list message element ([data-list-message]) and search overlay ([data-search-overlay]).
- Calls bookList.filterBooks(filters, messageElement, searchOverlay) to filter the book list based on the provided filters and update the UI accordingly.
- Scrolls the page to the top smoothly (window.scrollTo({ top: 0, behavior: 'smooth' })) to potentially reveal filtered results.
4) ## Settings Functionality:
- #### handleSettingsSubmit(event):
- Prevents default form submission behavior (event.preventDefault()).
- Extracts form data using FormData(event.target).
- Destructures the theme property from the form data object to get the selected theme option.
- Calls theme.toggleTheme() to switch the theme based on the user's choice.
- Logs the selected theme option for potential debugging or analytics (console.log(themeOption)).
- Closes the settings overlay (document.querySelector('[data-settings-overlay]').open = false).
5) ## Book List Interaction:
- #### handleListClick(event):
- Uses event.path or event.composedPath (if available) to traverse the click event path.
- Iterates through the path nodes to find the clicked element.
- If a node has a data-preview attribute, it identifies a book preview item.
- Extracts the book ID from the data-preview attribute.
- Uses bookList.matches.find((book) => book.id === bookId) to find the corresponding book object from the filtered books (bookList.matches).
- Creates a new book-preview element (const bookPreview = document.createElement('book-preview')).
- Sets the book data on the preview element using bookPreview.book = active (where active holds the found book object).
- Appends the preview element to the document body (document.body.appendChild(bookPreview)).
- Attaches a close event listener to the preview element. When closed, the listener removes the preview element from the DOM (document.body.removeChild(bookPreview)).
6) ## Overlay Management:
- handleOverLay(selectorElement, overlayElement, boolean) is reused for handling click events on elements that control overlay visibility. Clicking the element identified by selectorElement toggles the open state (boolean) of the overlay element (overlayElement).
7) ## Additional Event Listeners:
- handleSubmitEvent('[data-search-form]', handleSearch): Attaches a submit event listener to the search form ([data-search-form]). When submitted, it calls handleSearch to process the search filters.
- handleSubmitEvent('[data-settings-form]', handleSettingsSubmit): Attaches a submit event listener to the settings form ([data-settings-form]). When submitted, it calls handleSettingsSubmit to toggle the theme.
- handleClickEvent('[data-list-items]', handleListClick): Attaches a click event listener to the book list container ([data-list-items]). When an item is clicked, it calls handleListClick to potentially open a book preview.
- ## book-preview.js
1) ## Class:
#### BookPreview extends HTMLElement:
- Creates a reusable custom element for displaying book preview information.
2) ## Constructor:
- #### constructor():
- Calls the super() constructor to inherit properties and methods from HTMLElement.
- Attaches a Shadow DOM using attachShadow({ mode: 'open' }). This provides encapsulation and avoids styling conflicts.
- #### Sets the Shadow DOM's inner HTML content:
- Includes a link to the CSS stylesheet (book-preview-styles.css) for styling the component.
- Creates a dialog element with the following structure:
- A container (overlay__preview) for preview images:
- A blurred image (overlay__blur) with a data-list-blur attribute to be populated dynamically.
- A clear image (overlay__image) with a data-list-image attribute to be populated dynamically.
- A container (overlay__content) for book details:
- A title heading (overlay__title) with a data-list-title attribute to be populated dynamically.
- A data element (overlay__data) with a data-list-subtitle attribute to be populated dynamically (used for author and publication year).
- A paragraph element (overlay__data overlay__data_secondary) with a data-list-description attribute to be populated dynamically (used for book description).
- A container (overlay__row) housing a close button:
- A button (overlay__button overlay__button_primary) with a data-list-close attribute to be used for closing the preview.
3) ## Connected Callback:
- #### connectedCallback():
- This lifecycle method is called when the custom element is inserted into the DOM.
- Selects the close button element ([data-list-close]) from the Shadow DOM.
- Attaches a click event listener to the close button.
- When clicked, the event listener dispatches a custom event named "close" using dispatchEvent(). This allows parent components to listen for this event and potentially handle the close action.
4) ## Property Setter: 
- #### set book(book):
- This property setter is called whenever the book attribute of the book-preview element is set.
- Destructures the provided book object to access its properties: author, description, image, published, and title.
- #### Updates the Shadow DOM elements with the book data:
- Sets the src attribute of both blurred and clear image elements ([data-list-blur], [data-list-image]) to the book's image URL.
- Sets the text content of the title element ([data-list-title]) to the book's title.
- Constructs the subtitle text by using data from the authors object (assumed to be accessible) and formats the publication year. Sets this as the inner text of the subtitle element ([data-list-subtitle]).
- Sets the text content of the description paragraph ([data-list-description]) to the book's description.
5) ## Registration:
- #### customElements.define('book-preview', BookPreview):
- Registers the BookPreview class as a custom element named "book-preview".
- ## bookList.js
1) ## Module Exports:
- bookList: An object containing functions and properties for managing the book list display and filtering.
2) ## Properties:
- page (Number): Represents the current page number for displaying book previews. Starts at 1.
- matches (Array): Stores the currently displayed book objects after applying filters. Initially set to the entire books array.
3) ## Functions:
- #### renderBookPreview ({ author, id, image, title }):
- Creates and returns a button element representing a book preview.
- Adds classes for styling (preview) and a data attribute (data-preview) for identification.
- Sets the preview's HTML content with:
- An image element (preview__image) with the provided URL (image).
- A container (preview__info) containing:
- A title heading (preview__title) with the book's title (title).
- An author information element (preview__author) displaying the author's name retrieved from the authors object using the provided author key.
- #### renderBooks():
- Calculates the starting and ending indices for book previews based on the current page and BOOKS_PER_PAGE constant.
- Creates a document fragment for efficient DOM manipulation.
- Iterates over the filtered books (this.matches) within the calculated range:
- Calls renderBookPreview for each book to create a preview element.
- the preview element to the document fragment.
- Attaches the fragment to the container element identified by the [data-list-items] selector.
- #### renderDropdown (data, selector, defaultOption):
- Creates a document fragment for efficient DOM manipulation.
- #### If a defaultOption is provided:
- Creates an option element with value set to "any" and the provided text.
- Appends the default option element to the fragment.
- #### Iterates over the provided data object (genres, authors):
- Creates an option element for each key-value pair.
- Sets the option's value and text content based on the object properties.
- Appends the option element to the fragment.
- Attaches the fragment to the element identified by the provided selector.
- #### filterBooks (filters, messageElement, searchOverlay):
- Filters the books array based on the provided filters object (e.g., genre, title, author).
- The filter logic checks for matches in genres, title (case-insensitive), and author.
- Updates the this.matches property to hold the filtered book objects.
- Clears existing book previews by setting the [data-list-items] container's inner HTML to an empty string.
- Resets the current page to 1 (this.page = 1).
- Renders the filtered books using renderBooks().
- Updates the "Show More" button state using updateListButton().
- Shows or hides the filter message element (list__message_show class) based on the number of filtered books.
- Closes the search overlay (searchOverlay.open = false).
- #### updateListButton():
- Calculates the number of remaining books based on the total filtered books and the current page.
- Retrieves the "Show More" button element ([data-list-button]).
- Disables the button if there are no more books to show.
- Updates the button's inner HTML content:
- Displays "Show More" text.
- Adds a span element (list__remaining) showing the number of remaining books (or 0 if none).
- #### showMoreBooks():
- Increments the current page number (this.page).
- Renders additional book previews based on the updated page using renderBooks().
- Updates the "Show More" button state using updateListButton().
- #### init():
- Renders the initial book previews using renderBooks().
- Creates dropdowns for genres and authors using renderDropdown().
- Initializes the "Show More" button state using updateListButton().
- ## theme.js
1) ## Module Exports:
- theme: An object containing properties and functions for theme configuration and application.
2) ## Properties:
- #### isDarkMode (boolean | null):
- Stores the user's preferred color scheme (true for dark, false for light, null for uninitialized).
3) ## Object Properties:
- darkThemeVars: An object containing CSS variable values for the dark theme:
- colorDark: The color value for dark elements in dark mode.
- colorLight: The color value for light elements in dark mode.
- lightThemeVars: An object containing CSS variable values for the light theme (mirrors darkThemeVars for opposite colors).
4) ## Functions:
- #### init():
- Checks for the window.matchMedia API availability.
- #### If available, uses window.matchMedia('(prefers-color-scheme: dark)') to determine the user's preferred color scheme:
- If the user prefers dark mode, sets this.isDarkMode to true.
- Sets the theme based on the user's preference using setTheme().
- #### setTheme():
- #### Retrieves the appropriate theme variables based on this.isDarkMode:
- darkThemeVars for dark mode (this.isDarkMode is true).
- lightThemeVars for light mode (this.isDarkMode is false).
- Sets the --color-dark and --color-light CSS variables for the document's root element (document.documentElement) using their respective values from the chosen theme variables.
- Updates the theme selection element ([data-settings-theme]) with the current theme:
- Sets its value to "night" for dark mode.
- Sets its value to "day" for light mode.
- #### toggleTheme():
- Toggles the isDarkMode property (between true and false).
- Sets the theme based on the updated isDarkMode value using setTheme().
4) ## Registration:
- ####  customElements.define('book-preview', BookPreview):
- Registers the BookPreview class as a custom element named "book-preview".


