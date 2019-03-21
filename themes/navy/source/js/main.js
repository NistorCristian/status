(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var addClassToElement = require('./utils').addClassToElement;
var removeClassFromElement = require('./utils').removeClassFromElement;

/* Popups */

let community = document.querySelectorAll(".item--dropdown-community")[0];
let projects = document.querySelectorAll(".item--dropdown-projects")[0];

let popups = document.querySelectorAll(".popup-wrap");
let overlays = document.querySelectorAll(".popup-overlay");
let closeButtons = document.querySelectorAll(".popup__button--close");

let activePopup = null;
let activeOverlay = null;

community.addEventListener('click', function (event) {
  showPopup(popups[0]);
  event.preventDefault();
});

projects.addEventListener('click', function (event) {
  showPopup(popups[1]);
  event.preventDefault();
});

closeButtons.forEach(button => {
  button.addEventListener('click', closeActivePopup);
});

overlays.forEach(overlay => {
  overlay.addEventListener('click', closeActivePopup);
});

function showPopup(whichPopup) {
  activePopup = whichPopup;
  addClassToElement(whichPopup, "popup--shown");
}

function closeActivePopup() {
  removeClassFromElement(activePopup, "popup--shown");
  activePopup = null;
}

},{"./utils":2}],2:[function(require,module,exports){

/*--- Utils ---*/

function addClassToElement(element, className) {
    element.classList ? element.classList.add(className) : element.className += ' ' + className;
    return element;
}

function removeClassFromElement(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    } else {
        element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
    return element;
}

exports.addClassToElement = addClassToElement;
exports.removeClassFromElement = removeClassFromElement;

},{}]},{},[2,1])
//# sourceMappingURL=main.js.map
