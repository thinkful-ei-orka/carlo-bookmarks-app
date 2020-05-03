export default {
    getItems,
    createItem,
    updateItem,
    deleteItem
};

// Base URL for API
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/carlop/bookmarks';

// GET items from API
function getItems() {
    return fetch(`${BASE_URL}`);
}

// POST item to API
function createItem(title, url, desc, rating) {
    let newBookmark = {
        'title': title,
        'url': url,
        'desc': desc,
        'rating': rating
    };
    
    newBookmark = JSON.stringify(newBookmark);


    return fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newBookmark
    });
}

// PATCH item to API
function updateItem(id, updateData) {
    let newUrl = `${BASE_URL}/${id}`;
    let newItem = JSON.stringify(updateData);

    return fetch(newUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: newItem
    });
}

// DELETE item from API
function deleteItem(id) {
    let newUrl = `${BASE_URL}/${id}`;

    return fetch(newUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
}
