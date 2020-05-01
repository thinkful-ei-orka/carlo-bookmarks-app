// import $ from 'jquery';

// import 'normalize.css';
// import './index.css';

// import store from './store.js';
import api from './api.js';
// import bookmarks from './bookmarks.js';

const main = function () {
  api.getItems()
    .then(res => res.json())
    .then((items) => {
    console.log(items)
  }).catch(err => console.error(err.message));


  // bookmarks.bindEventListeners();
  // bookmarks.render();
};

$(main);
