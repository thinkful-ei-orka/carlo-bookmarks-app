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

function findAndUpdate (id, newData) {
    let newItem = this.findById(id);
  
    Object.assign(newItem, newData);
}

function findAndDelete (id) {
    this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};


export default {
    bookmarks,
    adding,
    error,
    filter,
    addBookmark,
    findById,
    findAndUpdate,
    findAndDelete
}
