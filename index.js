import store from './store.js';
import api from './api.js';
import bookmarks from './bookmarks.js';

const main = function () {
  api.getItems()
    .then(items => {
      store.error = 0;
      items.forEach((item) => store.addBookmark(item));
      bookmarks.renderPage();
    }).catch(err => {
      console.error(err);
      store.error = 1;
      bookmarks.renderPage();
    });

  bookmarks.bindEventListeners();
};

$(main);
