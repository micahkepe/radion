/**
 * @file Provides a search functionality for the website.
 * Adapted from Zola repository: https://github.com/getzola/zola/blob/master/docs/static/search.js
 * @see https://www.getzola.org/documentation/content/search/
 */

/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to wait before calling the
 * function.
 * @return {Function} - A new function that, when called, will delay the
 * execution of `func` until after `wait` milliseconds have passed since the
 * last time it was invoked.
 */
function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Generates a teaser from the body of a document based on search terms.
 *
 * @param {string} body - The body of the document to generate a teaser from.
 * @param {Array<string>} terms - An array of search terms to highlight in the teaser.
 * @return {string} - A teaser string that highlights the search terms
 *
 * Taken from mdbook.
 *
 * The strategy is as follows:
 *  1) First, assign a value to each word in the document:
 *    - Words that correspond to search terms (stemmer aware): 40
 *    - Normal words: 2
 *    - First word in a sentence: 8
 *  2) Then use a sliding window with a constant number of words and count the
 *     sum of the values of the words within the window. Then use the window that got the
 *     maximum sum. If there are multiple maximas, then get the last one.
 *  3) Enclose the terms in <b>.
 */
function makeTeaser(body, terms) {
  var TERM_WEIGHT = 40;
  var NORMAL_WORD_WEIGHT = 2;
  var FIRST_WORD_WEIGHT = 8;
  var TEASER_MAX_WORDS = 30;

  var stemmedTerms = terms.map(function (w) {
    return elasticlunr.stemmer(w.toLowerCase());
  });
  var termFound = false;
  var index = 0;
  var weighted = []; // contains elements of ["word", weight, index_in_document]

  // split in sentences, then words
  var sentences = body.toLowerCase().split(". ");

  for (var i in sentences) {
    var words = sentences[i].split(" ");
    var value = FIRST_WORD_WEIGHT;

    for (var j in words) {
      var word = words[j];

      if (word.length > 0) {
        for (var k in stemmedTerms) {
          if (elasticlunr.stemmer(word).startsWith(stemmedTerms[k])) {
            value = TERM_WEIGHT;
            termFound = true;
          }
        }
        weighted.push([word, value, index]);
        value = NORMAL_WORD_WEIGHT;
      }

      index += word.length;
      index += 1; // ' ' or '.' if last word in sentence
    }

    index += 1; // because we split at a two-char boundary '. '
  }

  if (weighted.length === 0) {
    return body;
  }

  var windowWeights = [];
  var windowSize = Math.min(weighted.length, TEASER_MAX_WORDS);
  // We add a window with all the weights first
  var curSum = 0;
  for (var i = 0; i < windowSize; i++) {
    curSum += weighted[i][1];
  }
  windowWeights.push(curSum);

  for (var i = 0; i < weighted.length - windowSize; i++) {
    curSum -= weighted[i][1];
    curSum += weighted[i + windowSize][1];
    windowWeights.push(curSum);
  }

  // If we didn't find the term, just pick the first window
  var maxSumIndex = 0;
  if (termFound) {
    var maxFound = 0;
    // backwards
    for (var i = windowWeights.length - 1; i >= 0; i--) {
      if (windowWeights[i] > maxFound) {
        maxFound = windowWeights[i];
        maxSumIndex = i;
      }
    }
  }

  var teaser = [];
  var startIndex = weighted[maxSumIndex][2];
  for (var i = maxSumIndex; i < maxSumIndex + windowSize; i++) {
    var word = weighted[i];
    if (startIndex < word[2]) {
      // missing text from index to start of `word`
      teaser.push(body.substring(startIndex, word[2]));
      startIndex = word[2];
    }

    // add <em/> around search terms
    if (word[1] === TERM_WEIGHT) {
      teaser.push("<b>");
    }
    startIndex = word[2] + word[0].length;
    teaser.push(body.substring(word[2], startIndex));

    if (word[1] === TERM_WEIGHT) {
      teaser.push("</b>");
    }
  }
  teaser.push("…");
  return teaser.join("");
}

