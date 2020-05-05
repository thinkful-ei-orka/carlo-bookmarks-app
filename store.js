const bookmarks = []; // Initialize empty bookmarks array of objects
const adding = false; // Create/ page state
const error = 0; // Error page state (0 = no error, 1 = error)
const errorMessage = ""; // Global error message for use on all pages.
const filter = -1; // Filter value. Unfiltered = -1.
const edit = false; // Edit page state
const tempId = 0; // Stored ID for page state transition

// Find bookmark in bookmarks array by ID
function findById(id) {
    return this.bookmarks.find(currentItem => currentItem.id === id);
};

// Add bookmark to store
function addBookmark (item) {
    // Add expanded key-value pair and push new bookmark to store
    let expandedObject = {
        expanded: false
    }; 

    Object.assign(item, expandedObject);
    this.bookmarks.push(item);
}

// Find and update bookmark by ID and data passed through
function findAndUpdate (id, newData) {
    let newItem = this.findById(id);

    Object.assign(newItem, newData);
}

// Find and delete bookmark by ID
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
