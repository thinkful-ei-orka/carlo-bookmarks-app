import $ from 'jquery';

import 'normalize.css';
import './index.css';

import store from './store';
import api from './api';
import bookmarks from './bookmarks';

const main = function () {
  api.getItems()
    .then(res => res.json())
    .then((items) => {
    items.forEach((item) => store.addItem(item));
    shoppingList.render();
  }).catch(err => console.error(err.message));


  bookmarks.bindEventListeners();
  bookmarks.render();
};

$(main);
