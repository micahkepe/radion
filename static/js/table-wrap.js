document.querySelectorAll("article[itemprop='articleBody'] > table").forEach(function (table) {
  var wrapper = document.createElement("figure");
  wrapper.style.overflowX = "auto";
  wrapper.style.webkitOverflowScrolling = "touch";
  wrapper.style.margin = "0";
  table.parentNode.insertBefore(wrapper, table);
  wrapper.appendChild(table);
});
