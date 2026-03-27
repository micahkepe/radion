/*
 * @file This script initializes the theme data. This script should not be
 * deferred and should be placed within the <head> section of the page to
 * set the theme class on the DOM before rendering the page to prevent
 * flickering.
 */

(function () {
  try {
    var storedTheme = localStorage.getItem("theme-storage");
    var defaultTheme = document.documentElement.dataset.theme || "toggle";
    var theme;

    if (defaultTheme === "light" || defaultTheme === "dark") {
      theme = defaultTheme;
    } else if (defaultTheme === "auto" || defaultTheme === "toggle") {
      if (storedTheme === "light" || storedTheme === "dark") {
        theme = storedTheme;
      } else {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    } else {
      theme = "dark";
    }

    // Apply theme class directly
    document.documentElement.classList.add(theme);

    if (document.body) {
      document.body.classList.add(theme);
    } else {
      window.addEventListener("DOMContentLoaded", function () {
        document.body.classList.add(theme);
      });
    }

    // Force syntax highlighting stylesheets to match the resolved theme.
    // Without this, the browser applies them based on OS prefers-color-scheme,
    // which may not match the stored user preference.
    var d = document.getElementById("giallo-dark");
    var l = document.getElementById("giallo-light");
    if (d && l) {
      d.media = theme === "dark" ? "all" : "not all";
      l.media = theme === "light" ? "all" : "not all";
    }
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