/**
 * Escapes HTML special characters to prevent XSS attacks.
 * Only used for sanitizing user input (search terms).
 * @param {string} unsafe - The unsafe string to escape.
 * @return {string} - The escaped string safe for HTML rendering.
 */
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Formats a search result item into a DOM element.
 * @param {Object} item - The search result item containing a reference and document.
 * @param {Array<string>} terms - The search terms used for highlighting (sanitized).
 * @return {HTMLElement} - The formatted article element for the search result.
 */
function formatSearchResultItem(item, terms) {
  // Create article element
  const article = document.createElement('article');
  article.className = 'search-results__item';

  // Create link with title
  const link = document.createElement('a');
  link.href = item.ref;
  link.textContent = item.doc.title;

  // Create section with teaser (makeTeaser returns HTML string with <b> tags)
  const section = document.createElement('section');
  section.innerHTML = makeTeaser(item.doc.body, terms);

  article.appendChild(link);
  article.appendChild(section);

  return article;
}

/**
 * Initializes the search functionality by setting up event listeners
 * and loading the search index.
 */
function initSearch() {
  var $searchInput = document.getElementById("search");
  var $searchModalInput = document.getElementById("search-modal");
  var $searchResults = document.querySelector(".search-results");
  var $searchResultsItems = document.querySelector(".search-results__items");
  var $searchBackdrop = document.querySelector(".search-backdrop");
  var $slashIcon = document.getElementById("slash-icon");
  var MAX_ITEMS = 10;

  if (!$searchInput || !$searchModalInput) {
    return;
  }

  var options = {
    bool: "AND",
    fields: {
      title: { boost: 2 },
      body: { boost: 1 },
    },
  };
  var currentTerm = "";
  var index;
  var selectedIndex = -1;
  var scrollPosition = 0;

  // Helper functions to show/hide the search modal
  function showSearchModal() {
    document.body.classList.add("modal-open");

    $searchResults.classList.add("active");
    $searchBackdrop.classList.add("active");

    // Reset selection
    selectedIndex = -1;

    // Focus the modal input
    setTimeout(() => $searchModalInput.focus(), 100);
  }

  function hideSearchModal() {
    $searchResults.classList.remove("active");
    $searchBackdrop.classList.remove("active");
    document.body.classList.remove("modal-open");

    // Clear both inputs and results
    $searchInput.value = "";
    $searchModalInput.value = "";
    $searchResultsItems.innerHTML = "";
    selectedIndex = -1;
  }

  // Function to update selected item
  function updateSelection(newIndex) {
    const items = $searchResultsItems.querySelectorAll('.search-results__item');
    if (items.length === 0) return;

    // Remove previous selection
    items.forEach(item => item.classList.remove('selected'));

    // Clamp index
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= items.length) newIndex = items.length - 1;

    selectedIndex = newIndex;

    // Add selection to new item
    if (items[selectedIndex]) {
      items[selectedIndex].classList.add('selected');
      items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  const initIndex = function () {
    if (index === undefined) {
      // Get the base path by looking for the first path segment
      const pathParts = window.location.pathname.split("/");
      const basePath = pathParts[1] ? `/${pathParts[1]}` : "";
      const indexPath = `${basePath}/search_index.en.json`;

      // Try fetching the search index file from the base path
      // and if that fails, try fetching it from the root path
      index = fetch(indexPath)
        .then((response) => {
          if (!response.ok && response.status === 404) {
            // If base path fails, try root path
            return fetch("/search_index.en.json");
          }
          return response;
        })
        .then((response) => {
          if (!response.ok && response.status === 404) {
            // If both paths fail
            console.warn(
              "Search index not found at either the base or root path.",
            );
            return null;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            return elasticlunr.Index.load(data);
          }
          return null;
        })
        .catch((error) => {
          console.error("Error loading search index:", error);
          throw error;
        });
    }

    return index;
  };

  // Function to toggle slash icon visibility
  function updateSlashIconVisibility() {
    if ($slashIcon) {
      // Hide if field is focused OR has text, show only when unfocused AND empty
      if (document.activeElement === $searchInput || $searchInput.value.trim() !== "") {
        $slashIcon.classList.add("hidden");
      } else {
        $slashIcon.classList.remove("hidden");
      }
    }
  }

  // Update slash icon visibility on input
  $searchInput.addEventListener("input", updateSlashIconVisibility);

  // Hide slash icon when search field is focused
  $searchInput.addEventListener("focus", function() {
    updateSlashIconVisibility();
    // Open modal when navbar search is focused
    showSearchModal();
  });

  // Show slash icon when search field loses focus (if empty)
  $searchInput.addEventListener("blur", updateSlashIconVisibility);

  // When typing in navbar search, open modal and sync to modal input
  $searchInput.addEventListener("input", function() {
    if ($searchInput.value.length > 0) {
      showSearchModal();
      $searchModalInput.value = $searchInput.value;
      // Trigger search on modal input
      $searchModalInput.dispatchEvent(new Event('input'));
    }
  });

  // Main search functionality on modal input
  $searchModalInput.addEventListener(
    "input",
    debounce(async function () {
      var term = $searchModalInput.value.trim();
      if (term === currentTerm) {
        return;
      }

      $searchResultsItems.innerHTML = "";
      currentTerm = term;
      selectedIndex = -1; // Reset selection on new search

      if (term === "") {
        // Show empty state but keep modal open
        return;
      }

      var results = (await initIndex()).search(term, options);
      if (results.length === 0) {
        // show "No results found"
        const noResultsItem = document.createElement("li");
        noResultsItem.className = "search-results__item search-results__no-results";
        noResultsItem.textContent = "No results found...";
        $searchResultsItems.appendChild(noResultsItem);
        return;
      }

      // Sanitize user input (search terms) before using
      const sanitizedTerms = term.split(" ").map(t => escapeHtml(t));

      for (var i = 0; i < Math.min(results.length, MAX_ITEMS); i++) {
        var item = document.createElement("li");
        item.appendChild(formatSearchResultItem(results[i], sanitizedTerms));

        // Add click handler for each item
        item.addEventListener('click', function() {
          const link = this.querySelector('a');
          if (link) {
            window.location.href = link.href;
          }
        });

        // Add hover handler to update selection
        item.addEventListener('mouseenter', function() {
          const items = Array.from($searchResultsItems.querySelectorAll('.search-results__item'));
          const index = items.indexOf(this);
          if (index >= 0) {
            updateSelection(index);
          }
        });

        $searchResultsItems.appendChild(item);
      }

      // Auto-select first item after results load
      setTimeout(() => updateSelection(0), 50);
    }, 150),
  );

  // Handle arrow key navigation and Enter key
  $searchModalInput.addEventListener("keydown", function (e) {
    const items = $searchResultsItems.querySelectorAll('.search-results__item');
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      updateSelection(selectedIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      updateSelection(selectedIndex - 1);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const link = items[selectedIndex].querySelector('a');
      if (link) {
        window.location.href = link.href;
      }
    }
  });

  // exit search on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("modal-open")) {
      hideSearchModal();
      $searchInput.blur();
      // Show slash icon again since input is now empty
      updateSlashIconVisibility();
    }
  });

  // event listener for `/` to open search modal
  document.addEventListener("keydown", function (e) {
    // Only open modal if we're not already typing in an input
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      // don't have input be `/`
      e.preventDefault();
      showSearchModal();
    }
  });

  // Close modal when clicking on backdrop
  $searchBackdrop.addEventListener("click", function () {
    hideSearchModal();
    updateSlashIconVisibility();
  });
}

// Check if the document is already loaded or not
if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  initSearch();
} else {
  document.addEventListener("DOMContentLoaded", initSearch);
}
