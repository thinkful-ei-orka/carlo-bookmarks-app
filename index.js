

import store from './store.js';
import api from './api.js';
import bookmarks from './bookmarks.js';

const main = function () {
  api.getItems()
    .then(res => {
        if (res.ok) { 
            return res.json();
        }
        store.errorMessage = res.statusText;
        store.error = 1;
        bookmarks.renderPage();
        throw new Error(store.errorMessage);
    })
    .then((items) => {
        store.error = 0;
        items.forEach((item) => store.addBookmark(item));
        console.log(store.bookmarks)
        
        bookmarks.renderPage();
    }).catch(err => console.error(err));

  bookmarks.bindEventListeners();
};

$(main);
