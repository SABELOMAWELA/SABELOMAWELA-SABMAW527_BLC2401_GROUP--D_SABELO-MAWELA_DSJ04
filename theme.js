export const theme = {
    /**
     * Indicates whether the user prefers dark mode or not.
     * @type {boolean|null}
     */
    isDarkMode: null,
  
    /**
     * CSS variables for the dark theme.
     * @type {Object}
     * @property {string} colorDark - The CSS variable value for the dark color in dark mode.
     * @property {string} colorLight - The CSS variable value for the light color in dark mode.
     */
    darkThemeVars: {
      colorDark: '255, 255, 255',
      colorLight: '10, 10, 20',
    },
  
    /**
     * CSS variables for the light theme.
     * @type {Object}
     * @property {string} colorDark - The CSS variable value for the dark color in light mode.
     * @property {string} colorLight - The CSS variable value for the light color in light mode.
     */
    lightThemeVars: {
      colorDark: '10, 10, 20',
      colorLight: '255, 255, 255',
    },
  
    /**
     * Initializes the theme by checking the user's preferred color scheme and setting the theme accordingly.
     */
    init() {
      // eslint-disable-next-line prettier/prettier
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme();
    },
  
    /**
     * Sets the CSS variables for the current theme based on the user's preferred color scheme.
     */
    setTheme() {
      const { colorDark, colorLight } = this.isDarkMode
        ? this.darkThemeVars
        : this.lightThemeVars;
      document.documentElement.style.setProperty('--color-dark', colorDark);
      document.documentElement.style.setProperty('--color-light', colorLight);
      document.querySelector('[data-settings-theme]').value = this.isDarkMode
        ? 'night'
        : 'day';
    },
  
    /**
     * Toggles the theme between dark and light mode.
     */
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.setTheme();
    },
  };