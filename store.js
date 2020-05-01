const bookmarks = [];
const adding = false;
const error = null;
const filter = 0;

function findById(id) {
    return this.bookmarks.find(currentItem => currentItem.id === id);
};

function addBookmark (item) {
    // Add expanded key-value pair
    let expandedObject = {
        expanded: false
    };

    Object.assign(item, expandedObject);
    this.bookmarks.push(item);
}

const findAndUpdate = function (id, newData) {
    let newItem = this.findById(id);
  
    Object.assign(newItem, newData);
}


export default {
    bookmarks,
    adding,
    error,
    filter,
    addBookmark,
    findById,
    findAndUpdate
}
