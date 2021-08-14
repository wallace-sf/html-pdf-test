"use strict";

var bodyElement = document.getElementsByTagName("body")[0];
var pageHeight = bodyElement.clientHeight;
var footerHeight = +Number(0.136026936 * pageHeight).toFixed(2);
var articleElements = document.querySelectorAll("body > article");
var state = {
  prependChildInNextArticle: null,
  add: function add(callback) {
    state.prependChildInNextArticle = callback;
  }
};

var NodeListToArray = function NodeListToArray(NodeList) {
  return Array.prototype.slice.call(NodeList);
};

var createFindMethod = function createFindMethod() {
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

var removeEmptyPages = function removeEmptyPages(pages) {
  pages.forEach(function (page) {
    if (page.childElementCount === 0) page.remove();
  });
};

var getChildrenShouldAppend = function getChildrenShouldAppend(element, page) {
  return NodeListToArray(element.children).filter(function (child) {
    if (child.hasAttribute("last-page")) return true;
    return child.getBoundingClientRect().bottom > page.getBoundingClientRect().bottom - footerHeight;
  }).reverse();
};

var insertNewArticle = function insertNewArticle(currentArticle) {
  if (currentArticle.nextElementSibling.tagName.toLowerCase() === "article") {
    return;
  }

  currentArticle.after(document.createElement("article"));
};

var insertTableRows = function insertTableRows(child, nextArticle, currentArticle) {
  var rowElements = getChildrenShouldAppend(NodeListToArray(child.childNodes).find(function (childTable) {
    return childTable.tagName && childTable.tagName.toLowerCase() === "tbody";
  }), currentArticle);

  if (rowElements.length) {
    var tableElement = document.createElement("table");
    var tHeadElement = document.createElement("thead");
    var tbodyElement = document.createElement("tbody");
    var trElement = document.createElement("tr");
    var thElement = document.createElement("th");
    var thElement_2 = document.createElement("th");
    var thElement_3 = document.createElement("th");
    var thElement_4 = document.createElement("th");
    thElement_3.classList.add("description-column");
    trElement.insertBefore(thElement, trElement.firstChild);
    trElement.insertBefore(thElement_2, trElement.firstChild);
    trElement.insertBefore(thElement_3, trElement.firstChild);
    trElement.insertBefore(thElement_4, trElement.firstChild);
    tHeadElement.insertBefore(trElement, tHeadElement.firstChild);
    tableElement.insertBefore(tbodyElement, tableElement.firstChild);
    tableElement.insertBefore(tHeadElement, tableElement.firstChild);
    nextArticle.insertBefore(tableElement, nextArticle.firstChild);
    rowElements.reverse().forEach(function (child) {
      tbodyElement.insertBefore(child, tbodyElement.firstChild);
    });
  }
};

var manageNextArticle = function manageNextArticle(nextArticle, currentArticle) {
  if (nextArticle) return;
  return insertNewArticle(currentArticle);
};

var prependChildInNextArticle = function prependChildInNextArticle(child, nextArticle, currentArticle) {
  if (child.tagName.toLowerCase() === "table") {
    return insertTableRows(child, nextArticle, currentArticle);
  }

  return nextArticle.insertBefore(child, nextArticle.firstChild);
};

var fixPageContents = function fixPageContents(pages) {
  NodeListToArray(pages, 2).map(function (page, pageIdx, currentArr) {
    var childrenShouldAppend = getChildrenShouldAppend(page, page);

    if (childrenShouldAppend.length) {
      manageNextArticle(currentArr[pageIdx + 1], page);
      var currentArticleElements = NodeListToArray(document.querySelectorAll("body > article"), 2);
      childrenShouldAppend.forEach(function (child) {
        prependChildInNextArticle(child, currentArticleElements[pageIdx + 1], page);
      });
    }
  });
};

var init = function init() {
  if (!state.prependChildInNextArticle) state.add(prependChildInNextArticle);
  createFindMethod();
  fixPageContents(articleElements);
  fixPageContents(document.querySelectorAll("body > article"));
  removeEmptyPages(document.querySelectorAll("body > article"));
};

bodyElement.onload = init;