export default {
    getItems,
    createItem,
    updateItem,
    deleteItem
};

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/carlop/bookmarks';

function getItems() {
    return fetch(`${BASE_URL}`);
}

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

function updateItem(id, updateData) {
    let newUrl = `${BASE_URL}/${id}`;
    let newItem = JSON.stringify(updateData);

    return fetch(newUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: newItem
    });
}

function deleteItem(id) {
    let newUrl = `${BASE_URL}/${id}`;

    return fetch(newUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
}
