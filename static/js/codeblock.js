/**
 * @file Adds a copy-to-clipboard button to code blocks. Language labels are
 * handled by CSS via data-lang attributes.
 */

/**
 * Code copy button success icon
 */
const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-check-lg" viewBox="0 0 16 16">
            <path d="M13.485 1.85a.5.5 0 0 1 1.065.02.75.75 0 0 1-.02 1.065L5.82 12.78a.75.75 0 0 1-1.106.02L1.476 9.346a.75.75 0 1 1 1.05-1.07l2.74 2.742L12.44 2.92a.75.75 0 0 1 1.045-.07z"/>
        </svg>`;

/**
 * Code copy button error icon
 */
const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.293 2.293a1 1 0 0 1 1.414 0L8 6.586l4.293-4.293a1 1 0 0 1 1.414 1.414L9.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414L8 9.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L6.586 8 2.293 3.707a1 1 0 0 1 0-1.414z"/>
        </svg>`;

/**
 * Code copy button clipboard icon
 */
const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
</svg>`;

/**
 * Function to change the icon of the copy button based on success or error.
 *
 * @param {HTMLElement} button - The button element to change the icon for.
 * @param {boolean} isSuccess - If true, show success icon; if false, show error icon.
 * @return {void}
 */
const changeIcon = (button, isSuccess) => {
  button.innerHTML = isSuccess ? successIcon : errorIcon;
  setTimeout(() => {
    button.innerHTML = copyIcon; // Reset to copy icon
  }, 2000);
};

/**
 * Extracts code from a table format, ignoring line numbers
 * @param {HTMLElement} codeBlock - The code block element containing the table.
 * @return {string} - The extracted code as a string, with each line separated by a newline character.
 * @example // Assuming codeBlock is a <pre><code> element containing a table
 * getCodeFromTable(codeBlock);
 */
const getCodeFromTable = (codeBlock) => {
  return [...codeBlock.querySelectorAll("tr")]
    .map((row) => {
      const codeCell = row.querySelector("td:last-child");
      return codeCell ? codeCell.textContent.trimEnd() : "";
    })
    .join("\n");
};

const getNonTableCode = (codeBlock) => {
  return codeBlock.textContent.trim();
};

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    const pre = codeBlock.parentNode;
    pre.style.position = "relative";

    const copyBtn = document.createElement("button");
    copyBtn.className = "clipboard-button";
    copyBtn.innerHTML = copyIcon;
    copyBtn.setAttribute("aria-label", "Copy code to clipboard");
    pre.appendChild(copyBtn);

    copyBtn.addEventListener("click", async () => {
      try {
        const isTableFormat = codeBlock.querySelector("table") !== null;
        const codeToCopy = isTableFormat
          ? getCodeFromTable(codeBlock)
          : getNonTableCode(codeBlock);

        await navigator.clipboard.writeText(codeToCopy);
        changeIcon(copyBtn, true);
      } catch (error) {
        console.error("Failed to copy text: ", error);
        changeIcon(copyBtn, false);
      }
    });

    let ticking = false;
    pre.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          copyBtn.style.right = `-${pre.scrollLeft}px`;
          ticking = false;
        });
        ticking = true;
      }
    });
  });
});
