const bookmarks = [];
const adding = false;
const error = 0;
const errorMessage = "";
const filter = 0;
const edit = false;
const tempId = 0; // Stored ID for page state transition

function findById(id) {
    return this.bookmarks.find(currentItem => currentItem.id === id);
};

// function filterByRating(rating) {
//     console.log(`ran filterByRating`);
//     const 
//     if(rating >= 1 && rating <= 5) {
//         this.bookmarks = this.bookmarks.filter(currentItem => currentItem.rating === Number(rating));
//     }  
// }

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
    console.log(newItem);
    console.log(newData);
    Object.assign(newItem, newData);
    console.log(newItem);
}

function findAndDelete (id) {
    this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
};


export default {
    bookmarks,
    adding,
    error,
    errorMessage,
    filter,
    edit,
    tempId,
    addBookmark,
    findById,
    findAndUpdate,
    findAndDelete
}
