const bodyElement = document.getElementsByTagName("body")[0];
const pageHeight = bodyElement.clientHeight;
const footerHeight = +Number(0.136026936 * pageHeight).toFixed(2);
const articleElements = document.querySelectorAll("body > article");

const state = {
  prependChildInNextArticle: null,
  add: (callback) => {
    state.prependChildInNextArticle = callback;
  },
};

const NodeListToArray = (NodeList) => {
  return Array.prototype.slice.call(NodeList);
};

const createFindMethod = () => {
  if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
      if (this == null) {
        throw new TypeError("Array.prototype.find called on null or undefined");
      }
      if (typeof predicate !== "function") {
        throw new TypeError("predicate must be a function");
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }
};

const removeEmptyPages = (pages) => {
  pages.forEach((page) => {
    if (page.childElementCount === 0) page.remove();
  });
};

const getChildrenShouldAppend = (element, page) => {
  return NodeListToArray(element.children)
    .filter((child) => {
      if (child.hasAttribute("last-page")) return true;

      return (
        child.getBoundingClientRect().bottom >
        page.getBoundingClientRect().bottom - footerHeight
      );
    })
    .reverse();
};

const insertNewArticle = (currentArticle) => {
  if (currentArticle.nextElementSibling.tagName.toLowerCase() === "article") {
    return;
  }

  currentArticle.after(document.createElement("article"));
};

const insertTableRows = (child, nextArticle, currentArticle) => {
  const rowElements = getChildrenShouldAppend(
    NodeListToArray(child.childNodes).find(
      (childTable) =>
        childTable.tagName && childTable.tagName.toLowerCase() === "tbody"
    ),
    currentArticle
  );

  if (rowElements.length) {
    const tableElement = document.createElement("table");
    const tHeadElement = document.createElement("thead");
    const tbodyElement = document.createElement("tbody");
    const trElement = document.createElement("tr");
    const thElement = document.createElement("th");
    const thElement_2 = document.createElement("th");
    const thElement_3 = document.createElement("th");
    const thElement_4 = document.createElement("th");

    thElement_3.classList.add("description-column");

    trElement.insertBefore(thElement, trElement.firstChild);
    trElement.insertBefore(thElement_2, trElement.firstChild);
    trElement.insertBefore(thElement_3, trElement.firstChild);
    trElement.insertBefore(thElement_4, trElement.firstChild);
    tHeadElement.insertBefore(trElement, tHeadElement.firstChild);
    tableElement.insertBefore(tbodyElement, tableElement.firstChild);
    tableElement.insertBefore(tHeadElement, tableElement.firstChild);

    nextArticle.insertBefore(tableElement, nextArticle.firstChild);
    rowElements.reverse().forEach((child) => {
      tbodyElement.insertBefore(child, tbodyElement.firstChild);
    });
  }
};

const manageNextArticle = (nextArticle, currentArticle) => {
  if (nextArticle) return;

  return insertNewArticle(currentArticle);
};

const prependChildInNextArticle = (child, nextArticle, currentArticle) => {
  if (child.tagName.toLowerCase() === "table") {
    return insertTableRows(child, nextArticle, currentArticle);
  }

  return nextArticle.insertBefore(child, nextArticle.firstChild);
};

const fixPageContents = (pages) => {
  NodeListToArray(pages, 2).map((page, pageIdx, currentArr) => {
    const childrenShouldAppend = getChildrenShouldAppend(page, page);

    if (childrenShouldAppend.length) {
      manageNextArticle(currentArr[pageIdx + 1], page);
      const currentArticleElements = NodeListToArray(
        document.querySelectorAll("body > article"),
        2
      );

      childrenShouldAppend.forEach((child) => {
        prependChildInNextArticle(
          child,
          currentArticleElements[pageIdx + 1],
          page
        );
      });
    }
  });
};

const init = () => {
  if (!state.prependChildInNextArticle) state.add(prependChildInNextArticle);
  createFindMethod();
  fixPageContents(articleElements);
  fixPageContents(document.querySelectorAll("body > article"));
  removeEmptyPages(document.querySelectorAll("body > article"));
};

bodyElement.onload = init;
